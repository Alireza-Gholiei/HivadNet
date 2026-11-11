import { Columns3, List, Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, UseFormRegister, useWatch } from "react-hook-form";

import { GuildGroupGetFieldTypesDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetFieldTypesDto";
import { Button } from "@/utilities/components/ui/button";
import { Input } from "@/utilities/components/ui/input";
import { Select } from "@/utilities/components/ui/select";
import z from "zod";
import { Checkbox } from "@/utilities/components/ui/checkbox";

interface GuildFieldRowProps {
	index: number;
	control: any;
	register: UseFormRegister<any>;
	errors: any;
	schema: z.ZodObject<z.ZodRawShape>;
	columnsSchema: z.ZodObject<z.ZodRawShape>;
	fieldTypes: GuildGroupGetFieldTypesDto[];
	isLoadingData: boolean;
	onRemove: () => void;
}

export default function GuildFieldRow({
	index,
	control,
	register,
	errors,
	schema,
	columnsSchema,
	fieldTypes,
	isLoadingData,
	onRemove,
}: GuildFieldRowProps) {
	const selectedDataType = useWatch({
		control,
		name: `Fields.${index}.DataType` as const,
	});

	const isListField = Number(selectedDataType) === 5;

	const {
		fields: columns,
		append: appendColumn,
		remove: removeColumn,
	} = useFieldArray({
		control,
		name: `Fields.${index}.Columns` as any,
	});

	const handleAddColumn = () => {
		appendColumn({
			Key: "",
			Title: "",
			DataType: fieldTypes[0]?.Id || 1,
			IsRequired: true,
		});
	};

	const fieldTypeOptions = fieldTypes.map((type) => ({
		label: type.Name,
		value: type.Id,
	}));

	const columnFieldTypeOptions = fieldTypes
		.filter((type) => Number(type.Id) !== 5)
		.map((type) => ({
			label: type.Name,
			value: type.Id,
		}));

	return (
		<div className="p-4 border border-slate-200 bg-white rounded-xl shadow-sm animate-in fade-in space-y-4">
			<div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
				<div className="w-full sm:flex-1">
					<Input
						label="نام فیلد"
						error={errors.Fields?.[index]?.FieldName?.message}
						type="text"
						schema={schema}
						placeholder="مثال: کد کارگاهی"
						{...register(`Fields.${index}.FieldName` as const)}
					/>
				</div>

				<div className="w-full sm:w-1/4">
					<Controller
						control={control}
						name={`Fields.${index}.DataType` as const}
						render={({ field }) => (
							<Select
								label="نوع داده"
								name={field.name}
								value={field.value || null}
								onValueChange={(value) => field.onChange(value ?? 0)}
								onBlur={field.onBlur}
								schema={schema}
								placeholder={isLoadingData ? "در حال بارگذاری..." : "انتخاب نوع داده"}
								searchPlaceholder="جستجوی نوع داده..."
								clearable
								disabled={isLoadingData}
								error={errors.Fields?.[index]?.DataType?.message}
								options={fieldTypeOptions}
								labelClassName="mb-1.5 block text-sm font-semibold text-slate-700"
								triggerClassName="border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 hover:border-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:opacity-60"
							/>
						)}
					/>
				</div>

				<div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-5 mb-2 sm:mb-0">
					<Checkbox
						label="اجباری"
						schema={schema}
						error={errors.Fields?.[index]?.IsRequired?.message}
						containerClassName="mt-[1.6rem]"
						checkboxClassName="border-slate-300 peer-checked:border-indigo-600 peer-checked:bg-indigo-600"
						{...register(`Fields.${index}.IsRequired` as const)}
					/>

					<Button
						type="button"
						size="sm"
						variant="outline"
						onClick={onRemove}
						className="text-rose-500 hover:text-white border border-rose-200 hover:bg-rose-500 hover:border-rose-500 p-2 rounded-lg transition-all mt-[1.6rem]"
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{errors.Fields?.[index]?.IsRequired && (
				<p className="text-rose-500 text-sm mt-1.5 font-medium w-full">
					{errors.Fields[index]?.IsRequired?.message}
				</p>
			)}

			{isListField && (
				<div className="border border-indigo-100 bg-indigo-50/40 rounded-xl overflow-hidden">
					<div className="px-4 py-3 border-b border-indigo-100 flex items-center justify-between gap-3">
						<div className="flex items-center gap-2">
							<List className="w-4 h-4 text-indigo-600" />
							<span className="text-sm font-bold text-indigo-700">ستون‌های فیلد لیستی</span>
						</div>

						<Button
							type="button"
							size="sm"
							onClick={handleAddColumn}
							className="bg-white border border-indigo-100 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
						>
							<Plus className="w-4 h-4" />
							افزودن ستون
						</Button>
					</div>

					<div className="p-4 space-y-3">
						{columns.length === 0 ? (
							<div className="text-center py-5 text-sm text-slate-500 font-medium border-2 border-dashed border-indigo-100 bg-white rounded-xl">
								برای این فیلد لیستی هنوز ستونی تعریف نشده است.
							</div>
						) : (
							columns.map((column, columnIndex) => (
								<div
									key={column.id}
									className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-white border border-slate-200 rounded-xl p-3"
								>
									<div className="md:col-span-3">
										<Input
											label="کلید ستون"
											error={errors.Fields?.[index]?.Columns?.[columnIndex]?.Key?.message}
											type="text"
											schema={columnsSchema}
											placeholder="مثال: NationalCode"
											containerClassName="md:col-span-3"
											inputClassName="rounded-lg py-2 text-sm"
											{...register(`Fields.${index}.Columns.${columnIndex}.Key` as any)}
										/>
									</div>

									<div className="md:col-span-3">
										<Input
											label="عنوان ستون"
											error={errors.Fields?.[index]?.Columns?.[columnIndex]?.Title?.message}
											type="text"
											schema={columnsSchema}
											placeholder="مثال: کد ملی"
											containerClassName="md:col-span-3"
											inputClassName="rounded-lg py-2 text-sm"
											{...register(`Fields.${index}.Columns.${columnIndex}.Title` as any)}
										/>
									</div>

									<div className="md:col-span-3">
										<Controller
											control={control}
											name={`Fields.${index}.Columns.${columnIndex}.DataType` as any}
											render={({ field }) => (
												<Select
													label="نوع داده ستون"
													name={field.name}
													value={field.value || null}
													onValueChange={(value) => field.onChange(value ?? 0)}
													onBlur={field.onBlur}
													placeholder={
														isLoadingData ? "در حال بارگذاری..." : "انتخاب نوع داده"
													}
													schema={columnsSchema}
													searchPlaceholder="جستجوی نوع داده..."
													clearable
													disabled={isLoadingData}
													error={
														errors.Fields?.[index]?.Columns?.[columnIndex]?.DataType
															?.message
													}
													options={columnFieldTypeOptions}
													labelClassName="mb-1.5 block text-xs font-semibold text-slate-700"
													triggerClassName="border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 hover:border-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
												/>
											)}
										/>
									</div>

									<div className="md:col-span-2 flex items-center pb-2">
										<Checkbox
											label="اجباری"
											schema={columnsSchema}
											containerClassName="mt-[1.55rem]"
											error={errors.Fields?.[index]?.Columns?.[columnIndex]?.IsRequired?.message}
											checkboxClassName="border-slate-300 peer-checked:border-indigo-600 peer-checked:bg-indigo-600"
											{...register(`Fields.${index}.Columns.${columnIndex}.IsRequired` as any)}
										/>
									</div>

									<div className="md:col-span-1 flex justify-end">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => removeColumn(columnIndex)}
											className="text-rose-500 hover:text-white border border-rose-200 hover:bg-rose-500 hover:border-rose-500 p-2 rounded-lg transition-all"
											title="حذف ستون"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							))
						)}

						{errors.Fields?.[index]?.Columns?.message && (
							<p className="text-rose-500 text-sm font-medium">
								{errors.Fields?.[index]?.Columns?.message}
							</p>
						)}

						<div className="flex items-start gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2">
							<Columns3 className="w-4 h-4 text-slate-400 mt-0.5" />
							<div>
								<p className="font-semibold text-slate-600 mb-1">راهنمای تعریف ستون</p>
								<p>
									کلید ستون بهتر است انگلیسی و بدون فاصله باشد، مثل:
									<span className="font-mono text-indigo-600 mx-1">NationalCode</span>
									یا
									<span className="font-mono text-indigo-600 mx-1">Amount</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
