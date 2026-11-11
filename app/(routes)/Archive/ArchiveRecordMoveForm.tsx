"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderTreeSelector } from "./FolderTreeSelector";
import {
	ArchiveRecordMoveCmd,
	ArchiveRecordMoveSchema,
} from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveRecordMoveCmd";
import { ArchiveRecordService } from "@/dataBinding/services/Archive/ArchiveRecordService";

interface ArchiveRecordMoveFormProps {
	recordId: number;
	recordTitle: string;
	onSuccess: () => void;
	onCancel: () => void;
}

export const ArchiveRecordMoveForm: React.FC<ArchiveRecordMoveFormProps> = ({
	recordId,
	recordTitle,
	onSuccess,
	onCancel,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ArchiveRecordMoveCmd>({
		resolver: zodResolver(ArchiveRecordMoveSchema),
		defaultValues: {
			RecordId: recordId,
			NewFolderId: null,
		},
	});

	const onSubmit = async (data: ArchiveRecordMoveCmd) => {
		try {
			setIsSubmitting(true);
			await ArchiveRecordService.Move(data);
			onSuccess();
		} catch (error) {
			console.error("Error moving record:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4">
			<div className="text-sm text-gray-700 mb-2">
				لطفاً پوشه مقصد برای انتقال رکورد <strong>«{recordTitle}»</strong> را انتخاب کنید:
			</div>

			<div>
				<Controller
					name="NewFolderId"
					control={control}
					render={({ field }) => (
						<FolderTreeSelector selectedFolderId={field.value} onSelect={field.onChange} />
					)}
				/>
				{errors.NewFolderId && <span className="text-red-500 text-sm mt-1">{errors.NewFolderId.message}</span>}
			</div>

			<div className="flex justify-end gap-2 mt-4">
				<button
					type="button"
					onClick={onCancel}
					disabled={isSubmitting}
					className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
				>
					انصراف
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
				>
					{isSubmitting ? "در حال انتقال..." : "انتقال رکورد"}
				</button>
			</div>
		</form>
	);
};
