"use client";

import { AlertCircle, Check, CheckCircle2, ChevronDown, ChevronUp, Copy, Plus, Trash2 } from "lucide-react";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { Control, Controller, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import {
	CustomerGetGuildsDto,
	CustomerGetGuildsFieldDto,
} from "@/dataBinding/models/Customer/CustomerGetGuildGroupDetailDto";
import { CustomerGetRepresentativeDto } from "@/dataBinding/models/Customer/CustomerGetRepresentativeDto";
import { GuildGroupGetCustomerGuildGroupListDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetCustomerGuildGroupListDto";
import { ServiceCostGetByGuildIdDto } from "@/dataBinding/models/ServiceCost/ServiceCostGetByGuildIdDto";
import CopyToClipboard from "@/utilities/components/copy/CopyToClipboard";
import { Button } from "@/utilities/components/ui/button";
import { ServiceEditDto, ServiceEditItemDto, ServiceEditItemSchema } from "@/dataBinding/models/Service/ServiceEditDto";
import { ServicePerformedPeriodValue } from "@/dataBinding/models/Service/ServiceAddDto";
import { Select } from "@/utilities/components/ui/select";
import { Input } from "@/utilities/components/ui/input";
import { Textarea } from "@/utilities/components/ui/textarea";

export interface SelectOptionDto {
	Id: number;
	Title: string;
}

const persianMonths = [
	{ id: 1, title: "فروردین" },
	{ id: 2, title: "اردیبهشت" },
	{ id: 3, title: "خرداد" },
	{ id: 4, title: "تیر" },
	{ id: 5, title: "مرداد" },
	{ id: 6, title: "شهریور" },
	{ id: 7, title: "مهر" },
	{ id: 8, title: "آبان" },
	{ id: 9, title: "آذر" },
	{ id: 10, title: "دی" },
	{ id: 11, title: "بهمن" },
	{ id: 12, title: "اسفند" },
];

const formatNumberWithCommas = (value: string | number) => {
	const rawValue = String(value ?? "")
		.replace(/,/g, "")
		.replace(/[^\d]/g, "");

	if (!rawValue) return "";

	return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseCurrencyValue = (value: string) => {
	const rawValue = value.replace(/,/g, "").replace(/[^\d]/g, "");
	return rawValue ? Number(rawValue) : 0;
};

interface ServiceItemEditCardProps {
	fieldId: string;
	index: number;
	fieldsLength: number;
	customerId: number;
	row?: ServiceEditItemDto;
	control: Control<ServiceEditDto>;
	register: UseFormRegister<ServiceEditDto>;
	setValue: UseFormSetValue<ServiceEditDto>;
	errors: FieldErrors<ServiceEditDto>;
	isCollapsed: boolean;
	itemHasError: boolean;
	guilds: SelectOptionDto[];
	rowGuildGroups: GuildGroupGetCustomerGuildGroupListDto[];
	rowServiceCosts: ServiceCostGetByGuildIdDto[];
	rowRepresentatives: CustomerGetRepresentativeDto[];
	rowGuildGroupDetail: CustomerGetGuildsDto | null;
	onToggleCollapse: (fieldId: string) => void;
	onRemove: (index: number) => void;
	setIsAddGuildModalOpen: (value: SetStateAction<boolean>) => void;
	onGuildChange: (index: number, guildId: number) => Promise<void>;
	onGuildGroupChange: (index: number, guildGroupId: number) => Promise<void>;
	onServiceCostChange: (index: number, serviceCostId: number) => void;
	formatPrice: (value: number) => string;
	onCopy: () => void;
}

export default function ServiceItemEditCard({
	fieldId,
	index,
	fieldsLength,
	row,
	customerId,
	control,
	register,
	setValue,
	errors,
	isCollapsed,
	itemHasError,
	guilds,
	rowGuildGroups,
	rowServiceCosts,
	rowRepresentatives,
	rowGuildGroupDetail,
	onToggleCollapse,
	onRemove,
	setIsAddGuildModalOpen,
	onGuildChange,
	onGuildGroupChange,
	onServiceCostChange,
	formatPrice,
	onCopy,
}: ServiceItemEditCardProps) {
	const selectedGuildId = Number(row?.GuildId || 0);
	const selectedGuildGroupId = Number(row?.GuildGroupId || 0);
	const selectedServiceCostId = Number(row?.ServiceCostId || 0);

	const selectedGuild = guilds.find((x) => x.Id === selectedGuildId);
	const selectedGuildGroup = rowGuildGroups.find((x) => x.Id === selectedGuildGroupId);

	const selectedServiceCost = rowServiceCosts.find((x) => x.Id === selectedServiceCostId);

	const selectedPeriods = Array.isArray(row?.PerformedPeriods) ? row.PerformedPeriods : [];

	const selectedPeriodsTitle =
		selectedPeriods.length > 0
			? [...selectedPeriods]
					.sort((a, b) => {
						if (a.PersianYear !== b.PersianYear) {
							return a.PersianYear - b.PersianYear;
						}

						return a.PersianMonth - b.PersianMonth;
					})
					.map((period) => {
						const monthTitle = persianMonths.find((x) => x.id === period.PersianMonth)?.title;
						return monthTitle ? `${monthTitle} ${period.PersianYear}` : null;
					})
					.filter(Boolean)
					.join("، ")
			: "انتخاب نشده";

	const rowTotal = Number(row?.Quantity || 0) * Number(row?.UnitPrice || 0);
	const rowFinal = Math.max(rowTotal - Number(row?.Discount || 0), 0);

	const allowCustomPrice = selectedServiceCost?.AllowCustomPrice ?? false;

	const representativePlaceholder = !customerId
		? "ابتدا مشتری را انتخاب کنید"
		: !selectedGuildGroupId
			? "ابتدا گروه سامانه را انتخاب کنید"
			: rowRepresentatives.length === 0
				? "موردی یافت نشد"
				: "انتخاب نماینده";

	useEffect(() => {
		if (selectedGuildGroupId > 0 && selectedGuildGroup && !selectedGuildGroup.HasPeriodicOperation) {
			setValue(`Items.${index}.PerformedPeriods`, []);
		}
	}, [selectedGuildGroup, selectedGuildGroupId, index, setValue]);

	return (
		<div
			className={`p-4 border bg-white rounded-xl shadow-sm space-y-4 transition-all ${
				itemHasError
					? "border-rose-300 ring-2 ring-rose-50"
					: isCollapsed
						? "border-slate-200"
						: "border-indigo-100 ring-2 ring-indigo-50/50"
			}`}
		>
			<div className="flex flex-col gap-3">
				<div className="flex items-start justify-between gap-3">
					<button
						type="button"
						onClick={() => onToggleCollapse(fieldId)}
						className="flex flex-1 items-start gap-3 text-right"
					>
						<span
							className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
								itemHasError
									? "border-rose-200 bg-rose-50 text-rose-600"
									: "border-indigo-100 bg-indigo-50 text-indigo-600"
							}`}
						>
							{isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
						</span>

						<div className="min-w-0 flex-1">
							<div className="flex flex-wrap items-center gap-2">
								<span className="text-sm font-extrabold text-slate-800">آیتم {index + 1}</span>

								{itemHasError && (
									<span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600">
										<AlertCircle className="h-3.5 w-3.5" />
										دارای خطا
									</span>
								)}

								{isCollapsed && (
									<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
										بسته
									</span>
								)}
							</div>

							<div className="mt-2 flex flex-wrap gap-2 text-xs">
								<span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
									سامانه: {selectedGuild?.Title || "انتخاب نشده"}
								</span>

								<span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
									گروه: {selectedGuildGroup?.Name || "انتخاب نشده"}
								</span>

								<span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
									خدمت: {selectedServiceCost?.Title || "انتخاب نشده"}
								</span>

								<span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-indigo-700">
									ماه‌ها: {selectedPeriodsTitle}
								</span>

								<span className="rounded-full border border-green-100 bg-green-50 px-2.5 py-1 font-bold text-green-700">
									نهایی: {formatPrice(rowFinal)} تومان
								</span>
							</div>
						</div>
					</button>

					<div className="flex flex-col md:flex-row items-center gap-2">
						<Button
							size="sm"
							type="button"
							onClick={() => onToggleCollapse(fieldId)}
							className="border border-slate-200 bg-white hover:bg-slate-50 p-2 rounded-lg transition-all text-slate-500"
							title={isCollapsed ? "باز کردن آیتم" : "بستن آیتم"}
						>
							{isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
						</Button>
						<Button
							type="button"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								onCopy();
							}}
							className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
							title="کپی آیتم"
							aria-label={`کپی آیتم ${index + 1}`}
						>
							<Copy className="w-3.5 h-3.5" />
							کپی
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => {
								if (fieldsLength === 1) return;
								onRemove(index);
							}}
							disabled={fieldsLength === 1}
							className="text-rose-500 disabled:opacity-40 hover:text-white border border-rose-200 hover:bg-rose-500 hover:border-rose-500 p-2 rounded-lg transition-all"
							title="حذف آیتم"
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>

			{!isCollapsed && (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
						<div className="md:col-span-2 xl:col-span-3">
							{rowGuildGroupDetail ? (
								<CustomerGuildInfoCard data={rowGuildGroupDetail} />
							) : selectedGuildGroupId > 0 ? (
								<div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500">
									اطلاعاتی برای گروه انتخاب‌شده یافت نشد.
								</div>
							) : (
								<div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500">
									برای مشاهده اطلاعات، گروه سامانه را انتخاب کنید.
								</div>
							)}
						</div>

						<div>
							<div className="flex items-center justify-between mb-1.5">
								<label className="block text-sm font-semibold text-slate-700">سامانه</label>

								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setIsAddGuildModalOpen(true)}
									disabled={!customerId}
									className="text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
								>
									<Plus className="w-3.5 h-3.5" />
									اختصاص سامانه به مشتری
								</Button>
							</div>

							<Controller
								control={control}
								name={`Items.${index}.GuildId`}
								render={({ field }) => (
									<Select
										name={field.name}
										value={field.value || null}
										onValueChange={(value) => {
											const selectedValue = Number(value ?? 0);

											field.onChange(selectedValue);
											void onGuildChange(index, selectedValue);
										}}
										schema={ServiceEditItemSchema}
										onBlur={field.onBlur}
										placeholder={!customerId ? "ابتدا مشتری را انتخاب کنید" : "انتخاب سامانه"}
										searchPlaceholder="جستجوی سامانه..."
										clearable
										disabled={!customerId}
										error={errors.Items?.[index]?.GuildId?.message}
										options={guilds.map((x) => ({
											label: x.Title,
											value: x.Id,
										}))}
										triggerClassName="border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 hover:border-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
									/>
								)}
							/>
						</div>

						<div>
							<Controller
								control={control}
								name={`Items.${index}.GuildGroupId`}
								render={({ field }) => (
									<Select
										label="گروه سامانه"
										name={field.name}
										value={field.value || null}
										onValueChange={(value) => {
											const selectedValue = Number(value ?? 0);

											field.onChange(selectedValue);
											void onGuildGroupChange(index, selectedValue);
										}}
										onBlur={field.onBlur}
										schema={ServiceEditItemSchema}
										placeholder={
											selectedGuildId ? "انتخاب گروه سامانه" : "ابتدا سامانه را انتخاب کنید"
										}
										searchPlaceholder="جستجوی گروه سامانه..."
										clearable
										disabled={!selectedGuildId}
										error={errors.Items?.[index]?.GuildGroupId?.message}
										options={rowGuildGroups.map((item) => ({
											label: item.Name,
											value: item.Id,
										}))}
										labelClassName="block text-sm font-semibold text-slate-700 mb-1.5"
										triggerClassName="border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 hover:border-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
									/>
								)}
							/>
						</div>

						<Controller
							control={control}
							name={`Items.${index}.RepresentativeCustomerId`}
							render={({ field }) => (
								<Select
									label="نماینده مشتری"
									name={field.name}
									value={field.value || null}
									onValueChange={(value) => field.onChange(Number(value ?? 0))}
									onBlur={field.onBlur}
									schema={ServiceEditItemSchema}
									placeholder={representativePlaceholder}
									searchPlaceholder="جستجوی نماینده مشتری..."
									clearable
									disabled={!customerId || !selectedGuildGroupId}
									error={errors.Items?.[index]?.RepresentativeCustomerId?.message}
									options={rowRepresentatives.map((item) => ({
										label: item.RepresentativeFullName,
										value: item.RepresentativeId,
									}))}
									labelClassName="block text-sm font-semibold text-slate-700 mb-1.5"
									triggerClassName="border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 hover:border-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
								/>
							)}
						/>

						<Controller
							control={control}
							name={`Items.${index}.ServiceCostId`}
							render={({ field }) => (
								<Select
									label="هزینه خدمت"
									name={field.name}
									value={field.value || null}
									onValueChange={(value) => {
										const selectedValue = Number(value ?? 0);

										field.onChange(selectedValue);
										onServiceCostChange(index, selectedValue);
									}}
									schema={ServiceEditItemSchema}
									onBlur={field.onBlur}
									placeholder={
										!selectedGuildId
											? "ابتدا سامانه را انتخاب کنید"
											: rowServiceCosts.length === 0
												? "موردی یافت نشد"
												: "انتخاب هزینه خدمت"
									}
									searchPlaceholder="جستجوی هزینه خدمت..."
									clearable
									disabled={!selectedGuildId}
									error={errors.Items?.[index]?.ServiceCostId?.message}
									options={rowServiceCosts.map((item) => ({
										label: item.Title,
										value: item.Id,
									}))}
									labelClassName="block text-sm font-semibold text-slate-700 mb-1.5"
									triggerClassName="border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 hover:border-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
								/>
							)}
						/>

						<div>
							<Input
								label="تعداد"
								type="number"
								inputMode="numeric"
								{...register(`Items.${index}.Quantity`, {
									valueAsNumber: true,
								})}
								placeholder="0"
								schema={ServiceEditItemSchema}
								error={errors.Items?.[index]?.Quantity?.message}
							/>
						</div>

						<div>
							<Controller
								control={control}
								name={`Items.${index}.UnitPrice`}
								render={({ field }) => (
									<Input
										label="مبلغ واحد"
										name={field.name}
										ref={field.ref}
										type="text"
										schema={ServiceEditItemSchema}
										inputMode="numeric"
										placeholder="مثلاً 1,500,000"
										disabled={selectedServiceCostId > 0 && !allowCustomPrice}
										value={formatNumberWithCommas(field.value || 0)}
										onBlur={field.onBlur}
										onChange={(e) => {
											const numericValue = parseCurrencyValue(e.target.value);

											field.onChange(numericValue);

											setValue(`Items.${index}.UnitPrice`, numericValue, {
												shouldValidate: true,
												shouldDirty: true,
											});
										}}
										error={errors.Items?.[index]?.UnitPrice?.message}
									/>
								)}
							/>

							{selectedServiceCostId > 0 && (
								<p className="text-xs mt-1.5 text-slate-500">
									{allowCustomPrice
										? "قیمت این خدمت قابل ویرایش است."
										: "قیمت این خدمت ثابت است و قابل ویرایش نیست."}
								</p>
							)}
						</div>

						<div>
							<Controller
								control={control}
								name={`Items.${index}.Discount`}
								render={({ field }) => (
									<Input
										label="تخفیف"
										name={field.name}
										ref={field.ref}
										type="text"
										inputMode="numeric"
										placeholder="مثلاً 150,000"
										schema={ServiceEditItemSchema}
										value={formatNumberWithCommas(field.value || 0)}
										onBlur={field.onBlur}
										onChange={(e) => {
											const numericValue = parseCurrencyValue(e.target.value);

											field.onChange(numericValue);

											setValue(`Items.${index}.Discount`, numericValue, {
												shouldValidate: true,
												shouldDirty: true,
											});
										}}
										error={errors.Items?.[index]?.Discount?.message}
									/>
								)}
							/>

							{Number(row?.Discount || 0) > 0 && (
								<p className="text-xs text-slate-500 mt-1">
									{formatPrice(Number(row?.Discount || 0))} تومان
								</p>
							)}
						</div>

						<div className="md:col-span-2 xl:col-span-3">
							<Textarea
								label="توضیحات آیتم"
								schema={ServiceEditItemSchema}
								error={errors.Items?.[index]?.Description?.message}
								placeholder="توضیحات این آیتم..."
								rows={2}
								{...register(`Items.${index}.Description`)}
							/>
						</div>

						{selectedGuildGroup?.HasPeriodicOperation && (
							<div className="md:col-span-2 xl:col-span-3">
								<label className="block text-sm font-semibold text-slate-700 mb-1.5">
									دوره‌های انجام خدمت
								</label>

								<Controller
									control={control}
									name={`Items.${index}.PerformedPeriods`}
									render={({ field }) => {
										return (
											<PeriodMultiSelect
												value={field.value || []}
												onChange={field.onChange}
												error={errors.Items?.[index]?.PerformedPeriods?.message}
												disabledPeriods={(selectedGuildGroup?.PerformedPeriods || [])
													.filter((period) => period.IsDone)
													.map((period) => ({
														PersianYear: Number(period.PersianYear),
														PersianMonth: Number(period.PersianMonth),
													}))}
											/>
										);
									}}
								/>
							</div>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm">
							<span className="text-slate-500">جمع ردیف:</span>
							<span className="font-bold text-slate-800 mr-2">{formatPrice(rowTotal)} تومان</span>
						</div>

						<div className="bg-green-50 border border-green-200 rounded-xl px-3 py-3 text-sm">
							<span className="text-slate-600">مبلغ نهایی ردیف:</span>
							<span className="font-bold text-green-700 mr-2">{formatPrice(rowFinal)} تومان</span>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

function CustomerGuildInfoCard({ data }: { data: CustomerGetGuildsDto }) {
	return (
		<div className="rounded-xl border border-indigo-100 bg-indigo-50/40 overflow-hidden">
			<div className="px-4 py-3 border-b border-indigo-100 bg-white/70">
				<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
					<div>
						<div className="text-sm font-bold text-slate-800">{data.CustomerFullName}</div>
						<div className="text-xs text-slate-500 mt-1">اطلاعات مشتری در سامانه / گروه انتخاب‌شده</div>
					</div>

					<div className="flex flex-wrap gap-2">
						<span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
							سامانه: {data.GuildName}
						</span>

						<span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
							گروه: {data.GuildGroupName}
						</span>
					</div>
				</div>
			</div>

			<div className="p-4 space-y-4">
				{data.Fields && data.Fields.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{data.Fields.map((field) => {
							const isListField = Number(field.DataType) === 5;

							return (
								<div
									key={field.FieldId}
									className={`rounded-lg border border-slate-200 bg-white px-3 py-3 ${
										isListField ? "md:col-span-2" : ""
									}`}
								>
									<div className="text-xs text-slate-500 mb-1">
										{field.FieldName ?? `فیلد ${field.FieldId}`}
										{field.IsRequired && <span className="text-rose-500 mr-1">*</span>}
									</div>

									<div className="text-sm font-medium wrap-break-word">
										<RenderFieldValue field={field} />
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="text-sm text-slate-400">اطلاعاتی برای این گروه ثبت نشده است.</div>
				)}

				{/* {guildGroup?.HasPeriodicOperation && <CustomerGuildMonthlyStatus items={guildGroup.PerformedPeriods} />} */}
			</div>
		</div>
	);
}

function RenderFieldValue({ field }: { field: CustomerGetGuildsFieldDto }) {
	if (field.Value === null || field.Value.trim() === "") {
		return <span className="text-slate-400">—</span>;
	}

	switch (field.DataType) {
		case 4:
			return (
				<span
					className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
						field.Value === "true" || field.Value === "1"
							? "bg-green-100 text-green-700"
							: "bg-rose-100 text-rose-700"
					}`}
				>
					{field.Value === "true" || field.Value === "1" ? "بله" : "خیر"}
					<CopyToClipboard textToCopy={field.Value} size={12} />
				</span>
			);

		case 5:
			return <RenderListFieldValue field={field} />;

		default:
			return (
				<span className="inline-flex items-center gap-1">
					<span className="text-slate-800">{field.Value}</span>
					<CopyToClipboard textToCopy={field.Value} size={12} />
				</span>
			);
	}
}

