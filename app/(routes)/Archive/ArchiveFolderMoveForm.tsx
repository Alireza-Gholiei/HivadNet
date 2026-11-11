"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderTreeSelector } from "./FolderTreeSelector";
import {
	ArchiveFolderMoveCmd,
	ArchiveFolderMoveSchema,
} from "@/dataBinding/models/Archive/ArchiveFolder/ArchiveFolderMoveCmd";
import { ArchiveFolderService } from "@/dataBinding/services/Archive/ArchiveFolderService";

interface ArchiveFolderMoveFormProps {
	folderId: number;
	folderTitle: string;
	onSuccess: () => void;
	onCancel: () => void;
}

export const ArchiveFolderMoveForm: React.FC<ArchiveFolderMoveFormProps> = ({
	folderId,
	folderTitle,
	onSuccess,
	onCancel,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ArchiveFolderMoveCmd>({
		resolver: zodResolver(ArchiveFolderMoveSchema),
		defaultValues: {
			FolderId: folderId,
			NewParentFolderId: 0,
		},
	});

	const onSubmit = async (data: ArchiveFolderMoveCmd) => {
		try {
			setIsSubmitting(true);
			await ArchiveFolderService.Move(data);
			onSuccess();
		} catch (error) {
			console.error("Error moving folder:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4">
			<div className="text-sm text-gray-700 mb-2">
				لطفاً مسیر جدید برای پوشه <strong>«{folderTitle}»</strong> را انتخاب کنید:
			</div>

			<div>
				<Controller
					name="NewParentFolderId"
					control={control}
					render={({ field }) => (
						<FolderTreeSelector
							selectedFolderId={field.value}
							onSelect={field.onChange}
							disabledFolderId={folderId}
						/>
					)}
				/>
				{errors.NewParentFolderId && (
					<span className="text-red-500 text-sm mt-1">{errors.NewParentFolderId.message}</span>
				)}
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
					{isSubmitting ? "در حال انتقال..." : "انتقال پوشه"}
				</button>
			</div>
		</form>
	);
};
