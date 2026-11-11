"use server";

import { cookies } from "next/headers";

import { errorHandle } from "../Extentions/ErrorHandller";
import { StaticsUrl } from "../StaticsUrl";
import { getJwtExpiryAndRoleId } from "./jwt.service";

export async function setServerTokens(
    accessToken: string,
    refreshToken: string
) {
    const { exp, roleId } = getJwtExpiryAndRoleId(accessToken);

    const store = await cookies();

    store.set("AccessToken", accessToken, {
        httpOnly: false,
        secure: true,
        expires: exp,
        sameSite: "none",
        path: "/",
    });

    const now = new Date();
    const expires = new Date(now);
    expires.setDate(now.getDate() + 60);

    store.set("RefreshToken", refreshToken, {
        httpOnly: false,
        secure: true,
        expires: expires,
        sameSite: "none",
        path: "/",
    });

    if (roleId) {
        await setServerRoleId(roleId);
    }
}

export async function getServerAccessToken(): Promise<string | null> {
    const store = await cookies();
    return store.get("AccessToken")?.value ?? null;
}

export async function getServerRefreshToken(): Promise<string | null> {
    const store = await cookies();
    return store.get("RefreshToken")?.value ?? null;
}

export async function clearServerTokens(): Promise<void> {
    const store = await cookies();
    store.delete("AccessToken");
    store.delete("RefreshToken");
}

export async function getValidServerAccessToken(
    refreshToken: string
): Promise<string | null> {
    try {
        const refreshUrl = `${StaticsUrl.SSOUrl}${StaticsUrl.RefreshTokenApi}`;

        const r = await fetch(refreshUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ RefreshToken: refreshToken }),
        });

        if (!r.ok) throw new Error(`Refresh failed: ${r.status}`);

        const parsed = await r.json();
        if (!parsed?.Data) throw new Error("Invalid refresh payload");

        await setServerTokens(
            parsed.Data.AccessToken,
            parsed.Data.RefreshToken
        );

        return parsed.Data.AccessToken;
    } catch (e) {
        errorHandle(e);
    }
    return null;
}

export async function isServerLogin(): Promise<boolean> {
    const accessToken = await getServerAccessToken();
    const refreshToken = await getServerRefreshToken();

    return !!(accessToken || refreshToken);
}

export async function getServerRoleId(): Promise<string | null> {
    const store = await cookies();
    return store.get("roleId")?.value ?? null;
}

export async function setServerRoleId(roleId: string): Promise<void> {
    const store = await cookies();

    const now = new Date();
    const expires = new Date(now);
    expires.setDate(now.getDate() + 60);

    store.set("roleId", roleId, {
        httpOnly: false,
        secure: true,
        expires: expires,
        sameSite: "none",
        path: "/",
    });
}