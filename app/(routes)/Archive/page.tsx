"use client";

import { Archive, Eye, File, FileText, FolderOpen, FolderPlus, Plus, UploadCloud } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { ArchiveFolderTreeDto } from "@/dataBinding/models/Archive/ArchiveFolder/ArchiveFolderTreeDto";
import { ArchiveRecordGetGridDto } from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveRecordGetGridDto";
import { ArchiveFolderService } from "@/dataBinding/services/Archive/ArchiveFolderService";
import { ArchiveRecordService } from "@/dataBinding/services/Archive/ArchiveRecordService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";
import ArchiveFolderAddForm from "./ArchiveFolderAddForm";
import ArchiveDocumentAddForm from "./ArchiveDocumentAddForm";
import ArchiveFileAddForm from "./ArchiveFileAddForm";
import { ArchiveFolderRenameForm } from "./ArchiveFolderRenameForm";
import { ArchiveFolderMoveForm } from "./ArchiveFolderMoveForm";
import { ArchiveDocumentDetail } from "./ArchiveDocumentDetail";
import { ArchiveRecordRenameForm } from "./ArchiveRecordRenameForm";
import { ArchiveRecordMoveForm } from "./ArchiveRecordMoveForm";
import { ArchiveRecordArchiveConfirm } from "./ArchiveRecordArchiveConfirm";
import { FilesService } from "@/dataBinding/services/Documents/FilesService";
import { Messenger } from "@/utilities/Messenger";
import { getFileType } from "@/utilities/Extentions/Shared";
import { FileViewerPopup, PreviewState } from "@/utilities/components/viewer/FileViewerPopup";

