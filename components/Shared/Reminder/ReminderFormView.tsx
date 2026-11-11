"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Calendar, Clock, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { ReminderAddDto, ReminderAddDtoSchema } from "@/dataBinding/models/Reminder/ReminderAddDto";
import PersianDatePicker from "@/utilities/components/datepicker/persian-date-picker";
import PersianTimePicker from "@/utilities/components/datepicker/persian-time-picker";
import { Button } from "@/utilities/components/ui/button";
import { Messenger } from "@/utilities/Messenger";
import { Input } from "@/utilities/components/ui/input";
import { Select } from "@/utilities/components/ui/select";
import { Textarea } from "@/utilities/components/ui/textarea";

interface ReminderTypeDto {
	Id: number;
	Name: string;
}

interface ReminderFormViewProps {
	reminderTypes: ReminderTypeDto[];
	onSubmitReminder: (data: ReminderAddDto) => Promise<unknown>;
}

const ReminderType = {
	None: 0,
	InHours: 1,
	DateRange: 2,
} as const;

export default function ReminderFormView({ reminderTypes, onSubmitReminder }: ReminderFormViewProps) {
	const {
		register,
		handleSubmit,
		reset,
		control,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<ReminderAddDto>({
		resolver: zodResolver(ReminderAddDtoSchema),
		defaultValues: {
			Title: "",
			Description: "",
			Type: ReminderType.None,
			EndDate: null,
			EndTime: null,
		},
	});

	const selectedType = watch("Type");

	useEffect(() => {
		if (selectedType === ReminderType.None) {
			setValue("EndDate", null, {
				shouldValidate: true,
				shouldDirty: true,
			});

			setValue("EndTime", null, {
				shouldValidate: true,
				shouldDirty: true,
			});
		}

		if (selectedType === ReminderType.InHours) {
			setValue("EndDate", null, {
				shouldValidate: true,
				shouldDirty: true,
			});
		}
	}, [selectedType, setValue]);

	const normalizeTime = (time: string | null | undefined): string | null => {
		if (!time || time.trim() === "") return null;

		const trimmedTime = time.trim();

		if (/^\d{2}:\d{2}$/.test(trimmedTime)) {
			return `${trimmedTime}:00`;
		}

		if (/^\d{2}:\d{2}:\d{2}$/.test(trimmedTime)) {
			return trimmedTime;
		}

		return trimmedTime;
	};

	const onSubmit: SubmitHandler<ReminderAddDto> = async (data) => {
		try {
			const payload: ReminderAddDto = {
				Title: data.Title.trim(),
				Description: data.Description.trim(),
				Type: data.Type,
				EndDate: null,
				EndTime: null,
			};

			if (data.Type === ReminderType.InHours) {
				payload.EndDate = null;
				payload.EndTime = normalizeTime(data.EndTime);
			}

			if (data.Type === ReminderType.DateRange) {
				payload.EndDate = data.EndDate ?? null;
				payload.EndTime = normalizeTime(data.EndTime);
			}

			const result = await onSubmitReminder(payload);

			if (result) {
				reset({
					Title: "",
					Description: "",
					Type: ReminderType.None,
					EndDate: null,
					EndTime: null,
				});
			}
		} catch {
			Messenger.errorMessage("خطا در ثبت یادآور. لطفاً دوباره تلاش کنید.");
		}
	};

	const shouldShowTime = selectedType === ReminderType.InHours || selectedType === ReminderType.DateRange;

	const shouldShowDate = selectedType === ReminderType.DateRange;

	return (
		<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex h-full flex-col">
			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				<Input
					id="Title"
					label="عنوان یادآور"
					type="text"
					schema={ReminderAddDtoSchema}
					error={errors.Title?.message}
					placeholder="مثلاً: تماس با مشتری"
					autoComplete="off"
					{...register("Title")}
				/>

				<Textarea
					id="Description"
					label="توضیحات"
					schema={ReminderAddDtoSchema}
					error={errors.Description?.message}
					placeholder="توضیحات یادآور را وارد کنید"
					rows={3}
					textareaClassName="resize-none"
					{...register("Description")}
				/>

				<div>
					<Controller
						control={control}
						name="Type"
						render={({ field }) => (
							<Select
								label="نوع یادآوری"
								value={field.value || null}
								onValueChange={(value) => {
									field.onChange(Number(value ?? 0));
								}}
								options={reminderTypes.map((type) => ({
									label: type.Name,
									value: type.Id,
								}))}
								placeholder="انتخاب نوع یادآوری"
								clearable
								disabled={isSubmitting || reminderTypes.length === 0}
								schema={ReminderAddDtoSchema}
								error={errors.Type?.message}
							/>
						)}
					/>
				</div>

				{shouldShowTime && (
					<div className={`grid gap-4 ${shouldShowDate ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
						{shouldShowDate && (
							<div>
								<label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-600">
									<Calendar size={16} className="text-indigo-500" />
									تاریخ پایان
								</label>

								<PersianDatePicker<ReminderAddDto> control={control} name="EndDate" required />

								{errors.EndDate && (
									<p className="mt-1 text-xs text-rose-600">
										{errors.EndDate.message?.toString() || "انتخاب تاریخ الزامی است"}
									</p>
								)}
							</div>
						)}

						<div>
							<label
								htmlFor="EndTime"
								className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-600"
							>
								<Clock size={16} className="text-indigo-500" />
								{selectedType === ReminderType.InHours ? "زمان یادآوری" : "زمان پایان"}
							</label>

							<PersianTimePicker<ReminderAddDto> control={control} name="EndTime" required />

							{errors.EndTime && <p className="mt-1 text-xs text-rose-600">{errors.EndTime.message}</p>}
						</div>
					</div>
				)}

				{selectedType === ReminderType.None && (
					<div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-6 text-slate-500">
						در حالت «بدون یادآوری»، فقط عنوان و توضیحات ثبت می‌شود و زمان‌بندی برای آن ارسال نخواهد شد.
					</div>
				)}

				{selectedType === ReminderType.InHours && (
					<div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-xs leading-6 text-indigo-700">
						در این حالت، یادآوری برای امروز و در ساعت انتخاب‌شده ثبت می‌شود.
					</div>
				)}

				{selectedType === ReminderType.DateRange && (
					<div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-xs leading-6 text-indigo-700">
						در این حالت، یادآوری در تاریخ و ساعت مشخص‌شده ثبت می‌شود.
					</div>
				)}
			</div>

			<div className="border-t border-slate-100 p-4">
				<Button
					type="submit"
					disabled={isSubmitting}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
				>
					{isSubmitting ? (
						<>
							<LoaderCircle className="animate-spin" size={20} />
							<span>در حال ثبت...</span>
						</>
					) : (
						<>
							<Bell size={20} />
							<span>ثبت یادآور</span>
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
