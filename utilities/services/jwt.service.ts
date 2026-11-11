// utils/jwt.ts
type JwtPayload = { [key: string]: any };

function base64UrlDecode(str: string) {
	str = str.replace(/-/g, "+").replace(/_/g, "/");
	const pad = str.length % 4;
	if (pad === 2) str += "==";
	else if (pad === 3) str += "=";
	else if (pad === 1) throw new Error("Invalid base64 string");
	try {
		return atob(str);
	} catch {
		return Buffer.from(str, "base64").toString("binary");
	}
}

export function decodeJwt(token: string): JwtPayload | null {
	if (!token) return null;
	const parts = token.split(".");
	if (parts.length < 2) return null;
	try {
		const payloadStr = base64UrlDecode(parts[1]);
		const json = decodeURIComponent(
			payloadStr
				.split("")
				.map((c) => {
					const code = c.charCodeAt(0).toString(16).padStart(2, "0");
					return `%${code}`;
				})
				.join(""),
		);
		return JSON.parse(json) as JwtPayload;
	} catch (err) {
		console.error("decodeJwt error:", err);
		return null;
	}
}

export function getJwtExpiry(token: string): { exp: Date } {
	const payload = decodeJwt(token);

	const exp = payload?.exp;
	if (typeof exp !== "number") return { exp };

	const expDate = new Date(exp * 1000);

	return { exp: expDate };
}

export function getRoleId(token: string): { roleId: string } {
	const payload = decodeJwt(token);

	const roleId = payload?.RoleId;

	return { roleId };
}

export function getUserId(token: string): { userId: string } {
	const payload = decodeJwt(token);

	const userId = payload?.Id;

	return { userId };
}

export function getUserDetail(token: string): { userId: string; userName: string; fullName: string } {
	const payload = decodeJwt(token);

	const userId = payload?.Id;
	const fullName = payload?.FullName;
	const userName = payload?.UserName;

	return { userId, userName, fullName };
}

export function getJwtExpiryAndRoleId(token: string): { exp: Date; roleId: string } {
	const payload = decodeJwt(token);
	const roleId = payload?.RoleId;
	const exp = payload?.exp;

	if (typeof exp !== "number") return { exp, roleId };

	const expDate = new Date(exp * 1000);

	return { exp: expDate, roleId };
}
