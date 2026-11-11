import { NextResponse } from "next/server";

import { getJwtExpiry, getUserDetail, getUserId } from "./jwt.service";
import { ClientTokenService } from "./token.client";
import {
	clearServerTokens,
	getServerAccessToken,
	getServerRefreshToken,
	getServerRoleId,
	getValidServerAccessToken,
	isServerLogin,
	setServerRoleId,
	setServerTokens,
} from "./token.server";

export class TokenService {
	static AccessTokenKey: string = "AccessToken";
	static RefreshTokenKey: string = "RefreshToken";
	static RoleIdKey: string = "roleId";
	static RefreshTokenExpire: number = 60;

	static async getRoleId(): Promise<string | null> {
		if (typeof window !== "undefined") {
			return ClientTokenService.getRoleId();
		} else {
			return await getServerRoleId();
		}
	}

	static async setRoleId(roleId: string) {
		if (typeof window !== "undefined") {
			ClientTokenService.setRoleId(roleId);
		} else {
			await setServerRoleId(roleId);
		}
	}

	static async setTokens(accessToken: string, refreshToken: string) {
		if (typeof window !== "undefined") {
			await ClientTokenService.setTokens(accessToken, refreshToken);
		} else {
			await setServerTokens(accessToken, refreshToken);
		}
	}

	static setTokensResponse(accessToken: string, refreshToken: string, res: NextResponse) {
		const { exp } = getJwtExpiry(accessToken);
		const isProd = process.env.NODE_ENV === "production";

		res.cookies.set(this.AccessTokenKey, accessToken, {
			httpOnly: false,
			secure: true,
			path: "/",
			sameSite: isProd ? "lax" : ("none" as const),
			expires: exp,
		});

		const expires = new Date();
		expires.setDate(expires.getDate() + this.RefreshTokenExpire);

		res.cookies.set(this.RefreshTokenKey, refreshToken, {
			httpOnly: true,
			secure: true,
			path: "/",
			sameSite: isProd ? "lax" : ("none" as const),
			expires: expires,
		});
	}

	static async getAccessToken(): Promise<string | null> {
		if (typeof window !== "undefined") {
			return ClientTokenService.getAccessToken();
		} else {
			return await getServerAccessToken();
		}
	}

	static async getRefreshToken(): Promise<string | null> {
		if (typeof window !== "undefined") {
			return ClientTokenService.getRefreshToken();
		} else {
			return await getServerRefreshToken();
		}
	}

	static async clearTokens(): Promise<void> {
		if (typeof window !== "undefined") {
			ClientTokenService.clearTokens();
		} else {
			await clearServerTokens();
		}
	}

	static clearTokensResponse(res: NextResponse) {
		res.cookies.delete(this.AccessTokenKey);
		res.cookies.delete(this.RefreshTokenKey);
	}

	static async isLogin(): Promise<boolean> {
		if (typeof window !== "undefined") {
			return ClientTokenService.isLogin();
		} else {
			return await isServerLogin();
		}
	}

	static async getUserId(): Promise<string> {
		const token = await this.getAccessToken();
		if (!(token !== null && token !== undefined && token !== "")) {
			return "0";
		}

		return getUserId(token ?? "").userId;
	}

	static async getUserDetail() {
		const token = await this.getAccessToken();
		if (!(token !== null && token !== undefined && token !== "")) {
			return null;
		}

		return getUserDetail(token ?? "");
	}

	static async getValidAccessToken(): Promise<string | null> {
		const accessToken = await this.getAccessToken();
		if (accessToken) return accessToken;

		const refreshToken = await this.getRefreshToken();
		if (!refreshToken) return null;

		if (typeof window !== "undefined") {
			return await ClientTokenService.getValidAccessToken();
		} else {
			return await getValidServerAccessToken(refreshToken);
		}
	}
}
