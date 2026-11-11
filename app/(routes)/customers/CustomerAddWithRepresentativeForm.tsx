import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
	CustomerAddWithRepresentativeDto,
	CustomerAddWithRepresentativeSchema,
} from "@/dataBinding/models/Customer/CustomerAddWithRepresentativeDto";
import { GuildGetListDto } from "@/dataBinding/models/Guild/GuildGetListDto";
import { GuildGroupGetListDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetListDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import { GuildGroupService } from "@/dataBinding/services/Guild/GuildGroupService";
import { GuildService } from "@/dataBinding/services/Guild/GuildService";
import { Button } from "@/utilities/components/ui/button";
import { Input } from "@/utilities/components/ui/input";
import { Select } from "@/utilities/components/ui/select";
import { Messenger } from "@/utilities/Messenger";

interface CustomerAddWithRepresentativeFormProps {
	onSuccess: () => void;
	onCancel: () => void;
}

export default function CustomerAddWithRepresentativeForm({
	onSuccess,
	onCancel,
}: CustomerAddWithRepresentativeFormProps) {
	const [guildList, setGuildList] = useState<GuildGetListDto[]>([]);
	const [guildGroupList, setGuildGroupList] = useState<GuildGroupGetListDto[]>([]);
	const [selectedGuildId, setSelectedGuildId] = useState<number | null>(null);

	const {
		register,
		control,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<CustomerAddWithRepresentativeDto>({
		resolver: zodResolver(CustomerAddWithRepresentativeSchema),
		defaultValues: {
			MainCustomer: {
				FirstName: "",
				LastName: "",
				NationalCode: "",
				PhoneNumber: "",
			},
		},
	});

	useEffect(() => {
		void fetchBaseData();
	}, []);

	const fetchBaseData = async () => {
		try {
			const guildListResult = await GuildService.GetList();

			setGuildList(guildListResult ?? []);
		} catch {
			Messenger.errorMessage("خطا در دریافت اطلاعات پایه از سرور");
		}
	};

	const fetchGuildGroupData = async (guildId: number) => {
		try {
			setGuildGroupList([]);

			if (!guildId) {
				return;
			}

			const guildGroupListResult = await GuildGroupService.GetList(guildId);

			setGuildGroupList(guildGroupListResult ?? []);
		} catch {
			Messenger.errorMessage("خطا در دریافت اطلاعات پایه از سرور");
		}
	};

	const handleGuildChange = (guildId: number | null) => {
		setSelectedGuildId(guildId);
		setGuildGroupList([]);

		setValue("GuildGroupId", 0, {
			shouldValidate: true,
			shouldDirty: true,
		});

		if (guildId) {
			void fetchGuildGroupData(guildId);
		}
	};

	const onSubmit = async (data: CustomerAddWithRepresentativeDto) => {
		try {
			const result = await CustomerService.AddWithRepresentative(data);

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
		<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex w-full flex-col gap-6" dir="rtl">
			<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
				<h3 className="mb-4 border-b pb-2 text-sm font-bold text-slate-800">اطلاعات مشتری اصلی</h3>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Input
						label="نام"
						schema={CustomerAddWithRepresentativeSchema}
						error={errors.MainCustomer?.FirstName?.message}
						type="text"
						{...register("MainCustomer.FirstName")}
					/>

					<Input
						label="نام خانوادگی"
						schema={CustomerAddWithRepresentativeSchema}
						error={errors.MainCustomer?.LastName?.message}
						type="text"
						{...register("MainCustomer.LastName")}
					/>

					<Input
						label="کد ملی"
						schema={CustomerAddWithRepresentativeSchema}
						error={errors.MainCustomer?.NationalCode?.message}
						type="text"
						dir="ltr"
						inputMode="numeric"
						{...register("MainCustomer.NationalCode")}
					/>

					<Input
						label="شماره تماس"
						schema={CustomerAddWithRepresentativeSchema}
						error={errors.MainCustomer?.PhoneNumber?.message}
						type="text"
						dir="ltr"
						inputMode="tel"
						{...register("MainCustomer.PhoneNumber")}
					/>

					<Input
						label="شغل"
						schema={CustomerAddWithRepresentativeSchema}
						error={errors.MainCustomer?.Job?.message}
						type="text"
						{...register("MainCustomer.Job")}
					/>

					<Input
						label="آدرس"
						schema={CustomerAddWithRepresentativeSchema}
						error={errors.MainCustomer?.Address?.message}
						type="text"
						{...register("MainCustomer.Address")}
					/>
				</div>
			</div>

			<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
				<h3 className="mb-4 border-b pb-2 text-sm font-bold text-slate-800">اطلاعات سامانه</h3>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Select
						label="سامانه"
						value={selectedGuildId}
						onValueChange={handleGuildChange}
						placeholder="انتخاب سامانه"
						searchPlaceholder="جستجوی سامانه..."
						clearable
						options={guildList.map((x) => ({
							label: x.Name,
							value: x.Id,
						}))}
						labelClassName="mb-1 block text-xs font-medium text-slate-700"
						triggerClassName="border-slate-300 py-3 pl-10 pr-11 shadow-sm hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
					/>

					<Controller
						control={control}
						name="GuildGroupId"
						render={({ field }) => (
							<Select
								label="گروه سامانه"
								name={field.name}
								value={field.value || null}
								onValueChange={(value) => field.onChange(value ?? 0)}
								onBlur={field.onBlur}
								placeholder="انتخاب گروه سامانه"
								searchPlaceholder="جستجوی گروه سامانه..."
								clearable
								schema={CustomerAddWithRepresentativeSchema}
								error={errors.GuildGroupId?.message}
								options={guildGroupList.map((x) => ({
									label: x.Name,
									value: x.Id,
								}))}
								labelClassName="mb-1 block text-xs font-medium text-slate-700"
								triggerClassName="border-slate-300 py-3 pl-10 pr-11 shadow-sm hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
							/>
						)}
					/>
				</div>
			</div>

			<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
				<h3 className="mb-4 border-b pb-2 text-sm font-bold text-slate-800">اطلاعات نماینده</h3>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Input
						label="نام"
						schema={CustomerAddWithRepresentativeSchema}
						error={errors.FirstName?.message}
						type="text"
						{...register("FirstName")}
					/>

					<Input
						label="نام خانوادگی"
						schema={CustomerAddWithRepresentativeSchema}
						error={errors.LastName?.message}
						type="text"
						{...register("LastName")}
					/>

					<Input
						label="کد ملی"
						schema={CustomerAddWithRepresentativeSchema}
						error={errors.NationalCode?.message}
						type="text"
						dir="ltr"
						inputMode="numeric"
						{...register("NationalCode")}
					/>

					<Input
						label="شماره تماس"
						schema={CustomerAddWithRepresentativeSchema}
						error={errors.PhoneNumber?.message}
						type="text"
						dir="ltr"
						inputMode="tel"
						{...register("PhoneNumber")}
					/>

					<Input
						label="شغل"
						schema={CustomerAddWithRepresentativeSchema}
						error={errors.Job?.message}
						type="text"
						{...register("Job")}
					/>

					<Input
						label="آدرس"
						schema={CustomerAddWithRepresentativeSchema}
						error={errors.Address?.message}
						type="text"
						{...register("Address")}
					/>
				</div>
			</div>

			<div className="flex items-center justify-end gap-3 border-t pt-4">
				<Button type="button" onClick={onCancel} disabled={isSubmitting} variant="secondary">
					انصراف
				</Button>

				<Button type="submit" disabled={isSubmitting} variant="submit">
					{isSubmitting ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							در حال ثبت...
						</>
					) : (
						"ثبت اطلاعات"
					)}
				</Button>
			</div>
		</form>
	);
}
