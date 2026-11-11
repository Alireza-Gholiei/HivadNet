"use client";

import React, { useMemo } from "react";
import { FilesService } from "@/dataBinding/services/Documents/FilesService";
import { Messenger } from "@/utilities/Messenger";
import { StaticsUrl } from "@/utilities/StaticsUrl";
import Popup from "../popup";
import { FileViewer } from "./FileViewer";
import { FileViewerType } from "@/utilities/Extentions/Shared";

export type PreviewState = {
	isOpen: boolean;
	fileName: string;
	title: string;
	fileType?: FileViewerType;
};

interface FileViewerPopupProps {
	isOpen: boolean;
	onClose: () => void;
	fileName: string;
	title?: string;
	fileType?: FileViewerType;
}

export const FileViewerPopup: React.FC<FileViewerPopupProps> = ({
	isOpen,
	onClose,
	fileName,
	fileType,
	title = "فایل",
}) => {
	const url = useMemo(() => {
		return `${StaticsUrl.DevUrl}v1/Files/Download/${fileName}`;
	}, [fileName]);

	const handleDownload = async () => {
		try {
			await FilesService.Download(fileName);
		} catch {
			Messenger.errorMessage("خطا در دانلود فایل");
		}
	};

	return (
		<Popup show={isOpen} onClose={onClose} title="مشاهده فایل">
			<div className="w-full h-[65vh] md:h-[75vh] min-h-105">
				{isOpen && (
					<FileViewer
						url={url}
						fileName={fileName}
						title={title}
						fileType={fileType}
						onDownload={handleDownload}
					/>
				)}
			</div>
		</Popup>
	);
};
