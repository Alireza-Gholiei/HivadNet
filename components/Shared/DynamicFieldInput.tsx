import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Control, Controller, UseFormRegister, UseFormSetValue } from "react-hook-form";

import { Button } from "@/utilities/components/ui/button";
import PersianDatePicker from "@/utilities/components/datepicker/persian-date-picker";

export interface FieldListColumnDto {
	Key: string;
	Title: string;
	DataType: number;
	IsRequired: boolean;
}

export interface FieldDto {
	FieldName: string;
	FieldId: number;
	Value: string | null;
	DataType: number;
	IsRequired: boolean;
	Columns?: FieldListColumnDto[] | null;
}

type DynamicListRow = Record<string, any>;

function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
	if (!value) return fallback;

	try {
		return JSON.parse(value) as T;
	} catch {
		return fallback;
	}
}

interface DynamicFieldInputProps {
	field: FieldDto;
	index: number;
	register: UseFormRegister<any>;
	control: Control<any>;
	setValue: UseFormSetValue<any>;
	error?: any;
	arrayName?: string;
}

export default function DynamicFieldInput({
	field,
	index,
	register,
	setValue,
	control,
	error,
	arrayName = "Field",
}: DynamicFieldInputProps) {
	const commonClasses =
		"w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";

	const isCheckbox = field.DataType === 4;

	const fieldPath = `${arrayName}.${index}.Value`;

	const renderInput = () => {
		switch (field.DataType) {
			case 2:
				return (
					<input
						type="number"
						{...register(fieldPath, {
							setValueAs: (v) => (v === "" ? null : parseFloat(v)),
						})}
						onKeyDown={(e) => {
							if (["e", "E", "+", "-", "."].includes(e.key)) {
								e.preventDefault();
							}
						}}
						className={commonClasses}
					/>
				);

			case 3:
				return <PersianDatePicker<any> control={control} name={fieldPath} required returnAsString />;
			case 4:
				return (
					<Controller
						name={fieldPath}
						control={control}
						render={({ field }) => (
							<input
								type="checkbox"
								checked={field.value === "true"}
								onChange={(e) => field.onChange(e.target.checked ? "true" : "false")}
								className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
							/>
						)}
					/>
				);

			case 5:
				return <DynamicListField field={field} fieldPath={fieldPath} register={register} setValue={setValue} />;

			case 1:
			default:
				return <input type="text" {...register(fieldPath)} className={commonClasses} />;
		}
	};

	return (
		<div className={isCheckbox ? "flex items-center gap-2 mt-5" : "w-full"}>
			{!isCheckbox && (
				<label className="block text-xs font-medium text-slate-700 mb-1">
					{field.FieldName}
					{field.IsRequired && <span className="text-rose-500 mr-1">*</span>}
				</label>
			)}

			{renderInput()}

			{isCheckbox && (
				<label className="text-sm font-medium text-slate-700 cursor-pointer">
					{field.FieldName}
					{field.IsRequired && <span className="text-rose-500 mr-1">*</span>}
				</label>
			)}

			{error && <p className="text-rose-500 text-sm font-medium mt-1 w-full">{error.message}</p>}
		</div>
	);
}

interface DynamicListFieldProps {
	field: FieldDto;
	fieldPath: string;
	register: UseFormRegister<any>;
	setValue?: UseFormSetValue<any>;
}

