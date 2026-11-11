"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Database, FileText, Loader2, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
	GuildEditDto,
	GuildEditFieldColumnSchema,
	GuildEditFieldSchema,
	GuildEditSchema,
} from "@/dataBinding/models/Guild/GuildEditDto";
import { GuildGroupGetFieldTypesDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetFieldTypesDto";
import { GuildGroupService } from "@/dataBinding/services/Guild/GuildGroupService";
import { GuildService } from "@/dataBinding/services/Guild/GuildService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";

import GuildFieldRow from "./GuildFieldRowForm";
import { Input } from "@/utilities/components/ui/input";
import { Textarea } from "@/utilities/components/ui/textarea";

interface GuildEditFormProps {
	guildId: number;
	onClose?: () => void;
	onSuccess?: () => void;
}

export default function GuildEditForm({ guildId, onClose, onSuccess }: GuildEditFormProps) {
	const [isLoading, setIsLoading] = useState(true);

	const [fieldTypes, setFieldTypes] = useState<GuildGroupGetFieldTypesDto[]>([]);

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<GuildEditDto>({
		resolver: zodResolver(GuildEditSchema),
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "Fields",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [data, fetchedFieldTypes] = await Promise.all([
					GuildService.GetById(guildId),
					GuildGroupService.GetFieldTypes(),
				]);

				setFieldTypes(fetchedFieldTypes || []);

				reset({
					Id: data.Id,
					Name: data.Name,
					Description: data.Description,
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

		if (guildId) {
			void fetchData();
		}
	}, [guildId, reset]);

	const handleAddField = () => {
		append({
			Id: 0,
			FieldName: "",
			DataType: fieldTypes[0]?.Id || 1,
			IsRequired: true,
			Columns: [],
		});
	};

	const onSubmit = async (data: GuildEditDto) => {
		try {
			const payload = { ...data };

			if (!payload.Fields || payload.Fields.length === 0) {
				payload.Fields = null;
			}

			const result = await GuildService.Edit(payload);

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
					<div className="space-y-5">
						<Input
							label="نام سامانه"
							schema={GuildEditSchema}
							error={errors.Name?.message}
							icon={<Briefcase className="h-5 w-5" />}
							placeholder="مثال: سامانه مالیات"
							{...register("Name")}
						/>

						<Textarea
							label="توضیحات"
							schema={GuildEditSchema}
							error={errors.Description?.message}
							icon={<FileText className="h-5 w-5" />}
							placeholder="توضیحات مربوط به سامانه..."
							rows={3}
							textareaClassName="resize-none bg-slate-50 focus:bg-white"
							{...register("Description")}
						/>
					</div>

					<div className="border border-slate-200 rounded-xl overflow-hidden bg-white mt-3">
						<div className="p-4 border-b border-slate-200 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Database className="w-5 h-5 text-indigo-600" />
								<span className="text-sm font-semibold text-slate-700">فیلدهای سامانه</span>
							</div>

							<Button
								size="sm"
								type="button"
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
										errors={errors}
										schema={GuildEditFieldSchema}
										columnsSchema={GuildEditFieldColumnSchema}
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
					<Button
						type="submit"
						disabled={isSubmitting}
						variant="submit"
						className="flex-1 flex items-center justify-center gap-2"
					>
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
