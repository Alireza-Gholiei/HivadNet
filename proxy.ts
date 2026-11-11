import { NextRequest, NextResponse } from "next/server";

import { ApiResultWithData } from "./utilities/models/api-result.model";
import { TokenService } from "./utilities/services/token.service";
import { StaticsUrl } from "./utilities/StaticsUrl";

class PermissionFetchError extends Error {
	constructor(message = "Failed to fetch permission urls") {
		super(message);
		this.name = "PermissionFetchError";
	}
}

type CompiledPattern = {
	regex: RegExp;
	specificity: number;
	isNegation: boolean;
};

type PermissionCacheEntry = {
	value: string[];
	expiresAt: number;
};

type EnsureAccessTokenResult = {
	accessToken: string | null;
	roleId: string | null;
	tokenRefreshed: boolean;
	shouldClearCookies: boolean;
	newTokens?: {
		accessToken: string;
		refreshToken: string;
	};
};

const ROUTE_POLICIES = {
	public: ["/login", "/access-denied"],
} as const;

const PERMISSION_CACHE_TTL_MS = 60 * 1000;

const compiledPublicPatterns = compilePatterns([...ROUTE_POLICIES.public]);

const permissionCache = new Map<string, PermissionCacheEntry>();

function normalizePath(pathname: string): string {
	return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wildcardToRegex(pattern: string, ignoreCase = false): RegExp {
	const regexPattern =
		"^" +
		pattern
			.split("*")
			.map((part) => escapeRegex(part))
			.join(".*") +
		"$";

	return new RegExp(regexPattern, ignoreCase ? "i" : undefined);
}

function compilePatterns(patterns: string[]): CompiledPattern[] {
	return patterns.map((rawPattern) => {
		const isNegation = rawPattern.startsWith("!");
		const pattern = isNegation ? rawPattern.slice(1) : rawPattern;

		return {
			regex: wildcardToRegex(pattern),
			specificity: pattern.replace(/\*/g, "").length,
			isNegation,
		};
	});
}

function matchesCompiledPatterns(pathname: string, patterns: CompiledPattern[]): boolean {
	const normPath = normalizePath(pathname);

	let bestAllowSpecificity = 0;
	let bestDenySpecificity = 0;

	for (const pattern of patterns) {
		if (!pattern.regex.test(normPath)) continue;

		if (pattern.isNegation) {
			bestDenySpecificity = Math.max(bestDenySpecificity, pattern.specificity);
		} else {
			bestAllowSpecificity = Math.max(bestAllowSpecificity, pattern.specificity);
		}
	}

	return bestAllowSpecificity > bestDenySpecificity;
}

function isPublicPath(pathname: string): boolean {
	return matchesCompiledPatterns(pathname, compiledPublicPatterns);
}

function hasRouteAccess(pathname: string, allowedUrls: string[]): boolean {
	const normPath = normalizePath(pathname);

	return allowedUrls.some((allowed) => {
		const normAllowed = normalizePath(allowed);
		return wildcardToRegex(normAllowed, true).test(normPath);
	});
}

function redirectTo(req: NextRequest, path: string): NextResponse | null {
	if (normalizePath(req.nextUrl.pathname) === normalizePath(path)) {
		return null;
	}

	return NextResponse.redirect(new URL(path, req.nextUrl.origin));
}

function redirectToLogin(req: NextRequest): NextResponse | null {
	return redirectTo(req, "/login");
}

function redirectToAccessDenied(req: NextRequest): NextResponse | null {
	return redirectTo(req, "/access-denied");
}

function copySetCookie(from: NextResponse, to: NextResponse) {
	const setCookie = from.headers.get("Set-Cookie");
	if (setCookie) {
		to.headers.set("Set-Cookie", setCookie);
	}
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
	try {
		const parts = token.split(".");
		if (parts.length < 2) return null;

		const payload = parts[1];
		const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
		const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");

		const decoded = atob(padded);
		const json = JSON.parse(decoded);
		return json;
	} catch {
		return null;
	}
}

function isTokenExpired(token: string, clockSkewSeconds = 30): boolean {
	const payload = decodeJwtPayload(token);
	const exp = typeof payload?.exp === "number" ? payload.exp : null;

	if (!exp) return false;

	const now = Math.floor(Date.now() / 1000);
	return exp <= now + clockSkewSeconds;
}

async function tryRefreshToken(refreshToken: string) {
	const refreshUrl = `${StaticsUrl.SSOUrl}${StaticsUrl.RefreshTokenApi}`;

	const response = await fetch(refreshUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ RefreshToken: refreshToken }),
	});

	if (!response.ok) {
		throw new Error(`Refresh failed: ${response.status}`);
	}

	const payload = await response.json();

	if (!payload?.Data?.AccessToken || !payload?.Data?.RefreshToken) {
		throw new Error("Invalid refresh payload");
	}

	return payload.Data as { AccessToken: string; RefreshToken: string };
}