function DynamicListField({ field, fieldPath, register, setValue }: DynamicListFieldProps) {
	const columns = useMemo<FieldListColumnDto[]>(() => {
		return field.Columns && Array.isArray(field.Columns) ? field.Columns : [];
	}, [field.Columns]);

	const [rows, setRows] = useState<DynamicListRow[]>(() => {
		const parsedRows = safeJsonParse<DynamicListRow[]>(field.Value, []);

		if (Array.isArray(parsedRows)) {
			return parsedRows;
		}

		return [];
	});

	useEffect(() => {
		if (!setValue) return;

		setValue(fieldPath, JSON.stringify(rows), {
			shouldValidate: true,
			shouldDirty: true,
		});
	}, [rows, fieldPath, setValue]);

	const createEmptyRow = (): DynamicListRow => {
		const emptyRow: DynamicListRow = {};

		columns.forEach((column) => {
			switch (Number(column.DataType)) {
				case 2:
					emptyRow[column.Key] = null;
					break;

				case 4:
					emptyRow[column.Key] = false;
					break;

				case 1:
				case 3:
				default:
					emptyRow[column.Key] = "";
					break;
			}
		});

		return emptyRow;
	};

	const handleAddRow = () => {
		setRows((prev) => [...prev, createEmptyRow()]);
	};

	const handleRemoveRow = (rowIndex: number) => {
		setRows((prev) => prev.filter((_, index) => index !== rowIndex));
	};

	const handleCellChange = (rowIndex: number, columnKey: string, value: any) => {
		setRows((prev) =>
			prev.map((row, index) => {
				if (index !== rowIndex) return row;

				return {
					...row,
					[columnKey]: value,
				};
			}),
		);
	};

	const renderCellInput = (row: DynamicListRow, rowIndex: number, column: FieldListColumnDto) => {
		const value = row[column.Key];

		switch (Number(column.DataType)) {
			case 2:
				return (
					<input
						type="number"
						value={value ?? ""}
						onChange={(e) => {
							const inputValue = e.target.value;
							handleCellChange(rowIndex, column.Key, inputValue === "" ? null : Number(inputValue));
						}}
						onKeyDown={(e) => {
							if (["e", "E", "+", "-", "."].includes(e.key)) {
								e.preventDefault();
							}
						}}
						className="w-full min-w-32.5 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				);

			case 3:
				return (
					<input
						type="date"
						value={value ?? ""}
						onChange={(e) => handleCellChange(rowIndex, column.Key, e.target.value)}
						className="w-full min-w-36.25 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				);

			case 4:
				return (
					<div className="flex items-center justify-center h-9.5">
						<input
							type="checkbox"
							checked={Boolean(value)}
							onChange={(e) => handleCellChange(rowIndex, column.Key, e.target.checked)}
							className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
						/>
					</div>
				);

			case 1:
			default:
				return (
					<input
						type="text"
						value={value ?? ""}
						onChange={(e) => handleCellChange(rowIndex, column.Key, e.target.value)}
						className="w-full min-w-37.5 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				);
		}
	};

	if (!columns.length) {
		return (
			<div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
				برای این فیلد لیستی هیچ ستونی تعریف نشده است.
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<input type="hidden" {...register(fieldPath)} />

			<div className="flex items-center justify-between gap-3">
				<div className="text-xs text-slate-500">
					تعداد ردیف‌ها: <span className="font-bold text-slate-700">{rows.length}</span>
				</div>

				<Button
					type="button"
					variant="outline"
					onClick={handleAddRow}
					className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
				>
					<Plus className="w-4 h-4" />
					افزودن ردیف
				</Button>
			</div>

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
									{column.IsRequired && <span className="text-rose-500 mr-1">*</span>}
								</th>
							))}

							<th className="w-16 border-b border-slate-200 px-3 py-2 text-center text-xs font-bold text-slate-600">
								حذف
							</th>
						</tr>
					</thead>

					<tbody>
						{rows.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length + 2}
									className="px-4 py-6 text-center text-sm text-slate-400"
								>
									هنوز ردیفی ثبت نشده است.
								</td>
							</tr>
						) : (
							rows.map((row, rowIndex) => (
								<tr key={rowIndex} className="border-t border-slate-100">
									<td className="px-3 py-2 text-center text-xs font-bold text-slate-500">
										{rowIndex + 1}
									</td>

									{columns.map((column) => (
										<td key={column.Key} className="px-3 py-2 align-top">
											{renderCellInput(row, rowIndex, column)}
										</td>
									))}

									<td className="px-3 py-2 text-center align-top">
										<Button
											variant="outline"
											type="button"
											onClick={() => handleRemoveRow(rowIndex)}
											className="inline-flex items-center justify-center rounded-lg border border-rose-200 p-2 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
											title="حذف ردیف"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
