"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
	ArchiveFolderAddCmd,
	ArchiveFolderAddSchema,
} from "@/dataBinding/models/Archive/ArchiveFolder/ArchiveFolderAddCmd";
import { ArchiveFolderService } from "@/dataBinding/services/Archive/ArchiveFolderService";
import { Button } from "@/utilities/components/ui/button";
import { Input } from "@/utilities/components/ui/input";

interface ArchiveFolderAddFormProps {
	parentId: number | null;
	onSuccess: () => void;
}

export default function ArchiveFolderAddForm({ parentId, onSuccess }: ArchiveFolderAddFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ArchiveFolderAddCmd>({
		resolver: zodResolver(ArchiveFolderAddSchema),
		defaultValues: {
			ParentFolderId: parentId,
		},
	});

	const onSubmit = async (data: ArchiveFolderAddCmd) => {
		try {
			setIsSubmitting(true);
			await ArchiveFolderService.Add(data);
			onSuccess();
		} catch (error) {
			console.error("Error adding folder:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4 p-2">
			<div className="flex flex-col gap-1.5">
				<Input
					label="نام پوشه"
					schema={ArchiveFolderAddSchema}
					error={errors.Name?.message}
					placeholder="مثال: قراردادهای سال ۱۴۰۵"
					{...register("Name")}
				/>
			</div>

			<div className="flex justify-end mt-4">
				<Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isSubmitting}>
					{isSubmitting ? "در حال ثبت..." : "ثبت پوشه"}
				</Button>
			</div>
		</form>
	);
}
