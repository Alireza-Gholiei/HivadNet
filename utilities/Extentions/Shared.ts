export type FileViewerType = "image" | "pdf" | "video" | "audio" | "text" | "unsupported";

export const getFileExtension = (fileName?: string) => {
	if (!fileName) return "";

	const cleanFileName = fileName.split("?")[0].split("#")[0];
	return cleanFileName.split(".").pop()?.toLowerCase() || "";
};

export const getFileType = (fileName?: string): FileViewerType => {
	const extension = getFileExtension(fileName);

	if (["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "avif"].includes(extension)) return "image";
	if (extension === "pdf") return "pdf";
	if (["mp4", "webm", "ogg", "mov", "mkv"].includes(extension)) return "video";
	if (["mp3", "wav", "ogg", "m4a", "aac"].includes(extension)) return "audio";
	if (["txt", "json", "xml", "csv", "log", "md"].includes(extension)) return "text";

	return "unsupported";
};
