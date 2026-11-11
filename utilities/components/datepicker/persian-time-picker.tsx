"use client";

import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Control, Controller, FieldValues, Path, RegisterOptions } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

interface PersianTimePickerProps<TFieldValues extends FieldValues> {
	control: Control<TFieldValues>;
	name: Path<TFieldValues>;
	label?: string;
	rules?: Omit<
		RegisterOptions<TFieldValues, Path<TFieldValues>>,
		"valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
	>;
	required?: boolean;
}

export default function PersianTimePicker<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	rules,
	required = false,
}: PersianTimePickerProps<TFieldValues>) {
	const parseStringToDateObject = (timeStr?: string | null) => {
		if (!timeStr) return null;

		const parts = timeStr.split(":");
		if (parts.length < 2) return null;

		const hour = Number(parts[0]);
		const minute = Number(parts[1]);
		const second = Number(parts[2] ?? 0);

		if (Number.isNaN(hour) || Number.isNaN(minute) || Number.isNaN(second)) {
			return null;
		}

		const dateObj = new DateObject({
			calendar: persian,
			locale: persian_fa,
		});

		dateObj.setHour(hour);
		dateObj.setMinute(minute);
		dateObj.setSecond(second);

		return dateObj;
	};

	return (
		<Controller
			control={control}
			name={name}
			rules={{ ...rules, required: required }}
			render={({ field: { onChange, value }, fieldState: { error } }) => {
				return (
					<div className="flex flex-col w-full">
						{label && (
							<label className="block text-xs font-medium mb-2">
								{label}
								{required && <span className="text-red-500 mr-1">*</span>}
							</label>
						)}

						<DatePicker
							disableDayPicker
							format="HH:mm:ss"
							placeholder="ساعت را انتخاب کنید"
							style={{
								width: "100%",
								boxSizing: "border-box",
							}}
							containerStyle={{
								width: "100%",
							}}
							value={parseStringToDateObject(value)}
							onChange={(date) => {
								if (date && !Array.isArray(date) && date.isValid) {
									onChange(date.format("HH:mm:ss"));
								} else {
									onChange(null);
								}
							}}
							calendar={persian}
							// portal
							calendarPosition="bottom-right"
							inputClass={`w-full px-4 py-2 rounded-lg border-2 text-sm ${
								error ? "border-red-500" : "border-gray-200"
							}`}
							plugins={[<TimePicker key={`${name}-${value}`} />]}
						/>

						{error && <p className="text-red-500 text-xs mt-1">{error.message || "این فیلد الزامی است"}</p>}
					</div>
				);
			}}
		/>
	);
}
