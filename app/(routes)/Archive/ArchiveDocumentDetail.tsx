"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArchiveDocumentDetailDto } from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveDocumentDetailDto";
import {
	ArchiveDocumentUpdateContentCmd,
	ArchiveDocumentUpdateContentSchema,
} from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveDocumentUpdateContentCmd";
import { ArchiveRecordService } from "@/dataBinding/services/Archive/ArchiveRecordService";
import { DocumentEditor } from "@/utilities/components/ui/text-editor/DocumentEditor";
import HtmlViewer from "@/utilities/components/ui/HtmlViewer";

interface ArchiveDocumentDetailProps {
	recordId: number;
	onSuccess: () => void;
	onCancel: () => void;
}

export const ArchiveDocumentDetail: React.FC<ArchiveDocumentDetailProps> = ({ recordId, onSuccess, onCancel }) => {
	const [detail, setDetail] = useState<ArchiveDocumentDetailDto | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<ArchiveDocumentUpdateContentCmd>({
		resolver: zodResolver(ArchiveDocumentUpdateContentSchema),
		defaultValues: {
			RecordId: recordId,
			NewContent: "",
		},
	});

	useEffect(() => {
		const fetchDetail = async () => {
			try {
				setIsLoading(true);
				const data = await ArchiveRecordService.GetDocumentDetail(recordId);
				setDetail(data);
				reset({
					RecordId: recordId,
					NewContent: data.CurrentContent,
				});
			} catch (error) {
				console.error("Error fetching document details:", error);
			} finally {
				setIsLoading(false);
			}
		};

		void fetchDetail();
	}, [recordId, reset]);

	const onSubmit = async (data: ArchiveDocumentUpdateContentCmd) => {
		try {
			setIsSubmitting(true);
			await ArchiveRecordService.UpdateDocumentContent(data);
			onSuccess();
		} catch (error) {
			console.error("Error updating content:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return <div className="p-4 text-center">در حال بارگذاری اطلاعات سند...</div>;
	}

	if (!detail) {
		return <div className="p-4 text-center text-red-500">سند یافت نشد.</div>;
	}

	return (
		<div className="flex flex-col gap-6">
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4">
				<div>
					<label className="block text-sm font-medium mb-1">محتوای سند</label>
					<Controller
						name="NewContent"
						control={control}
						disabled={isSubmitting}
						render={({ field: { value, onChange } }) => (
							<DocumentEditor id={`document-editor-${1}`} value={value} onChange={onChange} />
						)}
					/>
					{errors.NewContent && (
						<span className="text-red-500 text-sm mt-1">{errors.NewContent.message}</span>
					)}
				</div>

				<div className="flex justify-end gap-2 mt-2">
					<button
						type="button"
						onClick={onCancel}
						disabled={isSubmitting}
						className="px-4 py-2 border rounded-md hover:bg-gray-50"
					>
						بستن
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
					>
						{isSubmitting ? "در حال ثبت..." : "ثبت نسخه جدید"}
					</button>
				</div>
			</form>

			{detail.Versions && detail.Versions.length > 0 && (
				<div className="border-t pt-4 mt-2">
					<h3 className="text-lg font-semibold mb-3">تاریخچه نسخه‌ها</h3>
					<div className="flex flex-col gap-3 max-h-75 overflow-y-auto pr-2">
						{detail.Versions.map((version) => (
							<div key={version.Id} className="p-3 border rounded-md bg-gray-50">
								<div className="flex justify-between items-center mb-2">
									<span className="font-medium text-sm text-gray-700">
										نسخه {version.VersionNumber}
									</span>
									<span className="text-xs text-gray-500">{version.CreatedAt}</span>
								</div>
								<p className="text-sm text-gray-600 whitespace-pre-wrap">
									<HtmlViewer html={version.Content} />
								</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
