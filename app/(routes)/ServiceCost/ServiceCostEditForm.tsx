"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, FileText, Loader2, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ServiceCostEditDto, ServiceCostEditSchema } from "@/dataBinding/models/ServiceCost/ServiceCostEditDto";
import { ServiceCostService } from "@/dataBinding/services/ServiceCost/ServiceCostService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";
import { Input } from "@/utilities/components/ui/input";
import { Textarea } from "@/utilities/components/ui/textarea";
import { Checkbox } from "@/utilities/components/ui/checkbox";

interface ServiceCostEditFormProps {
	serviceCostId: number;
	onClose?: () => void;
	onSuccess?: () => void;
}

export default function ServiceCostEditForm({ serviceCostId, onClose, onSuccess }: ServiceCostEditFormProps) {
	const [isLoading, setIsLoading] = useState(true);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<ServiceCostEditDto>({
		resolver: zodResolver(ServiceCostEditSchema),
		defaultValues: {
			Id: serviceCostId,
			AllowCustomPrice: false,
			IsActive: true,
		},
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await ServiceCostService.GetById(serviceCostId);

				reset({
					Id: serviceCostId,
					Title: data.Title,
					Description: data.Description || "",
					Price: data.Price,
					AllowCustomPrice: data.AllowCustomPrice,
					IsActive: true,
				});

				handleAmountChange(data.Price.toString());
			} catch (error) {
				console.error(error);
				Messenger.errorMessage("خطا در دریافت اطلاعات هزینه خدمات.");
			} finally {
				setIsLoading(false);
			}
		};

		if (serviceCostId) {
			void fetchData();
		}
	}, [serviceCostId, reset]);

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

	const onSubmit = async (data: ServiceCostEditDto) => {
		try {
			const result = await ServiceCostService.Edit(data);

			if (result) {
				Messenger.successAlert("ویرایش هزینه خدمات با موفقیت انجام شد.");
				if (onSuccess) onSuccess();
				if (onClose) onClose();
			} else {
				Messenger.errorMessage("خطا در ثبت تغییرات هزینه خدمات.");
			}
		} catch (error) {
			console.error(error);
			Messenger.errorMessage("ارتباط با سرور برقرار نشد.");
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-10 space-y-3">
				<Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
				<span className="text-sm font-medium text-slate-500">در حال دریافت اطلاعات...</span>
			</div>
		);
	}

	return (
		<PageCard>
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-5">
				<PageCardContent>
					<div className="space-y-5 bg-white p-1">
						<Input
							label="عنوان"
							placeholder="مثال: تنظیم اظهارنامه"
							schema={ServiceCostEditSchema}
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
							schema={ServiceCostEditSchema}
							error={errors.Price?.message}
							disabled={isSubmitting}
							name="Price"
							dir="ltr"
							value={amountDisplay}
							onChange={(e) => handleAmountChange(e.target.value)}
						/>

						<Textarea
							label="توضیحات"
							schema={ServiceCostEditSchema}
							error={errors.Description?.message}
							icon={<FileText className="h-5 w-5 text-slate-400" />}
							placeholder="توضیحات مربوط به این هزینه..."
							rows={3}
							textareaClassName="resize-none bg-slate-50 focus:bg-white"
							{...register("Description")}
						/>

						<div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-slate-100">
							<Checkbox
								label="امکان ثبت مبلغ دلخواه"
								schema={ServiceCostEditSchema}
								error={errors.AllowCustomPrice?.message}
								containerClassName="flex-1 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
								checkboxClassName="h-5 w-5 border-slate-300 peer-checked:border-indigo-600 peer-checked:bg-indigo-600"
								{...register("AllowCustomPrice")}
							/>

							<Checkbox
								label="وضعیت فعال"
								schema={ServiceCostEditSchema}
								error={errors.IsActive?.message}
								containerClassName="flex-1 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
								checkboxClassName="h-5 w-5 border-slate-300 peer-checked:border-indigo-600 peer-checked:bg-indigo-600"
								{...register("IsActive")}
							/>
						</div>
					</div>
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
