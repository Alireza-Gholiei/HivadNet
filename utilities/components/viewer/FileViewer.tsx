"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
	Download,
	FileWarning,
	ImageIcon,
	Loader2,
	Maximize2,
	Minus,
	Plus,
	RefreshCcw,
	RotateCw,
	UploadCloud,
} from "lucide-react";
import { Button } from "../ui/button";
import { FileViewerType } from "@/utilities/Extentions/Shared";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./PdfViewer").then((mod) => mod.PdfViewer), {
	ssr: false,
});

interface FileViewerProps {
	url: string;
	fileName?: string;
	title?: string;
	fileType?: FileViewerType;
	onDownload: () => Promise<void>;
}

const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "avif"];
const pdfExtensions = ["pdf"];
const videoExtensions = ["mp4", "webm", "ogg", "mov", "mkv"];
const audioExtensions = ["mp3", "wav", "ogg", "m4a", "aac"];
const textExtensions = ["txt", "json", "xml", "csv", "log", "md"];

const getExtension = (value?: string) => {
	if (!value) return "";

	const cleanValue = value.split("?")[0].split("#")[0];
	const lastPart = cleanValue.split("/").pop() || "";
	const extension = lastPart.split(".").pop()?.toLowerCase();

	return extension || "";
};

const getFileType = (params: { fileType?: FileViewerType; fileName?: string; url: string }): FileViewerType => {
	if (params.fileType) return params.fileType;

	const extensionFromFileName = getExtension(params.fileName);
	const extensionFromUrl = getExtension(params.url);
	const extension = extensionFromFileName || extensionFromUrl;

	if (imageExtensions.includes(extension)) return "image";
	if (pdfExtensions.includes(extension)) return "pdf";
	if (videoExtensions.includes(extension)) return "video";
	if (audioExtensions.includes(extension)) return "audio";
	if (textExtensions.includes(extension)) return "text";

	return "unsupported";
};

const formatTitle = (title?: string, fileName?: string) => {
	if (title && title !== "فایل") return title;
	return fileName || title || "فایل";
};

