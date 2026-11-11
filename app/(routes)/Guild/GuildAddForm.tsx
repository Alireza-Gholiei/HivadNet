"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Database, FileText, Loader2, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
	GuildAddDto,
	GuildAddFieldColumnSchema,
	GuildAddFieldSchema,
	GuildAddFieldsDto,
	GuildAddSchema,
} from "@/dataBinding/models/Guild/GuildAddDto";
import { GuildGroupService } from "@/dataBinding/services/Guild/GuildGroupService";
import { GuildService } from "@/dataBinding/services/Guild/GuildService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";

import GuildFieldRow from "./GuildFieldRowForm";
import { Input } from "@/utilities/components/ui/input";
import { Textarea } from "@/utilities/components/ui/textarea";

interface GuildAddFormProps {
	onClose: () => void;
	onSuccess: () => void;
}

interface GuildGroupGetFieldTypesDto {
	Id: number;
	Name: string;
}

export default function GuildAddForm({ onClose, onSuccess }: GuildAddFormProps) {
	const [fieldTypes, setFieldTypes] = useState<GuildGroupGetFieldTypesDto[]>([]);
	const [isLoadingData, setIsLoadingData] = useState(true);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<GuildAddDto>({
		resolver: zodResolver(GuildAddSchema),
		defaultValues: {
			Name: "",
			Description: "",
			Fields: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "Fields",
	});

	useEffect(() => {
		void fetchBaseData();
	}, []);

	const fetchBaseData = async () => {
		try {
			setIsLoadingData(true);

			const fieldsResult = await GuildGroupService.GetFieldTypes();

			setFieldTypes(
				Array.isArray(fieldsResult)
					? fieldsResult
					: (fieldsResult as { Data?: GuildGroupGetFieldTypesDto[] }).Data || [],
			);
		} catch {
			Messenger.errorMessage("خطا در دریافت اطلاعات پایه از سرور");
		} finally {
			setIsLoadingData(false);
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

	const onSubmit = async (data: GuildAddDto) => {
		try {
			const normalizedFields =
				data.Fields && data.Fields.length > 0
					? data.Fields.map((field: GuildAddFieldsDto) => ({
							...field,
							Columns:
								Number(field.DataType) === 5 && field.Columns && field.Columns.length > 0
									? field.Columns.map((column) => ({
											Key: column.Key,
											Title: column.Title,
											DataType: Number(column.DataType),
											IsRequired: Boolean(column.IsRequired),
										}))
									: null,
						}))
					: null;

			const payload = {
				...data,
				Fields: normalizedFields,
			};

			const result = await GuildService.Add(payload);

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
						<Input
							label="نام سامانه"
							schema={GuildAddSchema}
							error={errors.Name?.message}
							icon={<Briefcase className="h-5 w-5" />}
							placeholder="مثال: سامانه مالیات"
							{...register("Name")}
						/>

						<Textarea
							label="توضیحات"
							schema={GuildAddSchema}
							error={errors.Description?.message}
							icon={<FileText className="h-5 w-5" />}
							placeholder="توضیحات مربوط به سامانه..."
							rows={3}
							textareaClassName="resize-none bg-slate-50 focus:bg-white"
							{...register("Description")}
						/>
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
										register={register}
										schema={GuildAddFieldSchema}
										columnsSchema={GuildAddFieldColumnSchema}
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
					<Button type="button" onClick={onClose} variant="secondary">
						انصراف
					</Button>

					<Button
						type="submit"
						disabled={isSubmitting}
						variant="submit"
						className="flex-1 flex items-center justify-center gap-2"
					>
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
