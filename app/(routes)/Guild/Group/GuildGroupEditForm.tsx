"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, Bell, Briefcase, Calendar, Clock, Database, Loader2, Plus, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import SmsTempSelector from "@/components/sms/SmsTempSelector";
import {
	GuildGroupEditDto,
	GuildGroupEditFieldColumnSchema,
	GuildGroupEditFieldSchema,
	GuildGroupEditSchema,
} from "@/dataBinding/models/Guild/GuildGroup/GuildGroupEditDto";
import { GuildGroupGetFieldTypesDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetFieldTypesDto";
import { GuildGroupGetReminderTypesDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetReminderTypesDto";
import { GuildGroupService } from "@/dataBinding/services/Guild/GuildGroupService";
import PersianTimePicker from "@/utilities/components/datepicker/persian-time-picker";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";

import GuildFieldRow from "../GuildFieldRowForm";
import { Input } from "@/utilities/components/ui/input";
import { Select } from "@/utilities/components/ui/select";
import { Checkbox } from "@/utilities/components/ui/checkbox";

interface GuildGroupEditFormProps {
	guildGroupId: number;
	onClose?: () => void;
	onSuccess?: () => void;
}

export default function GuildGroupEditForm({ guildGroupId, onClose, onSuccess }: GuildGroupEditFormProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [hasReminder, setHasReminder] = useState(false);

	const [fieldTypes, setFieldTypes] = useState<GuildGroupGetFieldTypesDto[]>([]);
	const [reminderTypes, setReminderTypes] = useState<GuildGroupGetReminderTypesDto[]>([]);

	const {
		register,
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<GuildGroupEditDto>({
		resolver: zodResolver(GuildGroupEditSchema),
		defaultValues: {
			Id: guildGroupId,
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "Fields",
	});

	const watchedReminderType = useWatch({
		control,
		name: "Reminder.Type",
	});

	const isManualOrOneTime = useMemo(() => {
		if (!watchedReminderType) return false;
		if (watchedReminderType === 2) return true;

		const selectedType = reminderTypes.find((rt) => rt.Id === watchedReminderType);
		if (
			selectedType &&
			(selectedType.Name.includes("دستی") ||
				selectedType.Name.includes("یک باره") ||
				selectedType.Name.includes("یک‌باره"))
		) {
			return true;
		}

		return false;
	}, [watchedReminderType, reminderTypes]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [data, fetchedFieldTypes, fetchedReminderTypes] = await Promise.all([
					GuildGroupService.GetById(guildGroupId),
					GuildGroupService.GetFieldTypes(),
					GuildGroupService.GetReminderTypes(),
				]);

				setFieldTypes(fetchedFieldTypes || []);
				setReminderTypes(fetchedReminderTypes || []);

				setHasReminder(!!data.Reminder);

				reset({
					Id: guildGroupId,
					GuildId: data.GuildId,
					Name: data.Name,
					IsActive: data.IsActive,
					Reminder: data.Reminder
						? {
								Id: data.Reminder.Id,
								SmsTemplateId: data.Reminder.SmsTemplateId,
								Type: data.Reminder.Type,
								DayOfMonth: data.Reminder.DayOfMonth,
								TimeOfDay: data.Reminder.TimeOfDay,
							}
						: null,
					Fields: data.Fields
						? data.Fields.map((f) => ({
								Id: f.Id,
								FieldName: f.FieldName,
								DataType: f.DataType,
								IsRequired: f.IsRequired,
								Columns: f.Columns,
							}))
						: [],
				});
			} catch (error) {
				console.error(error);
				Messenger.errorMessage("خطا در دریافت اطلاعات سامانه.");
			} finally {
				setIsLoading(false);
			}
		};

		if (guildGroupId) {
			void fetchData();
		}
	}, [guildGroupId, reset]);

	const handleReminderToggle = (checked: boolean) => {
		setHasReminder(checked);
		if (checked) {
			const defaultReminderType = reminderTypes.length > 0 ? reminderTypes[0].Id : 1;

			setValue("Reminder", {
				Id: 0,
				Type: defaultReminderType,
				DayOfMonth: 1,
				TimeOfDay: "08:00",
				SmsTemplateId: 0,
			});
		} else {
			setValue("Reminder", null);
		}
	};

	const handleAddField = () => {
		append({
			Id: 0,
			FieldName: "",
			DataType: fieldTypes[0]?.Id || 1,
			IsRequired: true,
			Columns: [],
		});
	};

	const onSubmit = async (data: GuildGroupEditDto) => {
		try {
			const payload = { ...data };

			if (!payload.Fields || payload.Fields.length === 0) {
				payload.Fields = null;
			}

			if (payload.Reminder) {
				const isManualType =
					payload.Reminder.Type === 2 ||
					reminderTypes.find((rt) => rt.Id === payload.Reminder?.Type)?.Name.includes("دستی") ||
					reminderTypes.find((rt) => rt.Id === payload.Reminder?.Type)?.Name.includes("یک باره");

				if (isManualType) {
					payload.Reminder.DayOfMonth = null;
					payload.Reminder.TimeOfDay = null;
				}
			}

			const result = await GuildGroupService.Edit(payload);

			if (result) {
				Messenger.successAlert("ویرایش سامانه با موفقیت انجام شد.");
				if (onSuccess) onSuccess();
				if (onClose) onClose();
			} else {
				Messenger.errorMessage("خطا در ویرایش سامانه.");
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
					{hasReminder && <input type="hidden" {...register("Reminder.Id", { valueAsNumber: true })} />}

					<div className="space-y-5">
						<Input
							label="نام سامانه"
							schema={GuildGroupEditSchema}
							error={errors.Name?.message}
							icon={<Briefcase className="h-5 w-5" />}
							placeholder="مثال: سامانه مالیات"
							{...register("Name")}
						/>

						<div className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50/50">
							<Activity className="w-5 h-5 text-indigo-600" />
							<span className="text-sm font-semibold text-slate-700 ml-auto">وضعیت فعالیت سامانه</span>

							<Checkbox
								label="فعال باشد"
								schema={GuildGroupEditSchema}
								error={errors.IsActive?.message}
								checkboxClassName="border-slate-300 peer-checked:border-indigo-600 peer-checked:bg-indigo-600"
								{...register("IsActive")}
							/>
						</div>
					</div>

					<div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
						<div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Bell className="w-5 h-5 text-indigo-600" />
								<span className="text-sm font-semibold text-slate-700">تنظیمات یادآور</span>
							</div>

							<Checkbox
								label="فعال‌سازی"
								checked={hasReminder}
								onChange={(e) => handleReminderToggle(e.target.checked)}
								checkboxClassName="border-slate-300 peer-checked:border-indigo-600 peer-checked:bg-indigo-600"
							/>
						</div>

						{hasReminder && (
							<div className="p-4 space-y-5 animate-in fade-in slide-in-from-top-2">
								<div className="grid grid-cols-1">
									<div>
										<Controller
											control={control}
											name="Reminder.Type"
											render={({ field }) => (
												<Select
													label="نوع یادآور"
													name={field.name}
													value={field.value || null}
													onValueChange={(value) => field.onChange(value ?? 0)}
													onBlur={field.onBlur}
													placeholder={
														reminderTypes.length === 0
															? "در حال بارگذاری..."
															: "انتخاب نوع یادآور"
													}
													searchPlaceholder="جستجوی نوع یادآور..."
													clearable
													disabled={reminderTypes.length === 0}
													schema={GuildGroupEditSchema}
													error={errors.Reminder?.Type?.message}
													options={reminderTypes.map((rt) => ({
														label: rt.Name,
														value: rt.Id,
													}))}
													labelClassName="mb-1.5 block text-sm font-semibold text-slate-700"
													triggerClassName="border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 hover:border-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100"
												/>
											)}
										/>
									</div>
								</div>

								{isManualOrOneTime ? (
									<div className="grid grid-cols-1">
										<div>
											<Controller
												name="Reminder.SmsTemplateId"
												control={control}
												render={({ field }) => (
													<SmsTempSelector
														valueId={field.value}
														onChangeId={field.onChange}
														required
													/>
												)}
											/>
											{errors.Reminder?.SmsTemplateId && (
												<p className="text-rose-500 text-sm mt-1.5 font-medium">
													{errors.Reminder.SmsTemplateId.message}
												</p>
											)}
										</div>
									</div>
								) : (
									<>
										<div>
											<Controller
												name="Reminder.SmsTemplateId"
												control={control}
												render={({ field }) => (
													<SmsTempSelector
														valueId={field.value}
														onChangeId={field.onChange}
														required
													/>
												)}
											/>
											{errors.Reminder?.SmsTemplateId && (
												<p className="text-rose-500 text-sm mt-1.5 font-medium">
													{errors.Reminder.SmsTemplateId.message}
												</p>
											)}
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
											<Input
												label="روز از ماه"
												schema={GuildGroupEditSchema}
												error={errors.Reminder?.DayOfMonth?.message}
												icon={<Calendar className="h-5 w-5" />}
												type="number"
												min={1}
												max={31}
												inputClassName="dir-ltr"
												{...register("Reminder.DayOfMonth", { valueAsNumber: true })}
											/>

											<div>
												<label className="block text-sm font-semibold text-slate-700 mb-1.5">
													ساعت یادآوری
												</label>
												<div className="relative">
													<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
														<Clock className="h-5 w-5 text-slate-400" />
													</div>
													<PersianTimePicker<GuildGroupEditDto>
														control={control}
														name="Reminder.TimeOfDay"
													/>
												</div>
												{errors.Reminder?.TimeOfDay && (
													<p className="text-rose-500 text-sm mt-1.5 font-medium">
														{errors.Reminder.TimeOfDay.message}
													</p>
												)}
											</div>
										</div>
									</>
								)}
							</div>
						)}
					</div>

					<div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
						<div className="p-4 border-b border-slate-200 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Database className="w-5 h-5 text-indigo-600" />
								<span className="text-sm font-semibold text-slate-700">فیلدهای سامانه</span>
							</div>

							<Button
								type="button"
								size="sm"
								onClick={handleAddField}
								className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
							>
								<Plus className="w-4 h-4" />
								افزودن فیلد
							</Button>
						</div>

						<div className="p-4 flex flex-col gap-4 bg-slate-50/30">
							{fields.length === 0 ? (
								<div className="text-center py-6 text-sm text-slate-500 font-medium border-2 border-dashed border-slate-200 rounded-xl">
									هیچ فیلدی اضافه نشده است.
								</div>
							) : (
								fields.map((field, index) => (
									<GuildFieldRow
										key={field.id}
										index={index}
										control={control}
										schema={GuildGroupEditFieldSchema}
										columnsSchema={GuildGroupEditFieldColumnSchema}
										register={register}
										errors={errors}
										fieldTypes={fieldTypes}
										isLoadingData={isLoading}
										onRemove={() => remove(index)}
									/>
								))
							)}
						</div>
					</div>
				</PageCardContent>
				<PageCardFooter className="flex items-center gap-3 mt-8 pt-4 border-t border-slate-100">
					<Button type="button" onClick={onClose} variant="secondary">
						انصراف
					</Button>
					<Button type="submit" disabled={isSubmitting} variant="submit">
						{isSubmitting ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								در حال ثبت تغییرات...
							</>
						) : (
							<>
								<Save className="w-5 h-5" />
								ثبت تغییرات
							</>
						)}
					</Button>
				</PageCardFooter>
			</form>
		</PageCard>
	);
}