type ListRow = Record<string, any>;

function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
	if (!value) return fallback;

	try {
		return JSON.parse(value) as T;
	} catch {
		return fallback;
	}
}

function RenderListFieldValue({ field }: { field: CustomerGetGuildsFieldDto }) {
	const rows = safeJsonParse<ListRow[]>(field.Value, []);
	const columns = Array.isArray(field.Columns) ? field.Columns : [];

	if (!Array.isArray(rows) || rows.length === 0) {
		return (
			<span className="inline-flex items-center gap-1 text-slate-400">
				—
				<CopyToClipboard textToCopy={field.Value ?? ""} size={12} />
			</span>
		);
	}

	if (columns.length === 0) {
		return (
			<div className="space-y-2">
				<div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
					ستون‌های این فیلد لیستی تعریف نشده است.
				</div>

				<pre className="max-w-full overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
					{JSON.stringify(rows, null, 2)}
				</pre>

				<CopyToClipboard textToCopy={field.Value ?? ""} size={12} />
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
				<table className="min-w-full border-collapse text-sm">
					<thead className="bg-slate-50">
						<tr>
							<th className="w-12 border-b border-slate-200 px-3 py-2 text-center text-xs font-bold text-slate-600">
								#
							</th>

							{columns.map((column) => (
								<th
									key={column.Key}
									className="border-b border-slate-200 px-3 py-2 text-right text-xs font-bold text-slate-600"
								>
									{column.Title}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{rows.map((row, rowIndex) => (
							<tr key={rowIndex} className="border-t border-slate-100">
								<td className="px-3 py-2 text-center text-xs font-bold text-slate-500">
									{rowIndex + 1}
								</td>

								{columns.map((column) => (
									<td key={column.Key} className="px-3 py-2 text-slate-800">
										{renderListCellValue(row?.[column.Key], column.DataType)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* <div className="flex justify-end">
				<CopyToClipboard textToCopy={field.Value ?? ""} size={12} />
			</div> */}
		</div>
	);
}

function renderListCellValue(value: any, dataType: number) {
	if (value === null || value === undefined || value === "") {
		return <span className="text-slate-400">—</span>;
	}

	switch (Number(dataType)) {
		case 4:
			return (
				<span
					className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
						value === true || value === "true" || value === "1"
							? "bg-green-100 text-green-700"
							: "bg-rose-100 text-rose-700"
					}`}
				>
					{value === true || value === "true" || value === "1" ? "بله" : "خیر"}
				</span>
			);

		case 3:
			return <span>{String(value)}</span>;

		case 2:
			return <span>{formatNumberValue(value)}</span>;

		case 1:
		default:
			return (
				<span>
					{String(value)}
					<CopyToClipboard textToCopy={String(value) ?? ""} size={12} />
				</span>
			);
	}
}

function formatNumberValue(value: any) {
	const numberValue = Number(value);

	if (Number.isNaN(numberValue)) {
		return String(value);
	}

	return numberValue.toLocaleString("fa-IR");
}

function getCurrentPersianPeriod(): { PersianYear: number; PersianMonth: number } {
	try {
		const parts = new Intl.DateTimeFormat("en-US-u-ca-persian", {
			year: "numeric",
			month: "numeric",
		}).formatToParts(new Date());

		const year = Number(parts.find((part) => part.type === "year")?.value);
		const month = Number(parts.find((part) => part.type === "month")?.value);

		if (!year || !month) {
			return { PersianYear: 1400, PersianMonth: 1 };
		}

		return { PersianYear: year, PersianMonth: month };
	} catch {
		return { PersianYear: 1400, PersianMonth: 1 };
	}
}

function PeriodMultiSelect({
	value = [],
	onChange,
	error,
	disabled = false,
	disabledPeriods = [],
}: {
	value?: ServicePerformedPeriodValue[];
	onChange: (periods: ServicePerformedPeriodValue[]) => void;
	error?: string;
	disabled?: boolean;
	disabledPeriods?: ServicePerformedPeriodValue[];
}) {
	const currentPeriod = getCurrentPersianPeriod();

	const [visibleYear, setVisibleYear] = useState<number>(currentPeriod.PersianYear);

	const selectedPeriods = value ?? [];

	const createPeriodKey = (year: number, month: number) => `${year}-${month}`;

	const disabledPeriodKeySet = useMemo(() => {
		const set = new Set<string>();

		(disabledPeriods || []).forEach((period) => {
			const year = Number(period.PersianYear);
			const month = Number(period.PersianMonth);

			if (year >= 1300 && year <= 1600 && month >= 1 && month <= 12) {
				set.add(createPeriodKey(year, month));
			}
		});

		return set;
	}, [disabledPeriods]);

	const isDisabledPeriod = (year: number, month: number) => disabledPeriodKeySet.has(createPeriodKey(year, month));

	const getPeriodsKey = (periods: ServicePerformedPeriodValue[]) => {
		return periods
			.map((period) => createPeriodKey(Number(period.PersianYear), Number(period.PersianMonth)))
			.sort()
			.join("|");
	};

	const isSelected = (year: number, month: number) => {
		return selectedPeriods.some((period) => period.PersianYear === year && period.PersianMonth === month);
	};

	const normalizePeriods = (periods: ServicePerformedPeriodValue[]) => {
		const map = new Map<string, ServicePerformedPeriodValue>();

		periods.forEach((period) => {
			const year = Number(period.PersianYear);
			const month = Number(period.PersianMonth);

			if (year >= 1300 && year <= 1600 && month >= 1 && month <= 12 && !isDisabledPeriod(year, month)) {
				map.set(createPeriodKey(year, month), {
					PersianYear: year,
					PersianMonth: month,
				});
			}
		});

		return Array.from(map.values()).sort((a, b) => {
			if (a.PersianYear !== b.PersianYear) {
				return a.PersianYear - b.PersianYear;
			}

			return a.PersianMonth - b.PersianMonth;
		});
	};

	useEffect(() => {
		const normalizedPeriods = normalizePeriods(selectedPeriods);

		const currentKey = getPeriodsKey(selectedPeriods);
		const normalizedKey = getPeriodsKey(normalizedPeriods);

		if (currentKey !== normalizedKey) {
			onChange(normalizedPeriods);
		}
	}, [disabledPeriodKeySet]);

	const togglePeriod = (year: number, month: number) => {
		if (disabled || isDisabledPeriod(year, month)) return;

		const exists = isSelected(year, month);

		if (exists) {
			onChange(
				selectedPeriods.filter((period) => !(period.PersianYear === year && period.PersianMonth === month)),
			);

			return;
		}

		onChange(
			normalizePeriods([
				...selectedPeriods,
				{
					PersianYear: year,
					PersianMonth: month,
				},
			]),
		);
	};

	const selectCurrentMonth = () => {
		if (disabled || isDisabledPeriod(currentPeriod.PersianYear, currentPeriod.PersianMonth)) {
			return;
		}

		setVisibleYear(currentPeriod.PersianYear);

		onChange(
			normalizePeriods([
				...selectedPeriods,
				{
					PersianYear: currentPeriod.PersianYear,
					PersianMonth: currentPeriod.PersianMonth,
				},
			]),
		);
	};

	const selectPreviousMonth = () => {
		if (disabled) return;

		let year = currentPeriod.PersianYear;
		let month = currentPeriod.PersianMonth - 1;

		if (month < 1) {
			month = 12;
			year -= 1;
		}

		if (isDisabledPeriod(year, month)) return;

		setVisibleYear(year);

		onChange(
			normalizePeriods([
				...selectedPeriods,
				{
					PersianYear: year,
					PersianMonth: month,
				},
			]),
		);
	};

	const selectNextMonth = () => {
		if (disabled) return;

		let year = currentPeriod.PersianYear;
		let month = currentPeriod.PersianMonth + 1;

		if (month > 12) {
			month = 1;
			year += 1;
		}

		if (isDisabledPeriod(year, month)) return;

		setVisibleYear(year);

		onChange(
			normalizePeriods([
				...selectedPeriods,
				{
					PersianYear: year,
					PersianMonth: month,
				},
			]),
		);
	};

	const selectVisibleYear = () => {
		if (disabled) return;

		const yearPeriods = persianMonths.map((month) => ({
			PersianYear: visibleYear,
			PersianMonth: month.id,
		}));

		onChange(normalizePeriods([...selectedPeriods, ...yearPeriods]));
	};

	const clearVisibleYear = () => {
		if (disabled) return;

		onChange(selectedPeriods.filter((period) => period.PersianYear !== visibleYear));
	};

	const clearAll = () => {
		if (disabled) return;

		onChange([]);
	};

	const selectedVisibleYearCount = selectedPeriods.filter((period) => period.PersianYear === visibleYear).length;

	const selectedTitle =
		selectedPeriods.length > 0
			? selectedPeriods
					.map((period) => {
						const monthTitle = persianMonths.find((x) => x.id === period.PersianMonth)?.title;
						return monthTitle ? `${monthTitle} ${period.PersianYear}` : null;
					})
					.filter(Boolean)
					.join("، ")
			: "دوره‌ای انتخاب نشده است.";

	const previousPeriod = (() => {
		let year = currentPeriod.PersianYear;
		let month = currentPeriod.PersianMonth - 1;

		if (month < 1) {
			month = 12;
			year -= 1;
		}

		return { PersianYear: year, PersianMonth: month };
	})();

	const nextPeriod = (() => {
		let year = currentPeriod.PersianYear;
		let month = currentPeriod.PersianMonth + 1;

		if (month > 12) {
			month = 1;
			year += 1;
		}

		return { PersianYear: year, PersianMonth: month };
	})();

	const currentMonthIsDisabled = isDisabledPeriod(currentPeriod.PersianYear, currentPeriod.PersianMonth);

	const previousMonthIsDisabled = isDisabledPeriod(previousPeriod.PersianYear, previousPeriod.PersianMonth);

	const nextMonthIsDisabled = isDisabledPeriod(nextPeriod.PersianYear, nextPeriod.PersianMonth);

	return (
		<div className="space-y-3">
			<div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
				<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<div className="text-sm font-bold text-slate-800">انتخاب سال و ماه انجام خدمت</div>
						<p className="text-xs text-slate-500 mt-1">
							برای مواردی مثل پرداخت بیمه سال قبل یا سال بعد، سال موردنظر را تغییر دهید و ماه‌ها را انتخاب
							کنید.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<Button
							size="sm"
							type="button"
							disabled={disabled}
							onClick={() => setVisibleYear((prev) => prev - 1)}
							className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
						>
							سال قبل
						</Button>

						<div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-extrabold text-indigo-700">
							{visibleYear}
						</div>

						<Button
							size="sm"
							type="button"
							disabled={disabled}
							onClick={() => setVisibleYear((prev) => prev + 1)}
							className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
						>
							سال بعد
						</Button>
					</div>
				</div>

				<div className="mt-3 flex flex-wrap gap-2">
					<Button
						size="sm"
						type="button"
						disabled={disabled || currentMonthIsDisabled}
						onClick={selectCurrentMonth}
						className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
					>
						{currentMonthIsDisabled ? "ماه جاری انجام شده" : "ماه جاری"}
					</Button>

					<Button
						type="button"
						size="sm"
						disabled={disabled || previousMonthIsDisabled}
						onClick={selectPreviousMonth}
						className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{previousMonthIsDisabled ? "ماه قبل انجام شده" : "ماه قبل"}
					</Button>

					<Button
						size="sm"
						type="button"
						disabled={disabled || nextMonthIsDisabled}
						onClick={selectNextMonth}
						className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{nextMonthIsDisabled ? "ماه بعد انجام شده" : "ماه بعد"}
					</Button>

					<Button
						size="sm"
						type="button"
						disabled={disabled}
						onClick={selectVisibleYear}
						className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
					>
						انتخاب همه ماه‌های {visibleYear}
					</Button>

					<Button
						size="sm"
						type="button"
						disabled={disabled}
						onClick={clearVisibleYear}
						className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 disabled:opacity-60"
					>
						پاک کردن سال {visibleYear}
					</Button>

					<Button
						size="sm"
						type="button"
						disabled={disabled}
						onClick={clearAll}
						className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
					>
						پاک کردن همه
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
				{persianMonths.map((month) => {
					const selected = isSelected(visibleYear, month.id);
					const isCurrent =
						visibleYear === currentPeriod.PersianYear && month.id === currentPeriod.PersianMonth;
					const isDone = isDisabledPeriod(visibleYear, month.id);

					return (
						<Button
							size="sm"
							key={`${visibleYear}-${month.id}`}
							type="button"
							disabled={disabled || isDone}
							onClick={() => togglePeriod(visibleYear, month.id)}
							title={isDone ? "این دوره قبلاً انجام شده و قابل انتخاب نیست." : undefined}
							className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed ${
								isDone
									? "border-emerald-200 bg-emerald-50 text-emerald-700 opacity-75"
									: selected
										? "border-indigo-500 bg-indigo-50 text-indigo-700"
										: isCurrent
											? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
											: "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
							}`}
						>
							<span className="flex items-center gap-1.5">
								{month.title}

								{isCurrent && (
									<span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
										جاری
									</span>
								)}
								{isDone && (
									<span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
										انجام شده
									</span>
								)}
							</span>

							{isDone ? (
								<span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
									<CheckCircle2 className="h-3.5 w-3.5" />
								</span>
							) : selected ? (
								<span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
									<Check className="h-3.5 w-3.5" />
								</span>
							) : null}
						</Button>
					);
				})}
			</div>

			<div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
				<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
					<span className="text-xs font-bold text-slate-500">
						انتخاب‌شده در سال {visibleYear}: {selectedVisibleYearCount} ماه
					</span>

					<span className="text-xs font-bold text-slate-500">
						کل دوره‌های انتخاب‌شده: {selectedPeriods.length}
					</span>
				</div>

				<p className="mt-2 text-xs leading-6 text-slate-600">{selectedTitle}</p>
			</div>

			{error && <p className="text-rose-500 text-sm font-medium">{error}</p>}
		</div>
	);
}