export default function ArchiveExplorerPage() {
	const gridRef = useRef<DataGridRef>(null);

	const [folders, setFolders] = useState<ArchiveFolderTreeDto[]>([]);
	const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

	const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
	const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
	const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);

	const [actionFolder, setActionFolder] = useState<{
		id: number;
		name: string;
		type: "rename" | "move" | null;
	} | null>(null);

	const [actionRecord, setActionRecord] = useState<{
		id: number;
		title: string;
		type: "detail" | "rename" | "move" | "archive" | null;
	} | null>(null);

	const loadFolders = async () => {
		try {
			const data = await ArchiveFolderService.GetTree();
			setFolders(data);
		} catch (error) {
			console.error("Error loading folders:", error);
		}
	};

	useEffect(() => {
		void loadFolders();
	}, []);

	const fetchRecords = useCallback(
		async (params: BaseGrid) => {
			return await ArchiveRecordService.GetGrid(params, selectedFolderId ?? undefined);
		},
		[selectedFolderId],
	);

	const reloadGrid = useCallback(() => {
		gridRef.current?.reload?.();
	}, []);

	const handleSelectFolder = (folderId: number | null) => {
		setSelectedFolderId(folderId);
		setTimeout(() => {
			reloadGrid();
		}, 0);
	};

	const handleCloseAddFolder = () => setIsAddFolderModalOpen(false);
	const handleCloseAddDoc = () => setIsAddDocModalOpen(false);
	const handleCloseAddFile = () => setIsAddFileModalOpen(false);

	const handleDownload = async (fileName: string) => {
		try {
			await FilesService.Download(fileName);
		} catch {
			Messenger.errorMessage("خطا در دانلود فایل");
		}
	};

	const [preview, setPreview] = useState<PreviewState>({
		isOpen: false,
		fileName: "",
		title: "",
		fileType: undefined,
	});

	const handleOpenPreview = (doc: ArchiveRecordGetGridDto) => {
		setPreview({
			isOpen: true,
			fileName: doc.FileName ?? "",
			title: doc.Title || "مشاهده فایل",
			fileType: getFileType(doc.FileName ?? ""),
		});
	};

	const renderFolderTree = (parentId: number | null, depth: number = 0) => {
		const childFolders = folders.filter((f) => f.ParentFolderId === parentId);

		if (childFolders.length === 0) return null;

		return (
			<div className="flex flex-col gap-1 w-full">
				{childFolders.map((folder) => (
					<div
						key={folder.Id}
						className={`${depth > 0 ? "border-r border-gray-200" : ""}`}
						style={{ marginRight: depth > 0 ? "1rem" : "0" }}
					>
						<div
							className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
								selectedFolderId === folder.Id
									? "bg-indigo-100 text-indigo-800 font-bold"
									: "hover:bg-slate-200 text-slate-700"
							}`}
						>
							<div
								className="flex items-center gap-2 flex-1 overflow-hidden"
								onClick={() => handleSelectFolder(folder.Id)}
							>
								📁
								<span className="text-sm truncate">{folder.Name}</span>
							</div>
							<div className="flex items-center gap-1">
								<button
									onClick={(e) => {
										e.stopPropagation();
										setActionFolder({ id: folder.Id, name: folder.Name, type: "rename" });
									}}
									className="text-xs text-gray-500 hover:text-blue-600"
									title="تغییر نام"
								>
									✏️
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										setActionFolder({ id: folder.Id, name: folder.Name, type: "move" });
									}}
									className="text-xs text-gray-500 hover:text-orange-600"
									title="جابجایی"
								>
									➡️
								</button>
							</div>
						</div>
						{renderFolderTree(folder.Id, depth + 1)}
					</div>
				))}
			</div>
		);
	};

	const renderRecordCard = (record: ArchiveRecordGetGridDto) => {
		const isDocument = record.RecordType === "سند";

		return (
			<CardTable>
				<div className="flex flex-col items-stretch w-full p-5">
					{" "}
					<div className="flex items-start sm:items-center gap-4 mb-4 xl:mb-0 xl:mr-4 flex-1 min-w-0">
						{" "}
						<div
							className={`p-3.5 rounded-2xl border shrink-0 ${
								isDocument ? "bg-indigo-50 border-indigo-100" : "bg-emerald-50 border-emerald-100"
							}`}
						>
							{isDocument ? (
								<FileText className="text-indigo-600 w-6 h-6" />
							) : (
								<File className="text-emerald-600 w-6 h-6" />
							)}
						</div>
						<div className="flex flex-col gap-2 flex-1 min-w-0">
							<div className="flex flex-wrap items-center gap-2 min-w-0">
								<div className="flex flex-wrap items-center gap-4">
									<h3 className="font-bold text-base sm:text-lg text-slate-800 wrap-break-word">
										{" "}
										{record.Title || "بدون عنوان"}
									</h3>
								</div>
							</div>
							<div className="flex flex-wrap items-center gap-4 mr-2">
								<span
									className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
										record.IsArchived ? "bg-slate-100 text-slate-700" : "bg-blue-100 text-blue-700"
									}`}
								>
									{record.IsArchived ? "بایگانی شده" : "جاری"}
								</span>
								<span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-gray-100 text-gray-700">
									{record.RecordType}
								</span>
							</div>

							<div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium mt-1">
								<div className="flex items-center gap-1">
									<span className="text-slate-400">📁 پوشه:</span>
									<span className="text-slate-700">{record.FolderName}</span>
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center justify-center w-full gap-2 mt-2">
						{" "}
						{isDocument ? (
							<Button
								variant="outline"
								onClick={() => setActionRecord({ id: record.Id, title: record.Title, type: "detail" })}
								className="h-10 w-full justify-center gap-1.5 px-2 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
							>
								<FileText className="w-4 h-4 shrink-0" />
								<span>مشاهده/ویرایش</span>
							</Button>
						) : (
							<div className="flex sm:flex-col md:flex-row items-center justify-center w-full gap-6 mt-2">
								<Button
									variant="outline"
									className="h-10 w-full justify-center gap-1.5 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
									onClick={() => void handleOpenPreview(record)}
								>
									<Eye className="ml-1.5 h-4 w-4 shrink-0" />
									<span>مشاهده فایل</span>
								</Button>
								<Button
									variant="outline"
									className="h-10 w-full justify-center gap-1.5 px-2 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
									onClick={() => void handleDownload(record.FileName ?? "")}
								>
									<UploadCloud className="w-5 h-5 shrink-0" />
									<span>دانلود فایل</span>
								</Button>
							</div>
						)}
						<div className="flex gap-1 justify-center">
							<Button
								variant="ghost"
								onClick={() => setActionRecord({ id: record.Id, title: record.Title, type: "rename" })}
								title="تغییر نام"
							>
								✏️
							</Button>
							<Button
								variant="ghost"
								onClick={() => setActionRecord({ id: record.Id, title: record.Title, type: "move" })}
								title="جابجایی"
							>
								📁
							</Button>
							{!record.IsArchived && (
								<Button
									variant="ghost"
									onClick={() =>
										setActionRecord({ id: record.Id, title: record.Title, type: "archive" })
									}
									title="بایگانی"
								>
									📦
								</Button>
							)}
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium mt-1">
						<div className="flex items-center gap-1">
							<span className="text-slate-400">تاریخ ایجاد:</span>
							<span className="text-slate-700">{record.CreatedAt}</span>
						</div>
					</div>
				</div>
			</CardTable>
		);
	};

	return (
		<PageCard>
			<HraderTitle
				title="بایگانی و اسناد"
				description="مدیریت پوشه‌ها، متون سازمانی و فایل‌های پیوست"
				icon={<Archive />}
			/>

			<PageCardContent>
				<div className="flex flex-col lg:flex-row gap-6 items-start w-full">
					<div className="w-full lg:w-1/4 xl:w-1/5 shrink-0 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h3 className="font-bold text-slate-700 flex items-center gap-2">
								<FolderOpen className="w-5 h-5 text-indigo-500" />
								ساختار پوشه‌ها
							</h3>

							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 text-indigo-600 hover:bg-indigo-100 rounded-full"
								onClick={() => setIsAddFolderModalOpen(true)}
								title="افزودن پوشه جدید"
							>
								<FolderPlus className="w-5 h-5" />
							</Button>
						</div>

						<div className="flex flex-col gap-1 overflow-y-auto max-h-[60vh] pr-1">
							<div
								className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
									selectedFolderId === null
										? "bg-indigo-100 text-indigo-800 font-bold"
										: "hover:bg-slate-200 text-slate-700"
								}`}
							>
								<div
									className="flex items-center gap-2 flex-1 overflow-hidden"
									onClick={() => handleSelectFolder(null)}
								>
									📁
									<span className="text-sm truncate">پوشه اصلی (ریشه)</span>
								</div>
							</div>
							<div className="flex flex-col gap-2 overflow-y-auto">{renderFolderTree(null, 1)}</div>
						</div>
					</div>

					<div className="flex-1 w-full flex flex-col min-w-0">
						<div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto mb-4">
							<Button
								className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center gap-2 px-5"
								onClick={() => setIsAddDocModalOpen(true)}
							>
								<Plus className="w-5 h-5" />
								ایجاد سند متنی
							</Button>

							<Button
								className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center gap-2 px-5"
								onClick={() => setIsAddFileModalOpen(true)}
							>
								<UploadCloud className="w-5 h-5" />
								آپلود فایل
							</Button>
						</div>

						<DataGrid<ArchiveRecordGetGridDto> ref={gridRef} fetchFunction={fetchRecords} layout="grid">
							<Column<ArchiveRecordGetGridDto>
								field="Id"
								filterable={false}
								header="ترتیب پیش فرض"
								render={(record) => renderRecordCard(record)}
							/>

							<Column<ArchiveRecordGetGridDto>
								field="Title"
								header="عنوان"
								sortable
								render={() => null}
							/>
							<Column<ArchiveRecordGetGridDto>
								field="RecordType"
								header="نوع رکورد"
								sortable
								render={() => null}
							/>
							<Column<ArchiveRecordGetGridDto>
								field="FileName"
								header="نام فایل"
								sortable
								render={() => null}
							/>
							<Column<ArchiveRecordGetGridDto>
								field="CreatedAt"
								header="تاریخ ایجاد"
								sortable
								render={() => null}
							/>
						</DataGrid>
					</div>
				</div>
			</PageCardContent>

			<FileViewerPopup
				isOpen={preview.isOpen}
				onClose={() => setPreview((prev) => ({ ...prev, isOpen: false }))}
				fileName={preview.fileName}
				title={preview.title}
				fileType={preview.fileType}
			/>

			<Popup
				show={isAddFolderModalOpen}
				onClose={handleCloseAddFolder}
				title="ایجاد پوشه جدید"
				description="پوشه جدیدی برای دسته‌بندی اسناد ایجاد کنید"
			>
				<ArchiveFolderAddForm
					parentId={selectedFolderId}
					onSuccess={() => {
						handleCloseAddFolder();
						void loadFolders();
					}}
				/>
			</Popup>

			<Popup
				show={isAddDocModalOpen}
				onClose={handleCloseAddDoc}
				title="ایجاد سند متنی"
				description="یک متن سازمانی جدید همراه با قالب‌بندی ایجاد کنید"
				fullScreen
			>
				<ArchiveDocumentAddForm
					folderId={selectedFolderId}
					onSuccess={() => {
						handleCloseAddDoc();
						reloadGrid();
					}}
				/>
			</Popup>

			<Popup
				show={isAddFileModalOpen}
				onClose={handleCloseAddFile}
				title="آپلود فایل"
				description="فایل پیوست جدیدی را در سیستم بارگذاری کنید"
			>
				<ArchiveFileAddForm
					folderId={selectedFolderId}
					onSuccess={() => {
						handleCloseAddFile();
						reloadGrid();
					}}
				/>
			</Popup>

			{/* ================= مودال‌های پوشه ================= */}
			<Popup show={actionFolder?.type === "rename"} onClose={() => setActionFolder(null)} title="تغییر نام پوشه">
				{actionFolder?.type === "rename" && (
					<ArchiveFolderRenameForm
						folderId={actionFolder.id}
						currentName={actionFolder.name}
						onSuccess={() => {
							setActionFolder(null);
							void loadFolders();
						}}
						onCancel={() => setActionFolder(null)}
					/>
				)}
			</Popup>

			<Popup show={actionFolder?.type === "move"} onClose={() => setActionFolder(null)} title="جابجایی پوشه">
				{actionFolder?.type === "move" && (
					<ArchiveFolderMoveForm
						folderId={actionFolder.id}
						folderTitle={actionFolder.name}
						onSuccess={() => {
							setActionFolder(null);
							void loadFolders();
						}}
						onCancel={() => setActionFolder(null)}
					/>
				)}
			</Popup>

			{/* ================= مودال‌های رکورد ================= */}
			<Popup
				show={actionRecord?.type === "detail"}
				onClose={() => setActionRecord(null)}
				title="جزئیات و ویرایش سند متنی"
				fullScreen
			>
				{actionRecord?.type === "detail" && (
					<ArchiveDocumentDetail
						recordId={actionRecord.id}
						onSuccess={() => {
							setActionRecord(null);
							reloadGrid();
						}}
						onCancel={() => {
							setActionRecord(null);
							reloadGrid();
						}}
					/>
				)}
			</Popup>

			<Popup
				show={actionRecord?.type === "rename"}
				onClose={() => setActionRecord(null)}
				title="تغییر عنوان رکورد"
			>
				{actionRecord?.type === "rename" && (
					<ArchiveRecordRenameForm
						recordId={actionRecord.id}
						currentTitle={actionRecord.title}
						onSuccess={() => {
							setActionRecord(null);
							reloadGrid();
						}}
						onCancel={() => setActionRecord(null)}
					/>
				)}
			</Popup>

			<Popup show={actionRecord?.type === "move"} onClose={() => setActionRecord(null)} title="جابجایی رکورد">
				{actionRecord?.type === "move" && (
					<ArchiveRecordMoveForm
						recordId={actionRecord.id}
						recordTitle={actionRecord.title}
						onSuccess={() => {
							setActionRecord(null);
							reloadGrid();
						}}
						onCancel={() => setActionRecord(null)}
					/>
				)}
			</Popup>

			<Popup show={actionRecord?.type === "archive"} onClose={() => setActionRecord(null)} title="بایگانی رکورد">
				{actionRecord?.type === "archive" && (
					<ArchiveRecordArchiveConfirm
						recordId={actionRecord.id}
						recordTitle={actionRecord.title}
						onSuccess={() => {
							setActionRecord(null);
							reloadGrid();
						}}
						onCancel={() => setActionRecord(null)}
					/>
				)}
			</Popup>
		</PageCard>
	);
}
