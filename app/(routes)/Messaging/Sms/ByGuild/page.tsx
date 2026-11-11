"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus, SendToBack } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import HraderTitle from "@/components/Shared/HraderTitle";
import { GuildGetListDto } from "@/dataBinding/models/Guild/GuildGetListDto";
import { GuildGroupGetListDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetListDto";
import { SmsAddByGuildDto, SmsAddByGuildSchema } from "@/dataBinding/models/Messaging/Sms/SmsDtos";
import { GuildGroupService } from "@/dataBinding/services/Guild/GuildGroupService";
import { GuildService } from "@/dataBinding/services/Guild/GuildService";
import { SmsService } from "@/dataBinding/services/Messaging/Sms/SmsService";
import PersianDatePicker from "@/utilities/components/datepicker/persian-date-picker";
import PersianTimePicker from "@/utilities/components/datepicker/persian-time-picker";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";
import { Input } from "@/utilities/components/ui/input";
import { Select } from "@/utilities/components/ui/select";
import { Textarea } from "@/utilities/components/ui/textarea";

interface SmsAddByGuildFormProps {}

export default function SmsAddByGuildForm({}: SmsAddByGuildFormProps) {
	const [guilds, setGuilds] = useState<GuildGetListDto[]>([]);
	const [guildGroups, setGuildGroups] = useState<GuildGroupGetListDto[]>([]);
	const [isLoadingGuilds, setIsLoadingGuilds] = useState<boolean>(true);
	const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<SmsAddByGuildDto>({
		resolver: zodResolver(SmsAddByGuildSchema),
		defaultValues: {
			Name: "",
			Description: null,
			MessageText: "",
			GuildId: 0,
			GuildGroupId: 0,
		},
	});

	const selectedGuildId = watch("GuildId");

	useEffect(() => {
		const fetchGuilds = async () => {
			try {
				const data = await GuildService.GetList();

				setGuilds(data);
			} catch (error) {
				console.error("خطا در دریافت لیست صنف‌ها", error);
				Messenger.errorMessage("خطا در دریافت لیست صنف‌ها");
			} finally {
				setIsLoadingGuilds(false);
			}
		};

		void fetchGuilds();
	}, []);

	useEffect(() => {
		const fetchGuildGroups = async () => {
			if (!selectedGuildId || Number(selectedGuildId) === 0) {
				setGuildGroups([]);
				setValue("GuildGroupId", 0, { shouldValidate: true });
				return;
			}

			setIsLoadingGroups(true);

			try {
				const data = await GuildGroupService.GetList(Number(selectedGuildId));

				setGuildGroups(data);
				setValue("GuildGroupId", 0, { shouldValidate: true });
			} catch (error) {
				console.error("خطا در دریافت گروه‌های صنف", error);
				Messenger.errorMessage("خطا در دریافت گروه‌های صنف");
			} finally {
				setIsLoadingGroups(false);
			}
		};

		void fetchGuildGroups();
	}, [selectedGuildId, setValue]);

	const onSubmit = async (data: SmsAddByGuildDto) => {
		if (!data.GuildId || data.GuildId === 0) {
			Messenger.errorMessage("لطفا صنف را انتخاب کنید");
			return;
		}

		const result = await SmsService.ByGuild(data);

		if (result) {
			Messenger.successAlert("پیامک با موفقیت زمان‌بندی شد!");
			reset({ Name: "", Description: null, MessageText: "", GuildId: 0, GuildGroupId: 0 });
		}
	};

	return (
		<PageCard>
			<HraderTitle
				title="ارسال گروهی"
				description="ارسال پیامک به گروه‌ها یا سامانه‌های منتخب"
				icon={<SendToBack />}
			/>

			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4" dir="rtl">
				<PageCardContent>
					<Input
						label="عنوان پیامک"
						schema={SmsAddByGuildSchema}
						error={errors.Name?.message}
						icon={<FolderPlus className="h-5 w-5" />}
						placeholder="مثال: اطلاع‌رسانی به اعضای صنف"
						{...register("Name")}
					/>

					<Textarea
						label="توضیحات"
						schema={SmsAddByGuildSchema}
						error={errors.Description?.message}
						placeholder="توضیحات اختیاری..."
						rows={2}
						textareaClassName="resize-none"
						{...register("Description")}
					/>

					<Textarea
						label="متن پیامک"
						schema={SmsAddByGuildSchema}
						error={errors.MessageText?.message}
						placeholder="متن پیامک خود را اینجا بنویسید..."
						rows={5}
						textareaClassName="resize-none"
						{...register("MessageText")}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="ScheduledDate"
								className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1"
							>
								تاریخ ارسال
							</label>
							<PersianDatePicker<SmsAddByGuildDto> control={control} name="ScheduledDate" required />
						</div>

						<div>
							<label
								htmlFor="ScheduledTime"
								className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1"
							>
								زمان ارسال
							</label>
							<PersianTimePicker<SmsAddByGuildDto> control={control} name="ScheduledTime" required />
						</div>
					</div>

					<div className="bg-gray-50 p-3 rounded border space-y-4 mt-4">
						<div>
							<Controller
								control={control}
								name="GuildId"
								render={({ field }) => (
									<Select
										label="صنف"
										name={field.name}
										value={field.value || null}
										onValueChange={(value) => {
											field.onChange(value ?? 0);
											setValue("GuildGroupId", 0, { shouldValidate: true });
										}}
										onBlur={field.onBlur}
										placeholder={isLoadingGuilds ? "در حال بارگذاری صنف‌ها..." : "انتخاب صنف"}
										searchPlaceholder="جستجوی صنف..."
										clearable
										disabled={isLoadingGuilds}
										schema={SmsAddByGuildSchema}
										error={errors.GuildId?.message}
										options={guilds.map((guild) => ({
											label: guild.Name,
											value: guild.Id,
										}))}
										labelClassName="block text-sm font-medium mb-1"
										triggerClassName="border p-2 rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
									/>
								)}
							/>
						</div>

						<div>
							<Controller
								control={control}
								name="GuildGroupId"
								render={({ field }) => (
									<Select
										label="گروه صنف"
										name={field.name}
										value={field.value || null}
										onValueChange={(value) => field.onChange(value ?? 0)}
										onBlur={field.onBlur}
										placeholder={isLoadingGroups ? "در حال بارگذاری گروه‌ها..." : "انتخاب گروه صنف"}
										searchPlaceholder="جستجوی گروه صنف..."
										clearable
										disabled={!selectedGuildId || Number(selectedGuildId) === 0 || isLoadingGroups}
										schema={SmsAddByGuildSchema}
										error={errors.GuildGroupId?.message}
										options={guildGroups.map((group) => ({
											label: group.Name,
											value: group.Id,
										}))}
										labelClassName="block text-sm font-medium mb-1"
										triggerClassName="border p-2 rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
									/>
								)}
							/>
						</div>
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
