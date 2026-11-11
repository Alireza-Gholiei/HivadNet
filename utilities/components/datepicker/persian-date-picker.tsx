"use client";

import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Control, Controller, FieldValues, Path, RegisterOptions } from "react-hook-form";
import DatePicker from "react-multi-date-picker";

const toEnglishDigits = (value: string) => value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));

interface PersianDatePickerProps<TFieldValues extends FieldValues> {
	control: Control<TFieldValues>;
	name: Path<TFieldValues>;
	label?: string;
	rules?: Omit<
		RegisterOptions<TFieldValues, Path<TFieldValues>>,
		"valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
	>;
	required?: boolean;
	returnAsString?: boolean;
}

export default function PersianDatePicker<TFieldValues extends FieldValues>({
	control,
	name,
	label,
	rules,
	required = false,
	returnAsString = false,
}: PersianDatePickerProps<TFieldValues>) {
	return (
		<Controller
			control={control}
			name={name}
			rules={{ ...rules, required: required }}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<div className="flex flex-col w-full">
					{label && (
						<label className="block text-xs font-medium mb-2">
							{label}
							{required && <span className="text-red-500 mr-1">*</span>}
						</label>
					)}

					<DatePicker
						placeholder="تاریخ را انتخاب کنید"
						style={{
							width: "100%",
							boxSizing: "border-box",
						}}
						containerStyle={{
							width: "100%",
						}}
						value={value || ""}
						onChange={(date) => {
							if (date?.isValid) {
								if (returnAsString) {
									onChange(toEnglishDigits(date.format("YYYY/MM/DD")));
									return;
								}

								const jsDate = date.toUTC().toDate();
								jsDate.setHours(12);
								jsDate.setMinutes(0);
								jsDate.setSeconds(0);
								onChange(jsDate);
							} else {
								onChange(null);
							}
						}}
						format="YYYY/MM/DD"
						calendar={persian}
						locale={persian_fa}
						showOtherDays
						monthYearSeparator="|"
						// portal
						calendarPosition="bottom-right"
						inputClass={`w-full px-4 py-2 rounded-lg border-2 text-sm ${
							error ? "border-red-500" : "border-gray-200"
						}`}
						mapDays={({ date }) => {
							const props = {} as React.HTMLAttributes<HTMLDivElement>;
							const isWeekend = [6].includes(date.weekDay.index);

							if (isWeekend) props.className = "highlight highlight-red";

							return props;
						}}
					/>

					{error && <p className="text-red-500 text-xs mt-1">{error.message || "این فیلد الزامی است"}</p>}
				</div>
			)}
		/>
	);
}
