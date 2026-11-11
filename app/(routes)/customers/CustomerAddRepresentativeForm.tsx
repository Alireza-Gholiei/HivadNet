import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
	CustomerAddRepresentativeDto,
	CustomerAddRepresentativeSchema,
} from "@/dataBinding/models/Customer/CustomerAddRepresentativeDto";
import { CustomerGetGridDto } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import { GuildGetListDto } from "@/dataBinding/models/Guild/GuildGetListDto";
import { GuildGroupGetListDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetListDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import { GuildGroupService } from "@/dataBinding/services/Guild/GuildGroupService";
import { GuildService } from "@/dataBinding/services/Guild/GuildService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Input } from "@/utilities/components/ui/input";
import { Select } from "@/utilities/components/ui/select";
import { Messenger } from "@/utilities/Messenger";

interface CustomerAddRepresentativeFormProps {
	customer: CustomerGetGridDto;
	onClose: () => void;
}

export default function CustomerAddRepresentativeForm({ customer, onClose }: CustomerAddRepresentativeFormProps) {
	const [guildList, setGuildList] = useState<GuildGetListDto[]>([]);
	const [guildGroupList, setGuildGroupList] = useState<GuildGroupGetListDto[]>([]);
	const [selectedGuildId, setSelectedGuildId] = useState<number | null>(null);

	const {
		register,
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<CustomerAddRepresentativeDto>({
		resolver: zodResolver(CustomerAddRepresentativeSchema),
		defaultValues: {
			CustomerId: customer.Id,
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

	const handleClose = () => {
		reset({
			CustomerId: customer.Id,
		});
		setSelectedGuildId(null);
		setGuildGroupList([]);
		onClose();
	};

	const onSubmit = async (data: CustomerAddRepresentativeDto) => {
		try {
			const result = await CustomerService.AddRepresentative(data);

			if (result) {
				Messenger.successAlert("سامانه با موفقیت ثبت شد.");
			} else {
				Messenger.errorMessage("خطا در ثبت سامانه.");
			}
		} catch {
			Messenger.errorMessage("ارتباط با سرور برقرار نشد.");
		} finally {
			handleClose();
		}
	};

	return (
		<PageCard>
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex w-full flex-col gap-6" dir="rtl">
				<PageCardContent>
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2 text-indigo-600">
							<UserPlus className="h-4 w-4" />
							<h3 className="text-sm font-bold">ثبت نماینده برای {customer.FullName}</h3>
						</div>

						<button
							type="button"
							onClick={handleClose}
							className="text-rose-400 transition-colors hover:text-rose-600"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					<div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
									schema={CustomerAddRepresentativeSchema}
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

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Input
							label="نام"
							schema={CustomerAddRepresentativeSchema}
							error={errors.FirstName?.message}
							type="text"
							placeholder="نام"
							{...register("FirstName")}
						/>

						<Input
							label="نام خانوادگی"
							schema={CustomerAddRepresentativeSchema}
							error={errors.LastName?.message}
							type="text"
							placeholder="نام خانوادگی"
							{...register("LastName")}
						/>

						<Input
							label="کد ملی"
							schema={CustomerAddRepresentativeSchema}
							error={errors.NationalCode?.message}
							type="text"
							dir="ltr"
							inputMode="numeric"
							placeholder="کد ملی"
							{...register("NationalCode")}
						/>

						<Input
							label="شماره تماس"
							schema={CustomerAddRepresentativeSchema}
							error={errors.PhoneNumber?.message}
							type="text"
							dir="ltr"
							inputMode="tel"
							placeholder="شماره تماس"
							{...register("PhoneNumber")}
						/>

						<Input
							label="شغل"
							schema={CustomerAddRepresentativeSchema}
							error={errors.Job?.message}
							type="text"
							placeholder="شغل"
							{...register("Job")}
						/>

						<Input
							label="آدرس"
							schema={CustomerAddRepresentativeSchema}
							error={errors.Address?.message}
							type="text"
							placeholder="آدرس"
							{...register("Address")}
						/>
					</div>
				</PageCardContent>

				<PageCardFooter>
					<Button variant="submit" type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								در حال ثبت...
							</>
						) : (
							"ذخیره اطلاعات"
						)}
					</Button>
				</PageCardFooter>
			</form>
		</PageCard>
	);
}
