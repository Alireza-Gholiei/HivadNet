"use client";

import {
	Eye,
	FileArchive,
	FileAudio,
	FileImage,
	FileText,
	FileVideo,
	FolderOpen,
	Plus,
	Trash2,
	UploadCloud,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import CustomerSelector from "@/components/customer/CustomerSelector";
import HraderTitle from "@/components/Shared/HraderTitle";
import { CustomerGetGridDto } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import { CustomerDocumentGetGridDto } from "@/dataBinding/models/Customer/Document/CustomerDocumentGetGridDto";
import { CustomerDocumentService } from "@/dataBinding/services/Customer/CustomerDocumentService";
import { FilesService } from "@/dataBinding/services/Documents/FilesService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { FileViewerPopup, PreviewState } from "@/utilities/components/viewer/FileViewerPopup";
import { Messenger } from "@/utilities/Messenger";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";
import CustomerDocumentAddForm from "./CustomerDocumentAddForm";
import { FileViewerType, getFileType } from "@/utilities/Extentions/Shared";

const getFileIcon = (fileType: FileViewerType) => {
	switch (fileType) {
		case "image":
			return <FileImage className="h-5 w-5 text-emerald-600" />;
		case "pdf":
			return <FileText className="h-5 w-5 text-rose-600" />;
		case "video":
			return <FileVideo className="h-5 w-5 text-violet-600" />;
		case "audio":
			return <FileAudio className="h-5 w-5 text-amber-600" />;
		case "text":
			return <FileText className="h-5 w-5 text-sky-600" />;
		default:
			return <FileArchive className="h-5 w-5 text-slate-500" />;
	}
};

const getFileTypeLabel = (fileType: FileViewerType) => {
	switch (fileType) {
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
		default:
			return "فایل";
	}
};

const getFileTypeBadgeClassName = (fileType: FileViewerType) => {
	switch (fileType) {
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
		default:
			return "bg-slate-50 text-slate-600 ring-slate-100";
	}
};

export default function CustomerDocumentsManager() {
	const gridRef = useRef<DataGridRef>(null);

	const [selectedCustomer, setSelectedCustomer] = useState<CustomerGetGridDto | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	useEffect(() => {
		if (selectedCustomer?.Id) {
			gridRef.current?.reload?.();
		}
	}, [selectedCustomer]);

	const fetchData = async (params: BaseGrid) => {
		return await CustomerDocumentService.GetGrid(params, selectedCustomer?.Id ?? 0);
	};

	const handleAddClick = () => {
		if (!selectedCustomer?.Id) {
			Messenger.errorMessage("ابتدا مشتری را انتخاب کنید");
			return;
		}

		setIsAddModalOpen(true);
	};

	const handleDelete = async (id: number) => {
		if (!confirm("آیا از حذف این مدرک اطمینان دارید؟")) return;

		try {
			await CustomerDocumentService.Delete(id);
			Messenger.successAlert("مدرک با موفقیت حذف شد");
			gridRef.current?.reload?.();
		} catch {
			Messenger.errorMessage("خطا در حذف مدرک");
		}
	};

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

	const handleOpenPreview = (doc: CustomerDocumentGetGridDto) => {
		setPreview({
			isOpen: true,
			fileName: doc.FileName,
			title: doc.Title || "مشاهده فایل",
			fileType: getFileType(doc.FileName),
		});
	};

	return (
		<PageCard>
			<HraderTitle
				title="اسناد و پرونده‌ها"
				description="مدیریت پرونده الکترونیک و مستندات مشتریان"
				icon={<FolderOpen />}
			/>

			<PageCardContent>
				<div className="space-y-5">
					<div className="overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-l from-indigo-50 via-white to-white p-4 shadow-sm">
						<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
							<div className="flex-1 space-y-3">
								<div>
									<p className="text-sm font-semibold text-slate-800">انتخاب مشتری</p>
									<p className="mt-1 text-xs text-slate-500">
										برای مشاهده و مدیریت اسناد، ابتدا مشتری موردنظر را انتخاب کنید.
									</p>
								</div>

								<CustomerSelector value={selectedCustomer} onChange={setSelectedCustomer} required />
							</div>
						</div>
					</div>

					<Button
						onClick={handleAddClick}
						disabled={!selectedCustomer?.Id}
						className="h-10 min-w-36 shadow-sm"
					>
						<Plus className="ml-2 h-4 w-4" />
						ثبت سند جدید
					</Button>

					{selectedCustomer ? (
						<div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
							<div className="mb-3 flex flex-col gap-2 border-b border-slate-100 px-1 pb-3 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<p className="text-sm font-bold text-slate-800">پرونده‌های ثبت‌شده</p>
									<p className="mt-1 text-xs text-slate-500">
										اسناد مشتری انتخاب‌شده را مشاهده، دانلود یا حذف کنید.
									</p>
								</div>

								<div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-100">
									<FolderOpen className="h-3.5 w-3.5" />
									{selectedCustomer.FullName || "مشتری انتخاب‌شده"}
								</div>
							</div>

							<DataGrid<CustomerDocumentGetGridDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
								<Column<CustomerDocumentGetGridDto>
									field="Id"
									filterable={false}
									header="اسناد"
									render={(doc) => {
										const fileType = getFileType(doc.FileName);

										return (
											<CardTable className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md">
												<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-l from-indigo-500 via-sky-400 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />

												<div className="flex h-full flex-col gap-4">
													<div className="flex items-start justify-between gap-3">
														<div className="flex min-w-0 items-start gap-3">
															<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-100">
																{getFileIcon(fileType)}
															</div>

															<div className="min-w-0">
																<h3 className="truncate text-sm font-bold text-slate-800">
																	{doc.Title || "بدون عنوان"}
																</h3>

																<p className="mt-1 truncate text-xs text-slate-400">
																	{doc.FileName || "نام فایل ثبت نشده"}
																</p>
															</div>
														</div>

														<span
															className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getFileTypeBadgeClassName(
																fileType,
															)}`}
														>
															{getFileTypeLabel(fileType)}
														</span>
													</div>

													<p className="line-clamp-2 min-h-10 text-sm leading-6 text-slate-500">
														{doc.Description || "برای این سند توضیحاتی ثبت نشده است."}
													</p>

													<div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
														<div className="flex flex-wrap gap-2">
															<Button
																variant="ghost"
																size="sm"
																className="h-8 rounded-full bg-blue-50 px-3 text-blue-700 hover:bg-blue-100"
																onClick={() => handleOpenPreview(doc)}
															>
																<Eye className="ml-1.5 h-4 w-4" />
																مشاهده
															</Button>

															<Button
																variant="ghost"
																size="sm"
																className="h-8 rounded-full bg-indigo-50 px-3 text-indigo-700 hover:bg-indigo-100"
																onClick={() => void handleDownload(doc.FileName)}
															>
																<UploadCloud className="ml-1.5 h-4 w-4" />
																دانلود
															</Button>
														</div>

														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600"
															onClick={() => void handleDelete(doc.Id)}
															title="حذف سند"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											</CardTable>
										);
									}}
								/>
							</DataGrid>
						</div>
					) : (
						<div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
								<UploadCloud className="h-8 w-8 text-slate-400" />
							</div>

							<h3 className="text-base font-bold text-slate-700">هنوز مشتری انتخاب نشده است</h3>

							<p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
								برای مشاهده پرونده‌ها و ثبت سند جدید، ابتدا از بخش بالا یک مشتری را انتخاب کنید.
							</p>
						</div>
					)}
				</div>
			</PageCardContent>

			<FileViewerPopup
				isOpen={preview.isOpen}
				onClose={() => setPreview((prev) => ({ ...prev, isOpen: false }))}
				fileName={preview.fileName}
				title={preview.title}
				fileType={preview.fileType}
			/>

			<Popup show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="ثبت سند جدید">
				<CustomerDocumentAddForm
					customerId={selectedCustomer?.Id ?? 0}
					onSuccess={() => {
						setIsAddModalOpen(false);
						gridRef.current?.reload?.();
					}}
				/>
			</Popup>
		</PageCard>
	);
}
