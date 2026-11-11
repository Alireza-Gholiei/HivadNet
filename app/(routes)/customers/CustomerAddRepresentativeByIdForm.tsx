"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import CustomerSelector from "@/components/customer/CustomerSelector";
import { CustomerGetGridDto } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import {
	CustomerRepresentativeAddByIdDto,
	CustomerRepresentativeAddByIdSchema,
} from "@/dataBinding/models/Customer/CustomerRepresentativeAddByIdDto";
import { GuildGetListDto } from "@/dataBinding/models/Guild/GuildGetListDto";
import { GuildGroupGetListDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetListDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import { GuildGroupService } from "@/dataBinding/services/Guild/GuildGroupService";
import { GuildService } from "@/dataBinding/services/Guild/GuildService";
import { Button } from "@/utilities/components/ui/button";
import { Select } from "@/utilities/components/ui/select";
import { Messenger } from "@/utilities/Messenger";

interface CustomerAddRepresentativeByIdFormProps {
	customer: CustomerGetGridDto;
	onClose: () => void;
}

export default function CustomerAddRepresentativeByIdForm({
	customer,
	onClose,
}: CustomerAddRepresentativeByIdFormProps) {
	const [guildList, setGuildList] = useState<GuildGetListDto[]>([]);
	const [guildGroupList, setGuildGroupList] = useState<GuildGroupGetListDto[]>([]);
	const [selectedGuildId, setSelectedGuildId] = useState<number | null>(null);
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerGetGridDto | null>(null);

	const {
		register,
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<CustomerRepresentativeAddByIdDto>({
		resolver: zodResolver(CustomerRepresentativeAddByIdSchema),
		defaultValues: {
			CustomerId: customer.Id,
		},
	});

	useEffect(() => {
		void fetchBaseData();
	}, []);

	useEffect(() => {
		if (selectedCustomer?.Id) {
			setValue("RepresentativeCustomerId", selectedCustomer.Id, {
				shouldValidate: true,
				shouldDirty: true,
			});
		}
	}, [selectedCustomer, setValue]);

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
			Messenger.errorMessage("خطا در دریافت گروه‌های سامانه از سرور");
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
		setSelectedCustomer(null);
		setGuildGroupList([]);
		onClose();
	};

	const onSubmit = async (data: CustomerRepresentativeAddByIdDto) => {
		try {
			if (data.CustomerId === data.RepresentativeCustomerId) {
				Messenger.errorMessage("مشتری نمی‌تواند نماینده خودش باشد.");
				return;
			}

			const result = await CustomerService.RepresentativeAddById(data);

			if (result) {
				Messenger.successAlert("نماینده با موفقیت ثبت شد.");
				handleClose();
			} else {
				Messenger.errorMessage("خطا در ثبت نماینده.");
			}
		} catch {
			Messenger.errorMessage("ارتباط با سرور برقرار نشد.");
		}
	};

	return (
		<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-6 w-full" dir="rtl">
			<div className="border-t border-slate-100 bg-slate-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2 text-emerald-600">
						<UserPlus className="w-4 h-4" />

						<h3 className="font-bold text-sm">ثبت نماینده از مشتریان موجود برای {customer.FullName}</h3>
					</div>

					<Button
						type="button"
						size="sm"
						variant="outline"
						onClick={handleClose}
						className="text-rose-400 hover:text-rose-600 transition-colors"
					>
						<X className="w-5 h-5" />
					</Button>
				</div>

				<input type="hidden" {...register("CustomerId", { valueAsNumber: true })} />

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
						labelClassName="block text-xs font-medium text-slate-700 mb-1"
						triggerClassName="border-slate-300 pr-11 pl-10 py-3 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-400"
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
								schema={CustomerRepresentativeAddByIdSchema}
								error={errors.GuildGroupId?.message}
								options={guildGroupList.map((x) => ({
									label: x.Name,
									value: x.Id,
								}))}
								labelClassName="block text-xs font-medium text-slate-700 mb-1"
								triggerClassName="border-slate-300 pr-11 pl-10 py-3 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-400"
							/>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 gap-4">
					<div>
						<CustomerSelector
							value={selectedCustomer}
							onChange={(value: CustomerGetGridDto | null) => {
								setSelectedCustomer(value);

								if (value?.Id) {
									setValue("RepresentativeCustomerId", value.Id, {
										shouldValidate: true,
										shouldDirty: true,
									});
								}
							}}
							label="انتخاب مشتری نماینده"
							required
						/>

						<input type="hidden" {...register("RepresentativeCustomerId", { valueAsNumber: true })} />

						{errors.RepresentativeCustomerId && (
							<p className="text-rose-500 text-sm font-medium mt-1">
								{errors.RepresentativeCustomerId.message}
							</p>
						)}

						{selectedCustomer?.Id === customer.Id && (
							<p className="text-rose-500 text-sm font-medium mt-1">مشتری نمی‌تواند نماینده خودش باشد.</p>
						)}
					</div>

					<Button
						variant="submit"
						type="submit"
						disabled={isSubmitting || selectedCustomer?.Id === customer.Id}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								در حال ثبت...
							</>
						) : (
							"ذخیره اطلاعات"
						)}
					</Button>
				</div>
			</div>
		</form>
	);
}
