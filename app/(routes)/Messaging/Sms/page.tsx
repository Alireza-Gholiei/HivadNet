"use client";

import {
	Ban,
	CalendarClock,
	CheckCircle2,
	ChevronLeft,
	Clock,
	Loader2,
	MessageSquareMore,
	MessageSquareText,
	Users,
	XOctagon,
} from "lucide-react";
import { useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { SmsGetGridDto } from "@/dataBinding/models/Messaging/Sms/SmsDtos";
import { SmsService } from "@/dataBinding/services/Messaging/Sms/SmsService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

import SmsGroupDetailsForm from "./SmsGroupDetailsForm";

export default function SmsGroupGridPage() {
	const gridRef = useRef<DataGridRef>(null);

	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<number | null>(null);

	const fetchData = async (params: BaseGrid) => {
		return await SmsService.GetGrid(params);
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

	return (
		<PageCard>
			<HraderTitle
				title="مدیریت پیامک ها"
				description="مدیریت ارسال و پیگیری پیامک‌ها"
				icon={<MessageSquareMore />}
			/>

			<PageCardContent>
				<DataGrid<SmsGetGridDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
					<Column<SmsGetGridDto>
						field="Id"
						filterable={false}
						header="نمایش"
						render={(item) => {
							const statusStyle = getSmsGroupStatusStyle(item.Status);

							return (
								<CardTable
									key={item.Id}
									onClick={() => {
										setSelectedId(item.Id);
										setIsDetailModalOpen(true);
									}}
									className="bg-white border-slate-200 shadow-sm transition-all duration-200 cursor-pointer overflow-hidden hover:shadow-md hover:border-indigo-200"
								>
									<div className="p-4">
										<div className="flex items-start gap-4">
											<div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100">
												<MessageSquareText className="text-indigo-600 w-5 h-5" />
											</div>

											<div className="flex-1 space-y-3">
												<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
													<div>
														<h3 className="font-bold text-lg text-slate-800">
															{item.SmsGroupName}
														</h3>

														<div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
															<Users className="w-4 h-4" />
															<span>{item.ItemsCount} گیرنده</span>
														</div>
													</div>

													<div
														className={`flex items-center gap-1.5 px-2 py-1 rounded-md border shadow-sm w-fit ${statusStyle.className}`}
													>
														{statusStyle.icon}
														<span className="text-xs font-bold">{item.Status}</span>
													</div>
												</div>

												<div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
													<p className="text-sm text-slate-700 leading-7 line-clamp-3">
														{item.MessageText}
													</p>
												</div>

												<div className="flex items-center gap-2 text-sm text-slate-500">
													<CalendarClock className="w-4 h-4 text-slate-400" />
													<span>تاریخ زمان‌بندی:</span>
													<span className="font-semibold text-slate-700">
														{item.ScheduledDate || "-"}
													</span>
												</div>

												<div className="flex items-center justify-between rounded-lg border border-dashed border-indigo-200 bg-indigo-50 px-3 py-2 text-indigo-700">
													<span className="text-sm font-medium">
														برای مشاهده جزئیات گیرندگان و وضعیت ارسال کلیک کنید
													</span>
													<ChevronLeft className="w-4 h-4" />
												</div>
											</div>
										</div>
									</div>
								</CardTable>
							);
						}}
					/>

					<Column<SmsGetGridDto> field="SmsGroupName" header="نام گروه پیامکی" render={() => null} />
					<Column<SmsGetGridDto> field="Status" header="وضعیت" render={() => null} />
					<Column<SmsGetGridDto> field="MessageText" header="متن پیامک" render={() => null} />
					<Column<SmsGetGridDto> field="ScheduledDate" header="تاریخ زمان‌بندی" render={() => null} />
					<Column<SmsGetGridDto> field="ItemsCount" header="تعداد گیرندگان" render={() => null} />
				</DataGrid>
			</PageCardContent>

			<Popup
				show={isDetailModalOpen}
				onClose={() => {
					setIsDetailModalOpen(false);
					setSelectedId(null);
				}}
				title="گزارش پیامک"
				description="مشاهده وضعیت و جزئیات پیامک‌های ارسال شده و لیست گیرندگان"
				fullScreen
			>
				{selectedId && <SmsGroupDetailsForm smsGroupId={selectedId} />}
			</Popup>
		</PageCard>
	);
}
