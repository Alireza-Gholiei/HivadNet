"use client";

import { Ban, CalendarClock, CheckCircle2, Clock, Loader2, Phone, Send, User, Users, XOctagon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SmsGetDetailsDto, SmsGetDetailsItemDto } from "@/dataBinding/models/Messaging/Sms/SmsDtos";
import { SmsService } from "@/dataBinding/services/Messaging/Sms/SmsService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import { PageCard, PageCardContent, PageCardHeader } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

interface SmsGroupDetailsFormProps {
	smsGroupId: number;
}

export default function SmsGroupDetailsForm({ smsGroupId }: SmsGroupDetailsFormProps) {
	const gridRef = useRef<DataGridRef>(null);

	const [details, setDetails] = useState<SmsGetDetailsDto | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!smsGroupId) return;

		const loadDetails = async () => {
			try {
				setLoading(true);
				const result = await SmsService.GetDetail(smsGroupId);
				setDetails(result ?? null);
			} finally {
				setLoading(false);
			}
		};

		void loadDetails();
	}, [smsGroupId]);

	const fetchItems = async (params: BaseGrid) => {
		return await SmsService.GetDetailItem(smsGroupId, params);
	};

	const getSmsItemStatusStyle = (status: string) => {
		const normalizedStatus = status?.trim();

		switch (normalizedStatus) {
			case "در انتظار ارسال":
				return {
					className: "bg-amber-50 border-amber-200 text-amber-700",
					icon: <Clock className="w-3.5 h-3.5" />,
				};

			case "ارسال شده به اپراتور":
				return {
					className: "bg-blue-50 border-blue-200 text-blue-700",
					icon: <Send className="w-3.5 h-3.5" />,
				};

			case "تحویل داده شده":
				return {
					className: "bg-emerald-50 border-emerald-200 text-emerald-700",
					icon: <CheckCircle2 className="w-3.5 h-3.5" />,
				};

			case "خطا در ارسال":
				return {
					className: "bg-rose-50 border-rose-200 text-rose-700",
					icon: <XOctagon className="w-3.5 h-3.5" />,
				};

			default:
				return {
					className: "bg-slate-50 border-slate-200 text-slate-600",
					icon: <Clock className="w-3.5 h-3.5" />,
				};
		}
	};

	const getSmsGroupStatusStyle = (status: string) => {
		const normalizedStatus = status?.trim();

		switch (normalizedStatus) {
			case "در انتظار ارسال":
				return {
					className: "bg-amber-50 border-amber-200 text-amber-700",
					icon: <Clock className="w-3.5 h-3.5" />,
				};

			case "در حال ارسال":
				return {
					className: "bg-blue-50 border-blue-200 text-blue-700",
					icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
				};

			case "ارسال شده":
				return {
					className: "bg-emerald-50 border-emerald-200 text-emerald-700",
					icon: <CheckCircle2 className="w-3.5 h-3.5" />,
				};

			case "خطا در ارسال":
				return {
					className: "bg-rose-50 border-rose-200 text-rose-700",
					icon: <XOctagon className="w-3.5 h-3.5" />,
				};

			case "لغو شده":
				return {
					className: "bg-slate-50 border-slate-200 text-slate-600",
					icon: <Ban className="w-3.5 h-3.5" />,
				};

			default:
				return {
					className: "bg-slate-50 border-slate-200 text-slate-600",
					icon: <Clock className="w-3.5 h-3.5" />,
				};
		}
	};

	if (loading) {
		return <div className="p-6">در حال دریافت اطلاعات...</div>;
	}

	if (!details) {
		return (
			<div className="p-6">
				<div className="text-rose-600">اطلاعات گروه پیامکی یافت نشد.</div>
			</div>
		);
	}

	const groupStatus = getSmsGroupStatusStyle(details.Status);

	return (
		<PageCard>
			<PageCardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<div className="text-sm text-slate-500">نام گروه پیامکی</div>
						<div className="font-bold text-slate-800">{details.SmsGroupName}</div>
					</div>

					<div className="space-y-2">
						<div className="text-sm text-slate-500">وضعیت</div>
						<div
							className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border shadow-sm ${groupStatus.className}`}
						>
							{groupStatus.icon}
							<span className="text-xs font-bold">{details.Status}</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="text-sm text-slate-500">تعداد گیرندگان</div>
						<div className="font-bold text-slate-800 flex items-center gap-2">
							<Users className="w-4 h-4 text-slate-500" />
							{details.ItemsCount}
						</div>
					</div>

					<div className="space-y-2">
						<div className="text-sm text-slate-500">تاریخ زمان‌بندی</div>
						<div className="font-bold text-slate-800 flex items-center gap-2">
							<CalendarClock className="w-4 h-4 text-slate-500" />
							{details.ScheduledDate || "-"}
						</div>
					</div>
				</div>

				<div className="mt-5">
					<div className="text-sm text-slate-500 mb-2">متن پیامک</div>
					<div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 leading-7">
						{details.MessageText || "-"}
					</div>
				</div>
			</PageCardContent>

			<PageCard>
				<PageCardHeader>
					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-bold text-slate-800">لیست گیرندگان</h3>
							<p className="text-sm text-slate-500 mt-1">
								وضعیت ارسال برای هر گیرنده در این بخش قابل مشاهده است
							</p>
						</div>
					</div>
				</PageCardHeader>
				<PageCardContent>
					<DataGrid<SmsGetDetailsItemDto> ref={gridRef} fetchFunction={fetchItems} initialLimit={10}>
						<Column<SmsGetDetailsItemDto>
							field="FirstName"
							header="نام"
							render={(row) => (
								<div className="flex items-center gap-2">
									<User className="w-4 h-4 text-slate-400" />
									<span>{row.FirstName || "-"}</span>
								</div>
							)}
						/>

						<Column<SmsGetDetailsItemDto>
							field="LastName"
							header="نام خانوادگی"
							render={(row) => <span>{row.LastName || "-"}</span>}
						/>

						<Column<SmsGetDetailsItemDto>
							field="PhoneNumber"
							header="شماره تماس"
							render={(row) => (
								<div className="flex items-center gap-2">
									<Phone className="w-4 h-4 text-slate-400" />
									<span className="dir-ltr">{row.PhoneNumber || "-"}</span>
								</div>
							)}
						/>

						<Column<SmsGetDetailsItemDto>
							field="Status"
							header="وضعیت"
							render={(row) => {
								const statusStyle = getSmsItemStatusStyle(row.Status);

								return (
									<div
										className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border shadow-sm ${statusStyle.className}`}
									>
										{statusStyle.icon}
										<span className="text-xs font-bold">{row.Status}</span>
									</div>
								);
							}}
						/>
					</DataGrid>
				</PageCardContent>
			</PageCard>
		</PageCard>
	);
}
