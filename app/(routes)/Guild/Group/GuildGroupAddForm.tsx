"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Briefcase, Calendar, Clock, Database, Loader2, Plus, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import SmsTempSelector from "@/components/sms/SmsTempSelector";
import { GuildGetListDto } from "@/dataBinding/models/Guild/GuildGetListDto";
import {
	GuildGroupAddDto,
	GuildGroupAddFieldColumnSchema,
	GuildGroupAddFieldSchema,
	GuildGroupAddSchema,
} from "@/dataBinding/models/Guild/GuildGroup/GuildGroupAddDto";
import { GuildGroupGetFieldTypesDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetFieldTypesDto";
import { GuildGroupGetReminderTypesDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetReminderTypesDto";
import { GuildGroupService } from "@/dataBinding/services/Guild/GuildGroupService";
import { GuildService } from "@/dataBinding/services/Guild/GuildService";
import PersianTimePicker from "@/utilities/components/datepicker/persian-time-picker";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";

import GuildFieldRow from "../GuildFieldRowForm";
import { Input } from "@/utilities/components/ui/input";
import { Select } from "@/utilities/components/ui/select";
import { Checkbox } from "@/utilities/components/ui/checkbox";

interface GuildGroupAddFormProps {
	onClose: () => void;
	onSuccess: () => void;
	GuildId?: number;
}

export default function GuildGroupAddForm({ onClose, onSuccess, GuildId }: GuildGroupAddFormProps) {
	const [hasReminder, setHasReminder] = useState(false);
	const [isLoadingData, setIsLoadingData] = useState(true);

	const [fieldTypes, setFieldTypes] = useState<GuildGroupGetFieldTypesDto[]>([]);
	const [reminderTypes, setReminderTypes] = useState<GuildGroupGetReminderTypesDto[]>([]);
	const [guildList, setGuildList] = useState<GuildGetListDto[]>([]);

	const {
		register,
		control,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<GuildGroupAddDto>({
		resolver: zodResolver(GuildGroupAddSchema),
		defaultValues: {
			GuildId: GuildId,
			Name: "",
			Fields: [],
			Reminder: null,
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "Fields",
	});

	const currentReminderTypeId = useWatch({
		control,
		name: "Reminder.Type",
	});

	const isManualOrOneTime = useMemo(() => {
		if (!currentReminderTypeId || reminderTypes.length === 0) return false;
		const selectedType = reminderTypes.find((t) => t.Id === currentReminderTypeId);
		if (!selectedType) return false;
		const name = selectedType.Name;
		return name.includes("دستی") || name.includes("یک باره") || name.includes("یکباره");
	}, [currentReminderTypeId, reminderTypes]);

	useEffect(() => {
		void fetchBaseData();
	}, []);

	const fetchBaseData = async () => {
		try {
			setIsLoadingData(true);

			const [fieldsResult, remindersResult, guildListResult] = await Promise.all([
				GuildGroupService.GetFieldTypes(),
				GuildGroupService.GetReminderTypes(),
				GuildService.GetList(),
			]);

			setReminderTypes(remindersResult ?? []);
			setFieldTypes(fieldsResult ?? []);
			setGuildList(guildListResult ?? []);

			if (GuildId !== undefined) {
				setValue("GuildId", GuildId);
			}
		} catch {
			Messenger.errorMessage("خطا در دریافت اطلاعات پایه از سرور");
		} finally {
			setIsLoadingData(false);
		}
	};

	const handleReminderToggle = (checked: boolean) => {
		setHasReminder(checked);
		if (checked) {
			setValue("Reminder", {
				Type: reminderTypes[0]?.Id || 1,
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
			FieldName: "",
			DataType: fieldTypes[0]?.Id || 1,
			IsRequired: true,
			Columns: [],
		});
	};

	const onSubmit = async (data: GuildGroupAddDto) => {
		try {
			let processedReminder = data.Reminder;

			if (hasReminder && processedReminder) {
				const selectedType = reminderTypes.find((t) => t.Id === processedReminder?.Type);
				const isManual =
					selectedType &&
					(selectedType.Name.includes("دستی") ||
						selectedType.Name.includes("یک باره") ||
						selectedType.Name.includes("یکباره"));

				if (isManual) {
					processedReminder = {
						...processedReminder,
						DayOfMonth: null,
						TimeOfDay: null,
					};
				}
			} else {
				processedReminder = null;
			}

			const payload = {
				...data,
				Fields: data.Fields && data.Fields.length > 0 ? data.Fields : null,
				Reminder: processedReminder,
			};

			const result = await GuildGroupService.Add(payload);

			if (result) {
				Messenger.successAlert("سامانه با موفقیت ثبت شد.");
				onSuccess();
			} else {
				Messenger.errorMessage("خطا در ثبت سامانه.");
			}
		} catch {
			Messenger.errorMessage("ارتباط با سرور برقرار نشد.");
		}
	};

	return (
		<PageCard>
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-5">
				<PageCardContent>
					<div className="space-y-5">
						<Controller
							control={control}
							name="GuildId"
							render={({ field }) => (
								<Select
									label="سامانه"
									name={field.name}
									value={field.value ?? null}
									onValueChange={(value) => field.onChange(value ?? undefined)}
									onBlur={field.onBlur}
									placeholder="انتخاب سامانه"
									searchPlaceholder="جستجوی سامانه..."
									clearable
									schema={GuildGroupAddSchema}
									error={errors.GuildId?.message}
									icon={<Briefcase className="h-5 w-5" />}
									options={guildList.map((x) => ({
										label: x.Name,
										value: x.Id,
									}))}
									labelClassName="block text-sm font-semibold text-slate-700"
									triggerClassName="border-slate-300 bg-white py-3 pl-10 pr-11 text-sm text-slate-700 shadow-sm hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
								/>
							)}
						/>
					</div>

					<div className="space-y-5">
						<Input
							label="نام گروه سامانه"
							schema={GuildGroupAddSchema}
							error={errors.Name?.message}
							icon={<Briefcase className="h-5 w-5" />}
							placeholder="مثال: سامانه مالیات"
							{...register("Name")}
						/>
					</div>

					<div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 my-2">
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
							<div
								className={`p-4 grid grid-cols-1 ${isManualOrOneTime ? "sm:grid-cols-1" : "sm:grid-cols-3"} gap-5 animate-in fade-in slide-in-from-top-2`}
							>
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
												placeholder={isLoadingData ? "در حال بارگذاری..." : "انتخاب نوع یادآور"}
												searchPlaceholder="جستجوی نوع یادآور..."
												clearable
												disabled={isLoadingData}
												schema={GuildGroupAddSchema}
												error={errors.Reminder?.Type?.message}
												options={reminderTypes.map((type) => ({
													label: type.Name,
													value: type.Id,
												}))}
												labelClassName="mb-1.5 block text-sm font-semibold text-slate-700"
												triggerClassName="border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 hover:border-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:opacity-60"
											/>
										)}
									/>
								</div>

								{!isManualOrOneTime && (
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

											{errors.Reminder?.DayOfMonth && (
												<p className="text-rose-500 text-sm mt-1.5 font-medium">
													{errors.Reminder.DayOfMonth.message}
												</p>
											)}
										</div>
										<Input
											label="روز از ماه"
											schema={GuildGroupAddSchema}
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
												<PersianTimePicker<GuildGroupAddDto>
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
										schema={GuildGroupAddFieldSchema}
										columnsSchema={GuildGroupAddFieldColumnSchema}
										register={register}
										errors={errors}
										fieldTypes={fieldTypes}
										isLoadingData={isLoadingData}
										onRemove={() => remove(index)}
									/>
								))
							)}
						</div>
					</div>
				</PageCardContent>

				<PageCardFooter className="flex items-center gap-3 mt-8 pt-4 border-t border-slate-100">
					<Button type="button" variant="secondary" onClick={onClose}>
						انصراف
					</Button>
					<Button type="submit" variant="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								در حال ذخیره...
							</>
						) : (
							<>
								<Save className="w-5 h-5" />
								ثبت سامانه
							</>
						)}
					</Button>
				</PageCardFooter>
			</form>
		</PageCard>
	);
}
