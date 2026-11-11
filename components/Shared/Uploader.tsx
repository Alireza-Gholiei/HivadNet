"use client";

import {
	AlertCircle,
	FileArchive,
	FileAudio,
	FileImage,
	FileText,
	FileVideo,
	RefreshCcw,
	UploadCloud,
	X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/utilities/components/ui/button";

type UploaderProps = {
	value?: File | null;
	onChange: (file: File | null) => void;
	error?: string;
	label?: string;
	required?: boolean;
	accept?: string;
	maxSizeMB?: number;
	disabled?: boolean;
	helperText?: string;
};

type FileCategory = "image" | "pdf" | "video" | "audio" | "text" | "archive" | "unknown";

const formatFileSize = (bytes: number) => {
	if (bytes === 0) return "0 KB";

	const units = ["B", "KB", "MB", "GB"];
	const index = Math.floor(Math.log(bytes) / Math.log(1024));
	const size = bytes / Math.pow(1024, index);

	return `${size.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
};

const getFileExtension = (fileName?: string) => {
	if (!fileName) return "";
	return fileName.split(".").pop()?.toLowerCase() || "";
};

const getFileCategory = (file?: File | null): FileCategory => {
	if (!file) return "unknown";

	const extension = getFileExtension(file.name);
	const mimeType = file.type;

	if (mimeType.startsWith("image/")) return "image";
	if (mimeType === "application/pdf" || extension === "pdf") return "pdf";
	if (mimeType.startsWith("video/")) return "video";
	if (mimeType.startsWith("audio/")) return "audio";
	if (mimeType.startsWith("text/") || ["txt", "json", "xml", "csv", "log", "md"].includes(extension)) return "text";

	if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) return "archive";

	return "unknown";
};

const getFileCategoryLabel = (category: FileCategory) => {
	switch (category) {
		case "image":
			return "تصویر";
		case "pdf":
			return "PDF";
		case "video":
			return "ویدیو";
		case "audio":
			return "صوت";
		case "text":
			return "متن";
		case "archive":
			return "فشرده";
		default:
			return "فایل";
	}
};

const getFileIcon = (category: FileCategory) => {
	switch (category) {
		case "image":
			return <FileImage className="h-6 w-6 text-emerald-600" />;
		case "pdf":
			return <FileText className="h-6 w-6 text-rose-600" />;
		case "video":
			return <FileVideo className="h-6 w-6 text-violet-600" />;
		case "audio":
			return <FileAudio className="h-6 w-6 text-amber-600" />;
		case "text":
			return <FileText className="h-6 w-6 text-sky-600" />;
		case "archive":
			return <FileArchive className="h-6 w-6 text-orange-600" />;
		default:
			return <FileArchive className="h-6 w-6 text-slate-500" />;
	}
};

const getFileBadgeClassName = (category: FileCategory) => {
	switch (category) {
		case "image":
			return "bg-emerald-50 text-emerald-700 ring-emerald-100";
		case "pdf":
			return "bg-rose-50 text-rose-700 ring-rose-100";
		case "video":
			return "bg-violet-50 text-violet-700 ring-violet-100";
		case "audio":
			return "bg-amber-50 text-amber-700 ring-amber-100";
		case "text":
			return "bg-sky-50 text-sky-700 ring-sky-100";
		case "archive":
			return "bg-orange-50 text-orange-700 ring-orange-100";
		default:
			return "bg-slate-50 text-slate-600 ring-slate-100";
	}
};

// const normalizeAcceptItems = (accept?: string) => {
// 	if (!accept) return [];

// 	return accept
// 		.split(",")
// 		.map((item) => item.trim().toLowerCase())
// 		.filter(Boolean);
// };

// const isFileAccepted = (file: File, accept?: string) => {
// 	const acceptItems = normalizeAcceptItems(accept);

// 	if (!acceptItems.length) return true;

// 	const fileExtension = `.${getFileExtension(file.name)}`;
// 	const fileMimeType = file.type.toLowerCase();

// 	return acceptItems.some((item) => {
// 		if (item.endsWith("/*")) {
// 			const category = item.replace("/*", "");
// 			return fileMimeType.startsWith(`${category}/`);
// 		}

// 		if (item.startsWith(".")) {
// 			return fileExtension === item;
// 		}

// 		return fileMimeType === item;
// 	});
// };

const getAcceptDescription = (accept?: string) => {
	if (!accept) return "همه فرمت‌های مجاز";

	return accept
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean)
		.join("، ");
};

export default function Uploader({
	value,
	onChange,
	error,
	label = "فایل",
	required = false,
	accept,
	maxSizeMB = 50,
	disabled = false,
	helperText,
}: UploaderProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);

	const [isDragging, setIsDragging] = useState(false);
	const [localError, setLocalError] = useState("");
	const [previewUrl, setPreviewUrl] = useState("");

	const maxSizeBytes = maxSizeMB * 1024 * 1024;
	const finalError = error || localError;

	const fileCategory = useMemo(() => getFileCategory(value), [value]);
	const fileExtension = useMemo(() => getFileExtension(value?.name), [value]);

	useEffect(() => {
		if (!value || fileCategory !== "image") {
			setPreviewUrl("");
			return;
		}

		const objectUrl = URL.createObjectURL(value);
		setPreviewUrl(objectUrl);

		return () => {
			URL.revokeObjectURL(objectUrl);
		};
	}, [value, fileCategory]);

	const resetInputValue = () => {
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const validateAndSetFile = (file?: File) => {
		setLocalError("");

		if (!file) return;

		if (file.size > maxSizeBytes) {
			setLocalError(`حجم فایل نباید بیشتر از ${maxSizeMB} مگابایت باشد.`);
			onChange(null);
			resetInputValue();
			return;
		}

		// if (!isFileAccepted(file, accept)) {
		// 	setLocalError("فرمت فایل انتخاب‌شده مجاز نیست.");
		// 	onChange(null);
		// 	resetInputValue();
		// 	return;
		// }

		onChange(file);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		validateAndSetFile(file);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		setIsDragging(false);

		if (disabled) return;

		const file = e.dataTransfer.files?.[0];
		validateAndSetFile(file);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (!disabled) {
			setIsDragging(true);
		}
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.currentTarget.contains(e.relatedTarget as Node)) return;

		setIsDragging(false);
	};

	const handleOpenFileDialog = () => {
		if (disabled) return;
		inputRef.current?.click();
	};

	const handleRemoveFile = (e?: React.MouseEvent<HTMLButtonElement>) => {
		e?.stopPropagation();

		onChange(null);
		setLocalError("");
		resetInputValue();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleOpenFileDialog();
		}
	};

	return (
		<div className="w-full">
			{label && (
				<div className="mb-2 flex items-center justify-between gap-2">
					<label className="text-sm font-semibold text-slate-700">
						{label}
						{required && <span className="mr-1 text-rose-500">*</span>}
					</label>

					<span className="text-xs text-slate-400">حداکثر {maxSizeMB} مگابایت</span>
				</div>
			)}

			<input
				ref={inputRef}
				type="file"
				accept={accept}
				disabled={disabled}
				onChange={handleInputChange}
				className="hidden"
			/>

			<div
				role="button"
				tabIndex={disabled ? -1 : 0}
				onClick={handleOpenFileDialog}
				onKeyDown={handleKeyDown}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				className={[
					"group relative w-full overflow-hidden rounded-2xl border-2 border-dashed p-4 outline-none transition-all duration-200",
					"flex flex-col items-center justify-center text-center",
					disabled
						? "cursor-not-allowed bg-slate-50 opacity-60"
						: "cursor-pointer bg-white hover:border-indigo-300 hover:bg-indigo-50/30",
					isDragging ? "scale-[1.01] border-indigo-500 bg-indigo-50 shadow-sm" : "border-slate-300",
					finalError ? "border-rose-400 bg-rose-50/50 hover:border-rose-400 hover:bg-rose-50/60" : "",
					!disabled
						? "focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-100"
						: "",
				].join(" ")}
			>
				<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-l from-indigo-500 via-sky-400 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />

				{value ? (
					<div className="w-full">
						<div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
							<div className="relative flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100 sm:h-20 sm:w-24">
								{previewUrl ? (
									<img src={previewUrl} alt={value.name} className="h-full w-full object-cover" />
								) : (
									<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
										{getFileIcon(fileCategory)}
									</div>
								)}
							</div>

							<div className="min-w-0 flex-1 text-right">
								<div className="mb-2 flex flex-wrap items-center gap-2">
									<span
										className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getFileBadgeClassName(
											fileCategory,
										)}`}
									>
										{getFileCategoryLabel(fileCategory)}
									</span>

									{fileExtension && (
										<span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-100">
											.{fileExtension}
										</span>
									)}
								</div>

								<p className="truncate text-sm font-bold text-slate-800">{value.name}</p>

								<p className="mt-1 text-xs text-slate-500">
									{formatFileSize(value.size)}
									{value.type ? ` • ${value.type}` : ""}
								</p>
							</div>

							<div className="flex shrink-0 items-center justify-end gap-2">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										handleOpenFileDialog();
									}}
									disabled={disabled}
									className="h-9 rounded-full px-3 text-slate-600"
								>
									<RefreshCcw className="ml-1.5 h-4 w-4" />
									تعویض
								</Button>

								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={handleRemoveFile}
									disabled={disabled}
									className="h-9 w-9 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600"
									title="حذف فایل"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				) : (
					<div className="flex min-h-44 w-full flex-col items-center justify-center px-4 py-6">
						<div
							className={[
								"mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all",
								isDragging ? "bg-indigo-100 text-indigo-700" : "bg-indigo-50 text-indigo-600",
							].join(" ")}
						>
							<UploadCloud className="h-8 w-8" />
						</div>

						<p className="text-sm font-bold text-slate-800">
							{isDragging ? "فایل را رها کنید" : "فایل را اینجا رها کنید"}
						</p>

						<p className="mt-1 text-xs text-slate-500">یا برای انتخاب فایل کلیک کنید</p>

						<div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
							<span className="rounded-full bg-slate-50 px-3 py-1 text-slate-500 ring-1 ring-slate-100">
								حداکثر {maxSizeMB} MB
							</span>

							<span className="rounded-full bg-slate-50 px-3 py-1 text-slate-500 ring-1 ring-slate-100">
								{getAcceptDescription(accept)}
							</span>
						</div>
					</div>
				)}
			</div>

			{helperText && !finalError && <p className="mt-2 text-xs leading-5 text-slate-500">{helperText}</p>}

			{finalError && (
				<div className="mt-2 flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600 ring-1 ring-rose-100">
					<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
					<p className="font-medium">{finalError}</p>
				</div>
			)}
		</div>
	);
}
