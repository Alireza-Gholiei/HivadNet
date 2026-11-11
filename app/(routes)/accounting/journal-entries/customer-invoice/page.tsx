"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Save, WalletCards } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import HraderTitle from "@/components/Shared/HraderTitle";
import CustomerSelector from "@/components/customer/CustomerSelector";

import { AccountingService } from "@/dataBinding/services/Accounting/AccountingService";

import { Button } from "@/utilities/components/ui/button";
import { Input } from "@/utilities/components/ui/input";
import { Select } from "@/utilities/components/ui/select";
import { Textarea } from "@/utilities/components/ui/textarea";
import PersianDatePicker from "@/utilities/components/datepicker/persian-date-picker";
import {
	CustomerEntryDto,
	CustomerEntrySchema,
	CustomerEntryType,
} from "@/dataBinding/models/Accounting/CustomerEntryDto";
import { PaymentMethodDto } from "@/dataBinding/models/Accounting/PaymentMethodDto";
import { useEffect, useState } from "react";

export default function CustomerEntryForm() {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDto[]>([]);

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<CustomerEntryDto>({
		resolver: zodResolver(CustomerEntrySchema),
		defaultValues: {
			CustomerId: 0,
			EntryDate: new Date(),
			Description: "",
			Type: CustomerEntryType.Debit,
			Amount: 0,
			PaymentMethod: null,
		},
	});

	const type = watch("Type");

	useEffect(() => {
		void loadPaymentMethods();
	}, []);

	const loadPaymentMethods = async () => {
		const result = await AccountingService.getPaymentMethods();

		if (result) {
			setPaymentMethods(result);
		}
	};

	const onSubmit = async (data: CustomerEntryDto) => {
		const payload: CustomerEntryDto = {
			...data,
			PaymentMethod: data.Type === CustomerEntryType.Credit ? data.PaymentMethod : null,
		};

		const result = await AccountingService.AddCustomerInvoice(payload);

		if (result) {
			reset();
		}
	};

	const errorClass = "mt-1 text-xs text-rose-600";

	return (
		<div className="rounded-2xl border bg-white shadow-sm">
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="p-6">
				<HraderTitle title="ثبت سند مشتری" description="ثبت بدهکار / بستانکار مشتری" icon={<WalletCards />} />

				<div className="mb-4">
					<CustomerSelector
						valueId={watch("CustomerId")}
						onChange={(c) =>
							setValue("CustomerId", c?.Id || 0, {
								shouldValidate: true,
							})
						}
						required
					/>

					{errors.CustomerId && <p className={errorClass}>{errors.CustomerId.message}</p>}
				</div>

				<div className="mb-4">
					<label className="mb-1 flex items-center gap-2 text-sm">
						<Calendar size={16} />
						تاریخ سند
						<span className="text-rose-500">*</span>
					</label>

					<PersianDatePicker control={control} name="EntryDate" required />

					{errors.EntryDate && <p className={errorClass}>{errors.EntryDate.message}</p>}
				</div>

				<div className="mb-4">
					<Select
						label="نوع تراکنش"
						value={type}
						clearable
						name="Type"
						schema={CustomerEntrySchema}
						onValueChange={(v) => setValue("Type", Number(v))}
						options={[
							{
								label: "بدهکار (مشتری بدهکار می‌شود)",
								value: CustomerEntryType.Debit,
							},
							{
								label: "بستانکار (پرداخت مشتری)",
								value: CustomerEntryType.Credit,
							},
						]}
						error={errors.Type?.message}
					/>
				</div>

				<div className="mb-4">
					<Controller
						control={control}
						name="Amount"
						render={({ field: { onChange, value, ...restField } }) => (
							<Input
								{...restField}
								value={value}
								onChange={(e) => {
									const numericValue = e.target.value ? Number(e.target.value) : 0;
									onChange(numericValue);
								}}
								isCurrency
								label="مبلغ"
								type="text"
								schema={CustomerEntrySchema}
								inputMode="numeric"
								placeholder="مثلاً 1,500,000"
								error={errors.Amount?.message}
							/>
						)}
					/>
				</div>

				{type === CustomerEntryType.Credit && (
					<div className="mb-4">
						<Controller
							control={control}
							name="PaymentMethod"
							render={({ field }) => (
								<Select
									label="روش پرداخت"
									value={field.value ?? null}
									onValueChange={(v) => field.onChange(v ? Number(v) : null)}
									options={paymentMethods.map((m) => ({
										label: m.Name,
										value: m.Id,
									}))}
									schema={CustomerEntrySchema}
									clearable
									error={errors.PaymentMethod?.message}
								/>
							)}
						/>
					</div>
				)}

				<div className="mb-6">
					<Textarea label="شرح سند" {...register("Description")} error={errors.Description?.message} />
				</div>

				<div className="flex justify-end">
					<Button type="submit" disabled={isSubmitting} variant="submit">
						<Save className="h-4 w-4" />
						{isSubmitting ? "در حال ذخیره..." : "ذخیره"}
					</Button>
				</div>
			</form>
		</div>
	);
}
