"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArchiveRecordArchiveCmd,
	ArchiveRecordArchiveSchema,
} from "@/dataBinding/models/Archive/ArchiveRecord/ArchiveRecordArchiveCmd";
import { ArchiveRecordService } from "@/dataBinding/services/Archive/ArchiveRecordService";

interface ArchiveRecordArchiveConfirmProps {
	recordId: number;
	recordTitle: string;
	onSuccess: () => void;
	onCancel: () => void;
}

export const ArchiveRecordArchiveConfirm: React.FC<ArchiveRecordArchiveConfirmProps> = ({
	recordId,
	recordTitle,
	onSuccess,
	onCancel,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { handleSubmit } = useForm<ArchiveRecordArchiveCmd>({
		resolver: zodResolver(ArchiveRecordArchiveSchema),
		defaultValues: {
			RecordId: recordId,
		},
	});

	const onSubmit = async (data: ArchiveRecordArchiveCmd) => {
		try {
			setIsSubmitting(true);
			await ArchiveRecordService.Archive(data);
			onSuccess();
		} catch (error) {
			console.error("Error archiving record:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4">
			<div className="p-4 bg-orange-50 border border-orange-200 rounded-md">
				<p className="text-orange-800 text-sm">
					آیا از انتقال رکورد <strong>«{recordTitle}»</strong> به بایگانی راکد اطمینان دارید؟ پس از بایگانی،
					وضعیت این رکورد تغییر خواهد کرد.
				</p>
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
					className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
				>
					{isSubmitting ? "در حال بایگانی..." : "تأیید و بایگانی"}
				</button>
			</div>
		</form>
	);
};
