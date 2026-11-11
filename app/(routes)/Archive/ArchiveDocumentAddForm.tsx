"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
	ArchiveRecordAddDocumentCmd,
	ArchiveRecordAddDocumentSchema,
} from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveRecordAddDocumentCmd";
import { ArchiveRecordService } from "@/dataBinding/services/Archive/ArchiveRecordService";
import { Button } from "@/utilities/components/ui/button";
import { DocumentEditor } from "@/utilities/components/ui/text-editor/DocumentEditor";
import { Input } from "@/utilities/components/ui/input";

interface ArchiveDocumentAddFormProps {
	folderId: number | null;
	onSuccess: () => void;
}

export default function ArchiveDocumentAddForm({ folderId, onSuccess }: ArchiveDocumentAddFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<ArchiveRecordAddDocumentCmd>({
		resolver: zodResolver(ArchiveRecordAddDocumentSchema),
		defaultValues: {
			FolderId: folderId,
		},
	});

	const onSubmit = async (data: ArchiveRecordAddDocumentCmd) => {
		try {
			setIsSubmitting(true);
			await ArchiveRecordService.AddDocument(data);
			onSuccess();
		} catch (error) {
			console.error("Error adding document:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4 p-2 h-full">
			<div className="flex flex-col gap-1.5">
				<Input
					label="عنوان سند"
					schema={ArchiveRecordAddDocumentSchema}
					error={errors.Title?.message}
					placeholder="عنوان..."
					{...register("Title")}
				/>
			</div>

			<div className="flex flex-col gap-1.5 flex-1">
				<label className="text-sm font-medium text-slate-700">محتوا</label>
				<Controller
					name="Content"
					control={control}
					render={({ field: { value, onChange } }) => (
						<DocumentEditor id={`document-editor-${1}`} value={value} onChange={onChange} />
					)}
				/>
				{errors.Content && <span className="text-xs text-red-500">{errors.Content.message}</span>}
			</div>

			<div className="flex justify-end mt-4">
				<Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isSubmitting}>
					{isSubmitting ? "در حال ثبت..." : "ذخیره سند"}
				</Button>
			</div>
		</form>
	);
}
