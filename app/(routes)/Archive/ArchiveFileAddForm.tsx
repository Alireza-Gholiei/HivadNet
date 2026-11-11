"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
	ArchiveRecordAddFileCmd,
	ArchiveRecordAddFileSchema,
} from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveRecordAddFileCmd";
import { ArchiveRecordService } from "@/dataBinding/services/Archive/ArchiveRecordService";
import { Button } from "@/utilities/components/ui/button";
import Uploader from "@/components/Shared/Uploader";
import { Input } from "@/utilities/components/ui/input";

interface ArchiveFileAddFormProps {
	folderId: number | null;
	onSuccess: () => void;
}

export default function ArchiveFileAddForm({ folderId, onSuccess }: ArchiveFileAddFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<ArchiveRecordAddFileCmd>({
		resolver: zodResolver(ArchiveRecordAddFileSchema),
		defaultValues: {
			FolderId: folderId,
		},
	});

	const onSubmit = async (data: ArchiveRecordAddFileCmd) => {
		try {
			setIsSubmitting(true);

			await ArchiveRecordService.AddFile(data);
			onSuccess();
		} catch (error) {
			console.error("Error uploading file:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4 p-2">
			<div className="flex flex-col gap-1.5">
				<Input
					label="عنوان فایل"
					schema={ArchiveRecordAddFileSchema}
					error={errors.Title?.message}
					placeholder="مثال: اسکن قرارداد"
					{...register("Title")}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Controller
					name="File"
					control={control}
					render={({ field }) => (
						<Uploader
							label="فایل پیوست"
							required
							value={field.value ?? null}
							onChange={field.onChange}
							error={errors.File?.message}
							maxSizeMB={10}
							disabled={isSubmitting}
						/>
					)}
				/>
			</div>

			<div className="flex justify-end mt-4">
				<Button
					type="submit"
					className="bg-emerald-600 hover:bg-emerald-700 text-white"
					disabled={isSubmitting}
				>
					{isSubmitting ? "در حال آپلود..." : "آپلود فایل"}
				</Button>
			</div>
		</form>
	);
}
