"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArchiveRecordRenameCmd,
	ArchiveRecordRenameSchema,
} from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveRecordRenameCmd";
import { ArchiveRecordService } from "@/dataBinding/services/Archive/ArchiveRecordService";
import { Input } from "@/utilities/components/ui/input";

interface ArchiveRecordRenameFormProps {
	recordId: number;
	currentTitle: string;
	onSuccess: () => void;
	onCancel: () => void;
}

export const ArchiveRecordRenameForm: React.FC<ArchiveRecordRenameFormProps> = ({
	recordId,
	currentTitle,
	onSuccess,
	onCancel,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ArchiveRecordRenameCmd>({
		resolver: zodResolver(ArchiveRecordRenameSchema),
		defaultValues: {
			RecordId: recordId,
			NewTitle: currentTitle,
		},
	});

	const onSubmit = async (data: ArchiveRecordRenameCmd) => {
		try {
			setIsSubmitting(true);
			await ArchiveRecordService.Rename(data);
			onSuccess();
		} catch (error) {
			console.error("Error renaming record:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4">
			<div>
				<Input
					label="عنوان جدید رکورد"
					schema={ArchiveRecordRenameSchema}
					error={errors.NewTitle?.message}
					placeholder="عنوان جدید را وارد کنید"
					disabled={isSubmitting}
					{...register("NewTitle")}
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
