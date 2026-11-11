import "./globals.css";

import { Metadata, Viewport } from "next";

import ToastAndConfirmClient from "@/utilities/components/toast/ToastAndConfirm.client";
import { StaticsUrl } from "@/utilities/StaticsUrl";

const siteUrl = "https://hivadnet.ir";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: "هیوادنت",
	description: "",
	keywords: ["", ""],
	openGraph: {
		title: "هیوادنت",
		description: "",
		url: siteUrl,
		siteName: "هیوادنت",
		images: [
			{
				url: "/logo.png",
				width: 512,
				height: 512,
				alt: "لوگوی هیوادنت",
			},
		],
		locale: "fa_IR",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "هیوادنت",
		description: "",
		images: ["/logo.png"],
	},
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fa" dir="rtl">
			<head>
				<link rel="preconnect" href={StaticsUrl.FilsUrl} crossOrigin="anonymous" />
				<link rel="dns-prefetch" href={StaticsUrl.FilsUrl} />
			</head>
			<body className="font-sans antialiased">
				<main className="flex flex-col min-h-screen">
					{children}
					<ToastAndConfirmClient />
				</main>
			</body>
		</html>
	);
}
