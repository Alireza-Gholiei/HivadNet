import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import DynamicFieldInput from "@/components/Shared/DynamicFieldInput";
import {
	GuildGroupAddCustomerDto,
	GuildGroupAddCustomerFieldsColumnDto,
	GuildGroupAddCustomerFieldsDto,
	GuildGroupAddCustomerSchema,
} from "@/dataBinding/models/Guild/GuildGroup/GuildGroupAddCustomerDto";
import { GuildGroupGetFieldDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetFieldDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import { GuildGroupService } from "@/dataBinding/services/Guild/GuildGroupService";
import { GuildService } from "@/dataBinding/services/Guild/GuildService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Select } from "@/utilities/components/ui/select";
import { Messenger } from "@/utilities/Messenger";

export interface GuildSelectItemDto {
	Id: number;
	Name: string;
}

export interface GuildGroupSelectItemDto {
	Id: number;
	Name: string;
}

interface GuildGroupEditCustomerFormProps {
	customerId: number;
	onSuccess?: () => void;
	onClose: () => void;
}

export default function GuildGroupEditCustomerForm({
	customerId,
	onSuccess,
	onClose,
}: GuildGroupEditCustomerFormProps) {
	const [guildList, setGuildList] = useState<GuildSelectItemDto[]>([]);
	const [guildGroupList, setGuildGroupList] = useState<GuildGroupSelectItemDto[]>([]);
	const [selectedGuildId, setSelectedGuildId] = useState<number | null>(null);
	const [isLoadingFields, setIsLoadingFields] = useState<boolean>(false);

	const {
		register,
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<GuildGroupAddCustomerDto>({
		resolver: zodResolver(GuildGroupAddCustomerSchema),
		defaultValues: {
			CustomerId: customerId,
			GuildGroupId: 0,
			Field: [],
		},
	});

	const { fields, replace } = useFieldArray({
		control,
		name: "Field",
	});

	useEffect(() => {
		void fetchBaseData();
	}, []);

	const fetchBaseData = async () => {
		try {
			const guildListResult = await GuildService.GetCustomerGuildList(customerId);
			setGuildList(guildListResult ?? []);
		} catch {
			Messenger.errorMessage("خطا در دریافت اطلاعات پایه از سرور");
		}
	};

	const handleGuildChange = async (guildId: number | null) => {
		setSelectedGuildId(guildId);
		setGuildGroupList([]);
		replace([]);

		setValue("GuildGroupId", 0, {
			shouldValidate: true,
			shouldDirty: true,
		});

		if (!guildId) {
			return;
		}

		try {
			const guildGroupListResult = await GuildGroupService.GetCustomerGuildGroupList(guildId, customerId);
			setGuildGroupList(guildGroupListResult ?? []);
		} catch {
			Messenger.errorMessage("خطا در دریافت اطلاعات سامانه");
		}
	};

	const fetchGuildGroupFields = async (guildGroupId: number | null) => {
		if (!guildGroupId) {
			replace([]);
			return;
		}

		setIsLoadingFields(true);

		try {
			const fieldsResult = await GuildGroupService.GetField(guildGroupId);

			if (fieldsResult && fieldsResult.length > 0) {
				const mappedFields: GuildGroupAddCustomerFieldsDto[] = fieldsResult.map((f: GuildGroupGetFieldDto) => ({
					FieldName: f.FieldName,
					FieldId: f.Id,
					Value: "",
					DataType: f.DataType,
					IsRequired: f.IsRequired,
					Columns: f.Columns ?? [],
				}));

				replace(mappedFields);
			} else {
				replace([]);
			}

			const result = await CustomerService.GetGuildGroupDetail(customerId, guildGroupId);

			if (result) {
				reset({
					CustomerId: result.CustomerId,
					GuildGroupId: result.GuildGroupId,
					Field: result.Fields.map(
						(x) =>
							({
								FieldId: x.FieldId,
								FieldName: x.FieldName,
								DataType: x.DataType,
								IsRequired: x.IsRequired,
								Value: x.Value,
								Columns: x.Columns as GuildGroupAddCustomerFieldsColumnDto[],
							}) as GuildGroupAddCustomerFieldsDto,
					),
				});
			} else {
				Messenger.errorMessage("این مشتری عضو این سامانه نیست.");
				replace([]);
			}
		} catch {
			Messenger.errorMessage("خطا در دریافت فیلدهای سامانه");
		} finally {
			setIsLoadingFields(false);
		}
	};

	const onSubmit = async (data: GuildGroupAddCustomerDto) => {
		try {
			const payload: GuildGroupAddCustomerDto = {
				...data,
				Field: data.Field && data.Field.length > 0 ? data.Field : null,
			};

			const result = await GuildGroupService.EditCustomer(payload);

			if (result) {
				Messenger.successAlert("مشتری با موفقیت به سامانه افزوده شد.");
				if (onSuccess) onSuccess();
				onClose();
			} else {
				Messenger.errorMessage("خطا در ثبت اطلاعات.");
			}
		} catch {
			Messenger.errorMessage("ارتباط با سرور برقرار نشد.");
		}
	};

	return (
		<PageCard>
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex w-full flex-col gap-6" dir="rtl">
				<PageCardContent>
					<h3 className="mb-4 border-b pb-2 text-sm font-bold text-slate-800">انتخاب سامانه</h3>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Select
							label="سامانه"
							value={selectedGuildId}
							onValueChange={(value) => void handleGuildChange(value)}
							placeholder="انتخاب سامانه"
							searchPlaceholder="جستجوی سامانه..."
							clearable
							options={guildList.map((x) => ({
								label: x.Name,
								value: x.Id,
							}))}
							labelClassName="mb-1 block text-xs font-medium text-slate-700"
							triggerClassName="border-slate-300 bg-white py-3 pl-10 pr-11 text-sm text-slate-700 shadow-sm hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
						/>

						<Controller
							control={control}
							name="GuildGroupId"
							render={({ field }) => (
								<Select
									label="گروه سامانه"
									name={field.name}
									value={field.value || null}
									onValueChange={(value) => {
										field.onChange(value ?? 0);
										void fetchGuildGroupFields(value);
									}}
									onBlur={field.onBlur}
									placeholder="انتخاب گروه سامانه"
									searchPlaceholder="جستجوی گروه سامانه..."
									clearable
									schema={GuildGroupAddCustomerSchema}
									error={errors.GuildGroupId?.message}
									options={guildGroupList.map((x) => ({
										label: x.Name,
										value: x.Id,
									}))}
									labelClassName="mb-1 block text-xs font-medium text-slate-700"
									triggerClassName="border-slate-300 bg-white py-3 pl-10 pr-11 text-sm text-slate-700 shadow-sm hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
								/>
							)}
						/>
					</div>

					{fields.length > 0 && (
						<div className="mt-2 rounded-lg border border-slate-200 p-4">
							<h3 className="mb-4 border-b pb-2 text-sm font-bold text-slate-800">
								فیلدهای اختصاصی سامانه
							</h3>

							{isLoadingFields ? (
								<p className="text-sm text-slate-500">در حال دریافت فیلدها...</p>
							) : (
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									{fields.map((field, index) => (
										<DynamicFieldInput
											key={field.id}
											field={(field as unknown as GuildGroupAddCustomerFieldsDto) ?? []}
											index={index}
											register={register}
											setValue={setValue}
											control={control as any}
											error={errors.Field?.[index]?.Value}
										/>
									))}
								</div>
							)}
						</div>
					)}
				</PageCardContent>

				<PageCardFooter className="flex items-center justify-end gap-3 border-t pt-4">
					<Button type="button" onClick={onClose} disabled={isSubmitting} variant="secondary">
						انصراف
					</Button>

					<Button type="submit" disabled={isSubmitting} variant="submit">
						{isSubmitting ? "در حال ثبت..." : "ثبت اطلاعات"}
					</Button>
				</PageCardFooter>
			</form>
		</PageCard>
	);
}
