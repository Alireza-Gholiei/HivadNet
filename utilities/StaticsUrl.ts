// export class StaticsUrl {
// 	public static SSOUrl = process.env.NEXT_PUBLIC_SSO_URL!;
// 	public static DevUrl = process.env.NEXT_PUBLIC_API_URL!;
// 	public static DocUrl = process.env.NEXT_PUBLIC_Doc_URL!;

// 	public static FilsUrl = `${this.DocUrl}v1/Files/Download/`;
// 	public static FileThumbnail = `${this.DocUrl}Files/Thumbnail/`;

// 	public static RefreshTokenApi = process.env.NEXT_PUBLIC_REFRESH_TOKEN_API!;
// }

export class StaticsUrl {
	public static SSOUrl =
		typeof window !== "undefined" && (window as any).API_SSO_URL
			? `${(window as any).API_SSO_URL}`
			: process.env.NEXT_PUBLIC_SSO_URL!;

	public static DevUrl =
		typeof window !== "undefined" && (window as any).API_BASE_URL
			? `${(window as any).API_BASE_URL}`
			: process.env.NEXT_PUBLIC_API_URL!;

	public static DocUrl =
		typeof window !== "undefined" && (window as any).API_DOC_URL
			? `${(window as any).API_DOC_URL}`
			: process.env.NEXT_PUBLIC_Doc_URL!;

	public static FilsUrl = `${this.DocUrl}v1/Files/Download/`;
	public static FileThumbnail = `${this.DocUrl}Files/Thumbnail/`;

	public static RefreshTokenApi = process.env.NEXT_PUBLIC_REFRESH_TOKEN_API!;
}