export const FileViewer: React.FC<FileViewerProps> = ({ url, fileName, fileType, title = "فایل", onDownload }) => {
	const type = useMemo(
		() =>
			getFileType({
				url,
				fileName,
				fileType,
			}),
		[url, fileName, fileType],
	);

	const finalTitle = useMemo(() => formatTitle(title, fileName), [title, fileName]);

	const [isDownloading, setIsDownloading] = useState(false);
	const [hasError, setHasError] = useState(false);

	const [zoom, setZoom] = useState(1);
	const [rotation, setRotation] = useState(0);

	const [textContent, setTextContent] = useState("");
	const [textLoading, setTextLoading] = useState(false);
	const [textError, setTextError] = useState(false);

	useEffect(() => {
		setHasError(false);
		setZoom(1);
		setRotation(0);
		setTextContent("");
		setTextError(false);
	}, [url]);

	useEffect(() => {
		if (type !== "text") return;

		let isMounted = true;

		const loadText = async () => {
			try {
				setTextLoading(true);
				setTextError(false);

				const response = await fetch(url);

				if (!response.ok) {
					throw new Error("Cannot load text file");
				}

				const text = await response.text();

				if (isMounted) {
					setTextContent(text);
				}
			} catch {
				if (isMounted) {
					setTextError(true);
				}
			} finally {
				if (isMounted) {
					setTextLoading(false);
				}
			}
		};

		void loadText();

		return () => {
			isMounted = false;
		};
	}, [type, url]);

	const handleDownload = async () => {
		try {
			setIsDownloading(true);
			await onDownload();
		} finally {
			setIsDownloading(false);
		}
	};

	const handleZoomIn = () => {
		setZoom((prev) => Math.min(prev + 0.2, 3));
	};

	const handleZoomOut = () => {
		setZoom((prev) => Math.max(prev - 0.2, 0.4));
	};

	const handleRotate = () => {
		setRotation((prev) => prev + 90);
	};

	const handleResetView = () => {
		setZoom(1);
		setRotation(0);
	};

	const handleOpenInNewTab = () => {
		window.open(url, "_blank", "noopener,noreferrer");
	};

	const renderLoading = () => {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center gap-3 text-gray-500">
				<Loader2 className="h-8 w-8 animate-spin" />
				<p className="text-sm">در حال بارگذاری فایل...</p>
			</div>
		);
	};

	const renderError = () => {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-md bg-gray-50 p-8 text-center">
				<FileWarning className="h-12 w-12 text-red-500" />
				<div>
					<p className="font-medium text-gray-800">خطا در نمایش فایل</p>
					<p className="mt-1 text-sm text-gray-500">امکان نمایش پیش‌نمایش این فایل وجود ندارد.</p>
				</div>

				<Button variant="outline" size="sm" onClick={() => void handleDownload()} disabled={isDownloading}>
					{isDownloading ? (
						<Loader2 className="ml-2 h-4 w-4 animate-spin" />
					) : (
						<Download className="ml-2 h-4 w-4" />
					)}
					دانلود فایل
				</Button>
			</div>
		);
	};

	const renderUnsupported = () => {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-md bg-gray-50 p-8 text-center">
				<FileWarning className="h-12 w-12 text-gray-400" />

				<div>
					<p className="font-medium text-gray-800">پیش‌نمایش این فرمت فایل پشتیبانی نمی‌شود.</p>
					<p className="mt-1 text-sm text-gray-500">برای مشاهده فایل، آن را دانلود کنید.</p>
				</div>

				<Button variant="outline" size="sm" onClick={() => void handleDownload()} disabled={isDownloading}>
					{isDownloading ? (
						<Loader2 className="ml-2 h-4 w-4 animate-spin" />
					) : (
						<UploadCloud className="ml-2 h-4 w-4" />
					)}
					دانلود فایل
				</Button>
			</div>
		);
	};

	const renderImage = () => {
		if (hasError) return renderError();

		return (
			<div className="flex h-full w-full items-center justify-center overflow-auto bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%),linear-gradient(-45deg,#f3f4f6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f3f4f6_75%),linear-gradient(-45deg,transparent_75%,#f3f4f6_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]">
				<img
					src={url}
					alt={finalTitle}
					onError={() => setHasError(true)}
					className="max-h-full max-w-full select-none rounded-md object-contain shadow-sm transition-transform duration-200"
					style={{
						transform: `scale(${zoom}) rotate(${rotation}deg)`,
					}}
				/>
			</div>
		);
	};

	const renderPdf = () => {
		return <PdfViewer url={url} title={finalTitle} />;
	};

	const renderVideo = () => {
		if (hasError) return renderError();

		return (
			<div className="flex h-full w-full items-center justify-center bg-black">
				<video controls className="max-h-full w-full rounded-md" onError={() => setHasError(true)}>
					<source src={url} />
					مرورگر شما از پخش این ویدیو پشتیبانی نمی‌کند.
				</video>
			</div>
		);
	};

	const renderAudio = () => {
		if (hasError) return renderError();

		return (
			<div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gray-50 p-6">
				<div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50">
					<ImageIcon className="h-10 w-10 text-indigo-500" />
				</div>

				<p className="max-w-full truncate text-sm font-medium text-gray-700">{finalTitle}</p>

				<audio controls className="w-full max-w-2xl" onError={() => setHasError(true)}>
					<source src={url} />
					مرورگر شما از پخش این فایل صوتی پشتیبانی نمی‌کند.
				</audio>
			</div>
		);
	};

	const renderText = () => {
		if (textLoading) return renderLoading();
		if (textError) return renderError();

		return (
			<div className="h-full w-full overflow-auto rounded-md bg-white p-4 text-left direction-ltr">
				<pre className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-gray-800">{textContent}</pre>
			</div>
		);
	};

	const renderContent = () => {
		switch (type) {
			case "image":
				return renderImage();

			case "pdf":
				return renderPdf();

			case "video":
				return renderVideo();

			case "audio":
				return renderAudio();

			case "text":
				return renderText();

			default:
				return renderUnsupported();
		}
	};

	return (
		<div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 py-2">
				<div className="min-w-0">
					<p className="truncate text-sm font-semibold text-gray-800">{finalTitle}</p>
					<p className="mt-0.5 text-xs text-gray-400">نوع فایل: {type}</p>
				</div>

				<div className="flex items-center gap-1">
					{type === "image" && (
						<>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={handleZoomOut}
								title="کوچک‌نمایی"
							>
								<Minus className="h-4 w-4" />
							</Button>

							<span className="min-w-12 text-center text-xs text-gray-500">
								{Math.round(zoom * 100)}%
							</span>

							<Button type="button" variant="ghost" size="icon" onClick={handleZoomIn} title="بزرگ‌نمایی">
								<Plus className="h-4 w-4" />
							</Button>

							<Button type="button" variant="ghost" size="icon" onClick={handleRotate} title="چرخش">
								<RotateCw className="h-4 w-4" />
							</Button>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={handleResetView}
								title="بازنشانی"
							>
								<RefreshCcw className="h-4 w-4" />
							</Button>
						</>
					)}

					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={handleOpenInNewTab}
						title="باز کردن در تب جدید"
					>
						<Maximize2 className="h-4 w-4" />
					</Button>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => void handleDownload()}
						disabled={isDownloading}
						title="دانلود"
					>
						{isDownloading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Download className="h-4 w-4" />
						)}
					</Button>
				</div>
			</div>

			<div className="min-h-0 flex-1 overflow-hidden bg-gray-100 p-2">
				<div className="h-full w-full overflow-hidden rounded-md border border-gray-200 bg-white">
					{renderContent()}
				</div>
			</div>
		</div>
	);
};
