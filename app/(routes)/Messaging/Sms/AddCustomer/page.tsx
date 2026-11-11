"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import CustomerMultiSelector from "@/components/customer/CustomerMultiSelector";
import HraderTitle from "@/components/Shared/HraderTitle";
import {
	SmsAddCustomersDto,
	SmsAddCustomersSchema,
	SmsGetActiveListDto,
} from "@/dataBinding/models/Messaging/Sms/SmsDtos";
import { SmsService } from "@/dataBinding/services/Messaging/Sms/SmsService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";
import { Select } from "@/utilities/components/ui/select";

interface SmsAddCustomerFormProps {}

export default function SmsAddCustomerForm({}: SmsAddCustomerFormProps) {
	const [groups, setGroups] = useState<SmsGetActiveListDto[]>([]);
	const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(true);

	const {
		handleSubmit,
		setValue,
		reset,
		watch,
		control,
		formState: { errors, isSubmitting },
	} = useForm<SmsAddCustomersDto>({
		resolver: zodResolver(SmsAddCustomersSchema),
		defaultValues: {
			Id: 0,
			CustomerIds: [],
		},
	});

	useEffect(() => {
		const fetchGuilds = async () => {
			try {
				const data = await SmsService.GetActiveList();

				setGroups(data);
			} finally {
				setIsLoadingGroups(false);
			}
		};

		void fetchGuilds();
	}, []);

	const onSubmit = async (data: SmsAddCustomersDto) => {
		const result = await SmsService.AddCustomer(data);

		if (result) {
			Messenger.successAlert("کاربران با موفقیت اضافه شدند!");
			reset({ Id: 0, CustomerIds: [] });
		}
	};

	return (
		<PageCard>
			<HraderTitle
				title="افزودن اعضا به گروه"
				description="افزودن مشتریان به گروه‌های پیامکی"
				icon={<UserPlus />}
			/>

			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4" dir="rtl">
				<PageCardContent>
					<div>
						<Controller
							control={control}
							name="Id"
							render={({ field }) => (
								<Select
									label="گروه"
									name={field.name}
									value={field.value || null}
									onValueChange={(value) => field.onChange(value ?? 0)}
									onBlur={field.onBlur}
									placeholder={isLoadingGroups ? "در حال بارگذاری گروه ها..." : "انتخاب گروه"}
									searchPlaceholder="جستجوی گروه..."
									clearable
									disabled={isLoadingGroups}
									schema={SmsAddCustomersSchema}
									error={errors.Id?.message}
									options={groups.map((group) => ({
										label: group.Name,
										value: group.Id,
									}))}
									labelClassName="block text-sm font-medium mb-1"
									triggerClassName="border p-2 rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
								/>
							)}
						/>
					</div>

					<div>
						<CustomerMultiSelector
							valueIds={watch("CustomerIds") || []}
							onChange={(customers) =>
								setValue(
									"CustomerIds",
									customers.map((x) => x.Id),
								)
							}
							label="انتخاب مشتریان"
							required
						/>

						{errors.CustomerIds && (
							<p className="text-rose-500 text-sm mt-1.5 font-medium">{errors.CustomerIds.message}</p>
						)}
					</div>
				</PageCardContent>
				<PageCardFooter>
					<Button type="submit" disabled={isSubmitting} variant="submit">
						{isSubmitting ? "در حال ثبت..." : "ثبت و زمان‌بندی پیامک"}
					</Button>
				</PageCardFooter>
			</form>
		</PageCard>
	);
}
