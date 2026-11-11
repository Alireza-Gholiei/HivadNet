"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Plus, Save, Trash2, WalletCards } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import HraderTitle from "@/components/Shared/HraderTitle";
import {
	JournalEntryAddManualDto,
	JournalEntryAddManualSchema,
} from "@/dataBinding/models/Accounting/JournalEntryAddManualDto";
import { AccountingService } from "@/dataBinding/services/Accounting/AccountingService";
import { Button } from "@/utilities/components/ui/button";
import { Input } from "@/utilities/components/ui/input";
import { Select } from "@/utilities/components/ui/select";
import { Textarea } from "@/utilities/components/ui/textarea";
import PersianDatePicker from "@/utilities/components/datepicker/persian-date-picker";
import AccountSelector from "@/components/accounting/AccountSelector";
import CustomerSelector from "@/components/customer/CustomerSelector";
import { PaymentMethodDto } from "@/dataBinding/models/Accounting/PaymentMethodDto";

export default function AddManualDocument() {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDto[]>([]);

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<JournalEntryAddManualDto>({
		resolver: zodResolver(JournalEntryAddManualSchema),
		defaultValues: {
			EntryDate: new Date(),
			Description: "",
			Lines: [
				{
					AccountId: 0,
					Debit: 0,
					Credit: 0,
					Description: "",
					ReferenceType: 0,
					CostCenterId: null,
					ProjectId: null,
					PaymentMethod: null,
				},
				{
					AccountId: 0,
					Debit: 0,
					Credit: 0,
					Description: "",
					ReferenceType: 0,
					CostCenterId: null,
					ProjectId: null,
					PaymentMethod: null,
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "Lines",
	});

	useEffect(() => {
		void loadPaymentMethods();
	}, []);

	const loadPaymentMethods = async () => {
		const result = await AccountingService.getPaymentMethods();

		if (result) {
			setPaymentMethods(result);
		}
	};

	const lines = watch("Lines");

	const totalDebit = useMemo(() => lines.reduce((sum, item) => sum + (Number(item.Debit) || 0), 0), [lines]);

	const totalCredit = useMemo(() => lines.reduce((sum, item) => sum + (Number(item.Credit) || 0), 0), [lines]);

	const onSubmit = async (data: JournalEntryAddManualDto) => {
		try {
			const result = await AccountingService.Add(data);

			if (result) {
				reset();
			}
		} catch (error) {
			console.error(error);
		}
	};

	const errorClass = "mt-1.5 text-xs font-medium text-rose-600";

	return (
		<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="p-6">
				<div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
					<HraderTitle title="ثبت سند حسابداری" description="ثبت دستی سند حسابداری" icon={<WalletCards />} />
				</div>

				<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
					<div className="md:col-span-2">
						<CustomerSelector
							valueId={watch("CustomerId")}
							onChange={(customer) => {
								setValue("CustomerId", customer?.Id || 0, {
									shouldValidate: true,
									shouldDirty: true,
								});
							}}
							required
						/>

						{errors.CustomerId && <p className={errorClass}>{errors.CustomerId.message}</p>}
					</div>
				</div>

				<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
					<div>
						<label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-600">
							<Calendar size={16} className="text-indigo-500" />
							تاریخ سند
						</label>

						<PersianDatePicker<JournalEntryAddManualDto> control={control} name="EntryDate" required />

						{errors.EntryDate && (
							<p className="mt-1 text-xs text-rose-600">
								{errors.EntryDate.message?.toString() || "انتخاب تاریخ الزامی است"}
							</p>
						)}
					</div>

					<div className="md:col-span-2">
						<Textarea
							label="شرح سند"
							error={errors.Description?.message}
							schema={JournalEntryAddManualSchema}
							textareaClassName="min-h-24"
							{...register("Description")}
						/>
					</div>
				</div>

				<div className="mt-8">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-lg font-semibold">آرتیکل‌های سند</h3>

						<Button
							type="button"
							variant="outline"
							onClick={() =>
								append({
									AccountId: 0,
									Debit: 0,
									Credit: 0,
									Description: "",
									ReferenceType: 0,
									CostCenterId: null,
									ProjectId: null,
									PaymentMethod: null,
								})
							}
						>
							<Plus className="h-4 w-4" />
							افزودن آرتیکل
						</Button>
					</div>

					<div className="space-y-4">
						{fields.map((field, index) => (
							<div key={field.id} className="rounded-xl border border-slate-200 p-4">
								<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
									<div className="space-y-2 lg:col-span-4">
										<label
											htmlFor={`Lines.${index}.AccountId`}
											className={"flex items-center gap-1 text-sm font-bold text-slate-700"}
										>
											<span>حساب</span>

											<span className="text-rose-500">*</span>
										</label>

										<AccountSelector
											valueId={watch(`Lines.${index}.AccountId`)}
											onChange={(account) => {
												setValue(`Lines.${index}.AccountId`, account?.Id ?? 0, {
													shouldDirty: true,
													shouldValidate: true,
												});
											}}
											required
										/>

										{errors.Lines?.[index]?.AccountId && (
											<p className={errorClass}>{errors.Lines[index]?.AccountId?.message}</p>
										)}
									</div>

									<div className="lg:col-span-2">
										<Controller
											control={control}
											name={`Lines.${index}.Debit`}
											render={({ field: { onChange, value, ...restField } }) => (
												<Input
													{...restField}
													value={value}
													onChange={(e) => {
														const numericValue = e.target.value
															? Number(e.target.value)
															: 0;
														onChange(numericValue);
													}}
													isCurrency
													label="بدهکار"
													type="text"
													schema={JournalEntryAddManualSchema}
													inputMode="numeric"
													placeholder="مثلاً 1,500,000"
													error={errors.Lines?.[index]?.Debit?.message}
												/>
											)}
										/>
									</div>

									<div className="lg:col-span-2">
										<Controller
											control={control}
											name={`Lines.${index}.Credit`}
											render={({ field: { onChange, value, ...restField } }) => (
												<Input
													{...restField}
													value={value}
													onChange={(e) => {
														const numericValue = e.target.value
															? Number(e.target.value)
															: 0;
														onChange(numericValue);
													}}
													isCurrency
													label="بستانکار"
													type="text"
													schema={JournalEntryAddManualSchema}
													inputMode="numeric"
													placeholder="مثلاً 1,500,000"
													error={errors.Lines?.[index]?.Credit?.message}
												/>
											)}
										/>
									</div>

									<div className="lg:col-span-3">
										<Input
											label="شرح آرتیکل"
											schema={JournalEntryAddManualSchema}
											error={errors.Lines?.[index]?.Description?.message}
											{...register(`Lines.${index}.Description`)}
										/>
									</div>

									<div className="flex items-end lg:col-span-1">
										<Button
											type="button"
											variant="destructive"
											className="w-full"
											onClick={() => remove(index)}
											disabled={fields.length <= 2}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>

									<div className="lg:col-span-3">
										<Controller
											control={control}
											name={`Lines.${index}.ReferenceType`}
											render={({ field }) => (
												<Select
													label="نوع مرجع"
													schema={JournalEntryAddManualSchema}
													value={field.value}
													onValueChange={(value) => field.onChange(Number(value))}
													options={[]}
												/>
											)}
										/>
									</div>

									<div className="lg:col-span-3">
										<Controller
											control={control}
											name={`Lines.${index}.PaymentMethod`}
											render={({ field }) => (
												<Select
													label="روش پرداخت"
													schema={JournalEntryAddManualSchema}
													value={field.value ?? null}
													onValueChange={(v) => field.onChange(v ? Number(v) : null)}
													options={paymentMethods.map((m) => ({
														label: m.Name,
														value: m.Id,
													}))}
													clearable
													error={errors.Lines?.[index]?.PaymentMethod?.message}
												/>
											)}
										/>
									</div>

									<div className="lg:col-span-3">
										<Input
											label="مرکز هزینه"
											type="number"
											schema={JournalEntryAddManualSchema}
											{...register(`Lines.${index}.CostCenterId`, {
												setValueAs: (v) => (v === "" ? null : Number(v)),
											})}
										/>
									</div>

									<div className="lg:col-span-3">
										<Input
											label="پروژه"
											type="number"
											schema={JournalEntryAddManualSchema}
											{...register(`Lines.${index}.ProjectId`, {
												setValueAs: (v) => (v === "" ? null : Number(v)),
											})}
										/>
									</div>
								</div>
							</div>
						))}
					</div>

					{errors.Lines?.message && (
						<p className="mt-4 text-sm font-medium text-red-600">{errors.Lines.message}</p>
					)}

					<div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
						<div>
							<span className="text-slate-500">جمع بدهکار:</span>
							<span className="mr-2 font-bold">{totalDebit.toLocaleString()}</span>
						</div>

						<div>
							<span className="text-slate-500">جمع بستانکار:</span>
							<span className="mr-2 font-bold">{totalCredit.toLocaleString()}</span>
						</div>
					</div>
				</div>

				<div className="mt-8 flex justify-end">
					<Button type="submit" disabled={isSubmitting} variant="submit">
						<Save className="h-4 w-4" />
						{isSubmitting ? "در حال ذخیره..." : "ذخیره سند"}
					</Button>
				</div>
			</form>
		</div>
	);
}
