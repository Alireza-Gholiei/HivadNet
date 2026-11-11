"use client";

import Cookies from "js-cookie";

import { errorHandle } from "../Extentions/ErrorHandller";
import { getJwtExpiryAndRoleId } from "./jwt.service";

export class ClientTokenService {
	static AccessTokenKey: string = "AccessToken";
	static RefreshTokenKey: string = "RefreshToken";
	static RoleIdKey: string = "roleId";
	static RefreshTokenExpire: number = 60;

	static async setTokens(accessToken: string, refreshToken: string) {
		const { exp, roleId } = getJwtExpiryAndRoleId(accessToken);

		Cookies.set(this.AccessTokenKey, accessToken, {
			httpOnly: false,
			secure: true,
			expires: exp,
			sameSite: "none",
			path: "/",
		});

		const now = new Date();
		const expires = new Date(now);
		expires.setDate(now.getDate() + this.RefreshTokenExpire);

		Cookies.set(this.RefreshTokenKey, refreshToken, {
			httpOnly: false,
			secure: true,
			expires: expires,
			sameSite: "none",
			path: "/",
		});

		if (roleId) {
			this.setRoleId(roleId);
		}
	}

	static getAccessToken() {
		return Cookies.get("AccessToken") ?? null;
	}

	static getRefreshToken() {
		return Cookies.get("RefreshToken") ?? null;
	}

	static clearTokens() {
		Cookies.remove("AccessToken");
		Cookies.remove("RefreshToken");
	}

	static async getValidAccessToken(): Promise<string | null> {
		const accessToken = this.getAccessToken();
		if (accessToken) return accessToken;

		const refreshToken = this.getRefreshToken();
		if (!refreshToken) return null;

		try {
			const relust = await fetch("/api/auth/refresh", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					RefreshToken: refreshToken,
					IsPage: true,
				}),
			});

			if (!relust.ok) return null;

			const data = await relust.json();

			return data.AccessToken;
		} catch (e) {
			errorHandle(e);
		}

		return null;
	}

	static isLogin(): boolean {
		return !!(this.getAccessToken() || this.getRefreshToken());
	}

	static setRoleId(roleId: string) {
		const now = new Date();
		const expires = new Date(now);
		expires.setDate(now.getDate() + this.RefreshTokenExpire);

		Cookies.set(this.RoleIdKey, roleId, {
			httpOnly: false,
			secure: true,
			expires: expires,
			sameSite: "none",
			path: "/",
		});
	}

	static getRoleId(): string | null {
		return Cookies.get("roleId") ?? null;
	}
}
