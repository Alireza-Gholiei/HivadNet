"use client";

import { Calculator, FileText, Package, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
	CustomerGetGuildsDto,
	CustomerGetGuildsFieldDto,
} from "@/dataBinding/models/Customer/CustomerGetGuildGroupDetailDto";
import { ServiceGetDetailDto } from "@/dataBinding/models/Service/ServiceGetDetailDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import { ServiceService } from "@/dataBinding/services/Service/ServiceService";
import CopyToClipboard from "@/utilities/components/copy/CopyToClipboard";
import { PageCard, PageCardContent } from "@/utilities/components/ui/card";

export default function ServiceDetailView({ serviceId }: { serviceId: number }) {
	const [data, setData] = useState<ServiceGetDetailDto>({} as ServiceGetDetailDto);
	const [customerGetGuildsDto, setCustomerGetGuilds] = useState<Record<number, CustomerGetGuildsDto>>({});

	useEffect(() => {
		if (!serviceId) return;
		void fetchData();
	}, [serviceId]);

	const fetchData = async () => {
		const result = await ServiceService.GetDetail(serviceId);

		if (result) {
			setData(result);

			result.Items.map((e) => {
				void fetchGuildGroupDetail(result.CustomerId, e.GuildGroupId);
			});
		}
	};

	const fetchGuildGroupDetail = async (customerId: number, guildGroupId: number) => {
		const result = await CustomerService.GetGuildGroupDetail(customerId, guildGroupId);

		setCustomerGetGuilds((prev) => ({
			...prev,
			[guildGroupId]: result,
		}));
	};

	const summary = useMemo(() => {
		const totalPrice =
			data.Items?.reduce((sum, item) => {
				return sum + Number(item.Quantity || 0) * Number(item.UnitPrice || 0);
			}, 0) || 0;

		const totalDiscount =
			data.Items?.reduce((sum, item) => {
				return sum + Number(item.Discount || 0);
			}, 0) || 0;

		return {
			totalPrice,
			totalDiscount,
			totalFinal: Math.max(totalPrice - totalDiscount, 0),
		};
	}, [data.Items]);

	const formatPrice = (value: number) => {
		return new Intl.NumberFormat("fa-IR").format(value || 0);
	};

	const renderFieldValue = (field: CustomerGetGuildsFieldDto) => {
		if (field.Value === null || String(field.Value).trim() === "") {
			return <span className="text-slate-400">—</span>;
		}

		switch (field.DataType) {
			case 4:
				return (
					<div className="flex items-center gap-2">
						<span
							className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
								field.Value === "true" || field.Value === "1"
									? "bg-green-100 text-green-700"
									: "bg-rose-100 text-rose-700"
							}`}
						>
							{field.Value === "true" || field.Value === "1" ? "بله" : "خیر"}
						</span>
						<CopyToClipboard textToCopy={field.Value} size={12} />
					</div>
				);

			default:
				return (
					<div className="flex items-center gap-2">
						<span className="text-slate-800 wrap-break-word">{field.Value}</span>
						<CopyToClipboard textToCopy={field.Value} size={12} />
					</div>
				);
		}
	};

	const CustomerGuildInfoCard = ({ guildGroupId }: { guildGroupId: number }) => {
		const data = customerGetGuildsDto[guildGroupId];

		if (!data) {
			return (
				<div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500">
					اطلاعات تکمیلی گروه برای این آیتم ثبت نشده است.
				</div>
			);
		}

		return (
			<div className="overflow-hidden rounded-xl border border-indigo-100 bg-indigo-50/40">
				<div className="border-b border-indigo-100 bg-white/70 px-4 py-3">
					<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
						<div>
							<div className="text-sm font-bold text-slate-800">{data.CustomerFullName}</div>
							<div className="mt-1 text-xs text-slate-500">
								اطلاعات ثبت شده مشتری در سامانه و گروه انتخاب شده
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							<span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
								سامانه: {data.GuildName}
							</span>
							<span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
								گروه: {data.GuildGroupName}
							</span>
						</div>
					</div>
				</div>

				<div className="p-4">
					{data.Fields && data.Fields.length > 0 ? (
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
							{data.Fields.map((field) => (
								<div
									key={field.FieldId}
									className="rounded-lg border border-slate-200 bg-white px-3 py-3"
								>
									<div className="mb-1 text-xs text-slate-500">
										{field.FieldName ?? `فیلد ${field.FieldId}`}
										{field.IsRequired && <span className="mr-1 text-rose-500">*</span>}
									</div>
									<div className="text-sm font-medium">{renderFieldValue(field)}</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-sm text-slate-400">اطلاعاتی برای این گروه ثبت نشده است.</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<PageCard className="w-full space-y-6">
			<PageCardContent className="grid grid-cols-1 gap-6 xl:grid-cols-3">
				<div className="space-y-6 xl:col-span-2">
					<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
						<div className="flex items-center gap-2 border-b border-slate-200 p-4">
							<User className="h-5 w-5 text-indigo-600" />
							<span className="text-sm font-semibold text-slate-700">اطلاعات اصلی</span>
						</div>

						<div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
							<div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
								<div className="mb-1 text-xs text-slate-500">مشتری</div>
								<div className="flex items-center gap-2 text-sm font-bold text-slate-800">
									<span>{data.CustomerFullName}</span>
									<CopyToClipboard textToCopy={data.CustomerFullName} size={13} />
								</div>
							</div>

							<div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2">
								<div className="mb-1 text-xs text-slate-500">توضیحات</div>
								<div className="text-sm text-slate-800">
									{data.Description?.trim() ? data.Description : "—"}
								</div>
							</div>

							{data.CreateDate && (
								<div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2">
									<div className="mb-1 text-xs text-slate-500">تاریخ ثبت</div>
									<div className="text-sm font-medium text-slate-800">{data.CreateDate}</div>
								</div>
							)}
						</div>
					</div>

					<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
						<div className="flex items-center gap-2 border-b border-slate-200 p-4">
							<Package className="h-5 w-5 text-indigo-600" />
							<span className="text-sm font-semibold text-slate-700">آیتم‌های خدمت</span>
						</div>

						<div className="flex flex-col gap-4 bg-slate-50/30 p-4">
							{data.Items?.length > 0 ? (
								data.Items.map((item, index) => {
									const rowTotal = Number(item.Quantity || 0) * Number(item.UnitPrice || 0);
									const rowFinal = Math.max(rowTotal - Number(item.Discount || 0), 0);

									return (
										<div
											key={item.Id || index}
											className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
										>
											<div className="flex items-center justify-between">
												<div className="text-sm font-bold text-slate-700">آیتم {index + 1}</div>
											</div>

											<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
												<div>
													<div className="mb-1 text-xs text-slate-500">سامانه</div>
													<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">
														{item.GuildName || "—"}
													</div>
												</div>

												<div>
													<div className="mb-1 text-xs text-slate-500">گروه سامانه</div>
													<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">
														{item.GuildGroupName || "—"}
													</div>
												</div>

												<div>
													<div className="mb-1 text-xs text-slate-500">هزینه خدمت</div>
													<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">
														{item.ServiceCostTitle || "—"}
													</div>
												</div>

												<div>
													<div className="mb-1 text-xs text-slate-500">نماینده مشتری</div>
													<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">
														{item.RepresentativeCustomerName?.trim()
															? item.RepresentativeCustomerName
															: "—"}
													</div>
												</div>

												<div>
													<div className="mb-1 text-xs text-slate-500">تعداد</div>
													<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">
														{item.Quantity}
													</div>
												</div>

												<div>
													<div className="mb-1 text-xs text-slate-500">مبلغ واحد</div>
													<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">
														{formatPrice(item.UnitPrice)} تومان
													</div>
												</div>

												<div>
													<div className="mb-1 text-xs text-slate-500">تخفیف</div>
													<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">
														{formatPrice(item.Discount)} تومان
													</div>
												</div>

												<div className="md:col-span-2 xl:col-span-3">
													<div className="mb-1 text-xs text-slate-500">توضیحات آیتم</div>
													<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800">
														{item.Description?.trim() ? item.Description : "—"}
													</div>
												</div>

												<div className="md:col-span-2 xl:col-span-3">
													<CustomerGuildInfoCard guildGroupId={item.GuildGroupId} />
												</div>
											</div>

											<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
												<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
													<span className="text-slate-500">جمع ردیف:</span>
													<span className="mr-2 font-bold text-slate-800">
														{formatPrice(rowTotal)} تومان
													</span>
												</div>

												<div className="rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-sm">
													<span className="text-slate-600">مبلغ نهایی ردیف:</span>
													<span className="mr-2 font-bold text-green-700">
														{formatPrice(rowFinal)} تومان
													</span>
												</div>
											</div>
										</div>
									);
								})
							) : (
								<div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
									هیچ آیتمی برای این خدمت ثبت نشده است.
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="sticky top-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
						<div className="flex items-center gap-2 border-b border-slate-200 p-4">
							<Calculator className="h-5 w-5 text-indigo-600" />
							<span className="text-sm font-semibold text-slate-700">خلاصه مالی</span>
						</div>

						<div className="space-y-3 p-4">
							<div className="flex items-center justify-between rounded-xl border px-3 py-3">
								<span className="text-sm text-slate-600">جمع کل</span>
								<span className="font-bold text-slate-800">
									{formatPrice(summary.totalPrice)} تومان
								</span>
							</div>

							<div className="flex items-center justify-between rounded-xl border px-3 py-3">
								<span className="text-sm text-slate-600">جمع تخفیف</span>
								<span className="font-bold text-amber-600">
									{formatPrice(summary.totalDiscount)} تومان
								</span>
							</div>

							<div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-3 py-3">
								<span className="text-sm text-slate-700">مبلغ نهایی</span>
								<span className="font-extrabold text-green-700">
									{formatPrice(summary.totalFinal)} تومان
								</span>
							</div>
						</div>
					</div>

					<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
						<div className="flex items-center gap-2 border-b border-slate-200 p-4">
							<FileText className="h-5 w-5 text-indigo-600" />
							<span className="text-sm font-semibold text-slate-700">اطلاعات تکمیلی</span>
						</div>

						<div className="space-y-3 p-4 text-sm">
							<div className="flex items-start justify-between gap-3">
								<span className="text-slate-500">تعداد آیتم‌ها</span>
								<span className="font-bold text-slate-800">{data.Items?.length || 0}</span>
							</div>

							<div className="flex items-start justify-between gap-3">
								<span className="text-slate-500">عنوان مشتری</span>
								<div className="flex items-center gap-2 font-bold text-slate-800">
									<span>{data.CustomerFullName}</span>
									<CopyToClipboard textToCopy={data.CustomerFullName} size={12} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</PageCardContent>
		</PageCard>
	);
}
