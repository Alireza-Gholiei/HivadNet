import { NextResponse } from "next/server";

import { TokenService } from "@/utilities/services/token.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export async function POST(req: Request) {
    const { RefreshToken, IsPage } = await req.json();

    try {
        const result = await fetch(`${StaticsUrl.SSOUrl}${StaticsUrl.RefreshTokenApi}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ RefreshToken }),
        });

        if (!result.ok) {
            return NextResponse.json({ success: false, status: 401 });
        }

        const data = await result.json();
        const accessToken = data.Data.AccessToken;
        const refreshToken = data.Data.RefreshToken;

        const response = NextResponse.json({
            success: true,
            AccessToken: accessToken,
            RefreshToken: refreshToken
        });

        if (IsPage) {
            TokenService.setTokensResponse(accessToken, refreshToken, response);
        }

        return response;
    } catch (e) {
        console.error(`refresh failed:${RefreshToken},${IsPage}`, e);
        return NextResponse.json({ success: false });
    }
}