function getPermissionCacheKey(accessToken: string, currentRoleId?: string | null): string {
	const payload = decodeJwtPayload(accessToken);

	const userKey =
		typeof payload?.UserGuid === "string" && payload.UserGuid.trim()
			? payload.UserGuid.trim().toLowerCase()
			: typeof payload?.Id === "string" && payload.Id.trim()
				? payload.Id.trim()
				: typeof payload?.UserName === "string" && payload.UserName.trim()
					? payload.UserName.trim().toLowerCase()
					: `token:${accessToken.slice(-16)}`;

	const roleKey =
		typeof currentRoleId === "string" && currentRoleId.trim()
			? currentRoleId.trim()
			: typeof payload?.RoleId === "string" && payload.RoleId.trim()
				? payload.RoleId.trim()
				: "no-role";

	return `user:${userKey}|role:${roleKey}`;
}

async function fetchAllowedMenus(accessToken: string, roleId: string): Promise<string[]> {
	const cacheKey = getPermissionCacheKey(accessToken, roleId);
	const cached = permissionCache.get(cacheKey);

	if (cached && cached.expiresAt > Date.now()) {
		return cached.value;
	}

	try {
		const response = await fetch(`${StaticsUrl.SSOUrl}PermissionUrls`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				RoleId: `${roleId}`,
			},
		});

		if (!response.ok) {
			throw new PermissionFetchError(`Permission API failed with status ${response.status}`);
		}

		const menus = (await response.json()) as ApiResultWithData<string[]>;
		const allowedUrls = menus.Data.filter(Boolean).map((url) => normalizePath(url.toLowerCase()));

		permissionCache.set(cacheKey, {
			value: allowedUrls,
			expiresAt: Date.now() + PERMISSION_CACHE_TTL_MS,
		});

		return allowedUrls;
	} catch (error) {
		if (error instanceof PermissionFetchError) {
			throw error;
		}

		throw new PermissionFetchError();
	}
}

async function ensureAccessToken(req: NextRequest, response: NextResponse): Promise<EnsureAccessTokenResult> {
	const accessToken = req.cookies.get(TokenService.AccessTokenKey)?.value;
	const roleId = req.cookies.get(TokenService.RoleIdKey)?.value ?? "0";
	const refreshToken = req.cookies.get(TokenService.RefreshTokenKey)?.value;

	if (accessToken && !isTokenExpired(accessToken)) {
		return {
			accessToken,
			roleId,
			tokenRefreshed: false,
			shouldClearCookies: false,
		};
	}

	if (!refreshToken) {
		return {
			accessToken: null,
			roleId: null,
			tokenRefreshed: false,
			shouldClearCookies: Boolean(accessToken),
		};
	}

	try {
		const tokenData = await tryRefreshToken(refreshToken);
		TokenService.setTokensResponse(tokenData.AccessToken, tokenData.RefreshToken, response);

		return {
			accessToken: tokenData.AccessToken,
			roleId: roleId,
			tokenRefreshed: true,
			shouldClearCookies: false,
		};
	} catch {
		return {
			accessToken: null,
			roleId: null,
			tokenRefreshed: false,
			shouldClearCookies: true,
		};
	}
}

function buildLoginResponse(req: NextRequest): NextResponse {
	const response = redirectToLogin(req) ?? NextResponse.next();
	TokenService.clearTokensResponse(response);
	return response;
}

export async function proxy(req: NextRequest) {
	const path = normalizePath(req.nextUrl.pathname).toLowerCase();

	try {
		if (isPublicPath(path)) {
			return NextResponse.next();
		}

		const response = NextResponse.next();
		const authResult = await ensureAccessToken(req, response);

		if (!authResult.accessToken) {
			if (authResult.shouldClearCookies) {
				return buildLoginResponse(req);
			}

			return redirectToLogin(req) ?? response;
		}

		try {
			const allowedUrls = await fetchAllowedMenus(authResult.accessToken, authResult.roleId ?? "0");

			const accessGranted = hasRouteAccess(path, allowedUrls);

			if (accessGranted) {
				return response;
			}

			const deniedResponse = redirectToAccessDenied(req) ?? NextResponse.next();

			if (authResult.tokenRefreshed) {
				copySetCookie(response, deniedResponse);
			}

			return deniedResponse;
		} catch (error) {
			if (error instanceof PermissionFetchError) {
				const deniedResponse = redirectToAccessDenied(req) ?? NextResponse.next();

				if (authResult.tokenRefreshed) {
					copySetCookie(response, deniedResponse);
				}

				return deniedResponse;
			}

			throw error;
		}
	} catch (error) {
		console.error(error);
		return buildLoginResponse(req);
	}
}

export const config = {
	matcher: ["/((?!api|_next|favicon.ico|.*\\.(?:html?|css|js|png|jpg|jpeg|gif|svg|ico|woff2?|ttf)).*)"],
};
