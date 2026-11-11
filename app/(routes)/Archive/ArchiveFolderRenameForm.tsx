"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArchiveFolderRenameCmd,
	ArchiveFolderRenameSchema,
} from "@/dataBinding/models/Archive/ArchiveFolder/ArchiveFolderRenameCmd";
import { ArchiveFolderService } from "@/dataBinding/services/Archive/ArchiveFolderService";
import { Input } from "@/utilities/components/ui/input";

interface ArchiveFolderRenameFormProps {
	folderId: number;
	currentName: string;
	onSuccess: () => void;
	onCancel: () => void;
}

export const ArchiveFolderRenameForm: React.FC<ArchiveFolderRenameFormProps> = ({
	folderId,
	currentName,
	onSuccess,
	onCancel,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ArchiveFolderRenameCmd>({
		resolver: zodResolver(ArchiveFolderRenameSchema),
		defaultValues: {
			FolderId: folderId,
			NewName: currentName,
		},
	});

	const onSubmit = async (data: ArchiveFolderRenameCmd) => {
		try {
			setIsSubmitting(true);
			await ArchiveFolderService.Rename(data);
			onSuccess();
		} catch (error) {
			console.error("Error renaming folder:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4">
			<div>
				<Input
					label="نام جدید پوشه"
					schema={ArchiveFolderRenameSchema}
					error={errors.NewName?.message}
					placeholder="نام پوشه را وارد کنید"
					disabled={isSubmitting}
					{...register("NewName")}
				/>
			</div>

			<div className="flex justify-end gap-2 mt-4">
				<button
					type="button"
					onClick={onCancel}
					disabled={isSubmitting}
					className="px-4 py-2 border rounded-md hover:bg-gray-50"
				>
					انصراف
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
				>
					{isSubmitting ? "در حال ثبت..." : "ذخیره تغییرات"}
				</button>
			</div>
		</form>
	);
};
