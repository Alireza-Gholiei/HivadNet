import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import Uploader from "@/components/Shared/Uploader";
import {
	CustomerDocumentAddDto,
	CustomerDocumentAddSchema,
} from "@/dataBinding/models/Customer/Document/CustomerDocumentAddDto";
import { CustomerDocumentService } from "@/dataBinding/services/Customer/CustomerDocumentService";
import { Button } from "@/utilities/components/ui/button";
import { Messenger } from "@/utilities/Messenger";
import { Input } from "@/utilities/components/ui/input";
import { Textarea } from "@/utilities/components/ui/textarea";

export default function CustomerDocumentAddForm({
	customerId,
	onSuccess,
}: {
	customerId: number;
	onSuccess: () => void;
}) {
	if (!customerId || customerId === 0) {
		Messenger.errorMessage("ابتدا مشتری را انتخاب کنید");
		onSuccess();
	}

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		control,
	} = useForm<CustomerDocumentAddDto>({
		resolver: zodResolver(CustomerDocumentAddSchema),
		defaultValues: {
			CustomerId: customerId,
			Title: "",
			Description: "",
		},
	});

	const onSubmit = async (data: CustomerDocumentAddDto) => {
		try {
			const result = await CustomerDocumentService.Add(data);
			if (result) {
				Messenger.successAlert("مدرک با موفقیت آپلود شد.");
				onSuccess();
			}
		} catch {
			Messenger.errorMessage("خطا در آپلود فایل");
		}
	};

	return (
		<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4 p-2">
			<Input
				label="عنوان مدرک"
				schema={CustomerDocumentAddSchema}
				error={errors.Title?.message}
				type="text"
				placeholder="مثال: اسکن کارت ملی"
				{...register("Title")}
			/>

			<Textarea
				label="توضیحات"
				schema={CustomerDocumentAddSchema}
				error={errors.Description?.message}
				placeholder="توضیحات تکمیلی (اختیاری)"
				rows={3}
				textareaClassName="resize-none"
				{...register("Description")}
			/>

			<Controller
				name="File"
				control={control}
				render={({ field }) => (
					<Uploader
						label="فایل مدرک"
						required
						value={field.value ?? null}
						onChange={field.onChange}
						error={errors.File?.message}
						maxSizeMB={10}
						accept="*"
						disabled={isSubmitting}
					/>
				)}
			/>

			<Button type="submit" disabled={isSubmitting} variant="submit">
				{isSubmitting ? (
					<>
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						در حال آپلود...
					</>
				) : (
					"ذخیره مدرک"
				)}
			</Button>
		</form>
	);
}
