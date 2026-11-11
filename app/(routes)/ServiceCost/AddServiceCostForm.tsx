"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ServiceCostAddDto, serviceCostSchema } from "@/dataBinding/models/ServiceCost/ServiceCostAddDto";
import { ServiceCostService } from "@/dataBinding/services/ServiceCost/ServiceCostService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Input } from "@/utilities/components/ui/input";
import { DollarSign, FileText, Tag } from "lucide-react";
import { Textarea } from "@/utilities/components/ui/textarea";
import { Checkbox } from "@/utilities/components/ui/checkbox";

interface AddServiceCostFormProps {
	guildId: number;
	onClose: () => void;
	onSuccess?: () => void;
}

export default function AddServiceCostForm({ guildId, onClose, onSuccess }: AddServiceCostFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<ServiceCostAddDto>({
		resolver: zodResolver(serviceCostSchema),
		defaultValues: {
			AllowCustomPrice: false,
		},
	});

	console.log(errors);

	const [amountDisplay, setAmountDisplay] = useState("");

	const formatNumberWithCommas = (value: string) => {
		if (!value) return "";
		return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	const handleAmountChange = (value: string) => {
		const englishValue = value.replace(/,/g, "").replace(/[^\d]/g, "");
		const numericValue = englishValue ? Number(englishValue) : 0;

		setAmountDisplay(formatNumberWithCommas(englishValue));
		setValue("Price", numericValue, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	const onSubmit = async (data: ServiceCostAddDto) => {
		try {
			const payload = {
				...data,
				GuildId: guildId,
			};

			const result = await ServiceCostService.ServiceCost(payload);

			if (result) {
				reset();
				if (onSuccess) onSuccess();
				onClose();
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<PageCard>
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4">
				<PageCardContent>
					<Input
						label="عنوان"
						placeholder="مثال: تنظیم اظهارنامه"
						schema={serviceCostSchema}
						icon={<Tag className="h-5 w-5 text-slate-400" />}
						error={errors.Title?.message}
						{...register("Title")}
					/>

					<Input
						label="مبلغ"
						type="text"
						inputMode="numeric"
						placeholder="مثلاً 1,500,000"
						icon={<DollarSign className="h-5 w-5 text-slate-400" />}
						schema={serviceCostSchema}
						error={errors.Price?.message}
						disabled={isSubmitting}
						name="Price"
						dir="ltr"
						value={amountDisplay}
						onChange={(e) => handleAmountChange(e.target.value)}
					/>

					<Textarea
						label="توضیحات"
						schema={serviceCostSchema}
						error={errors.Description?.message}
						icon={<FileText className="h-5 w-5 text-slate-400" />}
						placeholder="توضیحات مربوط به این هزینه..."
						rows={3}
						textareaClassName="resize-none bg-slate-50 focus:bg-white"
						{...register("Description")}
					/>

					<Checkbox
						id="AllowCustomPrice"
						label="امکان ثبت مبلغ دلخواه"
						schema={serviceCostSchema}
						error={errors.AllowCustomPrice?.message}
						containerClassName="mt-2"
						checkboxClassName="border-gray-300 peer-checked:border-blue-600 peer-checked:bg-blue-600"
						{...register("AllowCustomPrice")}
					/>
				</PageCardContent>
				<PageCardFooter className="flex gap-3 mt-6">
					<Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
						انصراف
					</Button>
					<Button type="submit" disabled={isSubmitting} variant="submit">
						{isSubmitting ? "در حال ثبت..." : "ثبت سرویس"}
					</Button>
				</PageCardFooter>
			</form>
		</PageCard>
	);
}
