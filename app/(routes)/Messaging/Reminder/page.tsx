"use client";

import { Bell, CalendarClock, CheckCircle2, ClipboardList, User, UserCheck, XCircle } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { ReminderGetGridDto } from "@/dataBinding/models/Reminder/ReminderGetGridDto";
import { ReminderService } from "@/dataBinding/services/Reminder/ReminderService";
import CopyToClipboard from "@/utilities/components/copy/CopyToClipboard";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";
import ReminderAssignUserForm from "./ReminderAssignUserForm";

export default function RemindersPage() {
	const gridRef = useRef<DataGridRef>(null);

	const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
	const [selectedReminderId, setSelectedReminderId] = useState<number | null>(null);

	const fetchData = useCallback(async (params: BaseGrid) => {
		return await ReminderService.Get(params);
	}, []);

	const reloadGrid = useCallback(() => {
		gridRef.current?.reload?.();
	}, []);

	const handleOpenAssign = (id: number) => {
		setSelectedReminderId(id);
		setIsAssignModalOpen(true);
	};

	const handleCloseAssignModal = () => {
		setIsAssignModalOpen(false);
		setSelectedReminderId(null);
	};

	const renderReminderCard = (reminder: ReminderGetGridDto) => {
		const isCompleted = reminder.IsCompleted;
		const endDateText = formatReminderDate(reminder.EndDate);

		return (
			<CardTable>
				<div
					className={`flex flex-col xl:flex-row items-stretch justify-between w-full rounded-xl ${
						isCompleted ? "bg-emerald-50/60" : "bg-white"
					}`}
				>
					<div
						className="p-5 flex items-start sm:items-center gap-4 flex-1 cursor-pointer hover:bg-slate-50 transition-colors min-w-0 rounded-r-xl"
						title="برای مشاهده جزئیات کلیک کنید"
					>
						<div
							className={`p-3.5 rounded-2xl border shrink-0 ${
								isCompleted ? "bg-emerald-50 border-emerald-100" : "bg-indigo-50 border-indigo-100"
							}`}
						>
							<Bell className={`w-6 h-6 ${isCompleted ? "text-emerald-600" : "text-indigo-600"}`} />
						</div>

						<div className="flex flex-col gap-2 flex-1 min-w-0">
							<div className="flex flex-wrap items-center gap-2 min-w-0">
								<h3 className="font-bold text-base sm:text-lg text-slate-800 wrap-break-word">
									{reminder.Title || "بدون عنوان"}
								</h3>

								{reminder.Title && <CopyToClipboard textToCopy={reminder.Title} size={12} />}

								<div className="flex items-center gap-1.5 mr-2">
									<span
										className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
											isCompleted
												? "bg-emerald-100 text-emerald-700"
												: "bg-amber-100 text-amber-700"
										}`}
									>
										{isCompleted ? "انجام شده" : "در انتظار انجام"}
									</span>

									{reminder.TypeName && (
										<span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-100 text-blue-700">
											{reminder.TypeName}
										</span>
									)}
								</div>
							</div>

							<p className="text-sm text-slate-600 leading-7 line-clamp-2">
								{reminder.Description || "توضیحاتی برای این یادآور ثبت نشده است."}
							</p>

							<div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium mt-1">
								<ReminderInfoBadge
									icon={<User className="w-3.5 h-3.5 text-slate-400" />}
									value={reminder.UserFullName}
									emptyText="کاربر ثبت نشده"
								/>

								<ReminderInfoBadge
									icon={<CalendarClock className="w-3.5 h-3.5 text-slate-400" />}
									value={endDateText}
									emptyText="تاریخ پایان ثبت نشده"
								/>

								<ReminderInfoBadge
									icon={<ClipboardList className="w-3.5 h-3.5 text-slate-400" />}
									value={reminder.TypeName}
									emptyText="نوع یادآور ثبت نشده"
								/>
							</div>
						</div>
					</div>

					<div className="p-3 sm:p-5 border-t xl:border-t-0 xl:border-r border-slate-100 bg-slate-50/60 xl:bg-transparent shrink-0">
						<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2 xl:w-40">
							<Button
								variant="outline"
								className="h-10 justify-center gap-1.5 px-2 text-xs sm:text-sm border-violet-200 text-violet-700 hover:bg-violet-50 bg-white transition-colors"
								onClick={(e) => {
									e.stopPropagation();
									handleOpenAssign(reminder.Id);
								}}
							>
								<UserCheck className="w-4 h-4 shrink-0 text-violet-700" />
								<span>ارجاع</span>
							</Button>

							<Button
								variant="outline"
								className={`h-10 justify-center gap-1.5 px-2 text-xs sm:text-sm bg-white transition-colors ${
									isCompleted
										? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
										: "border-amber-200 text-amber-700 hover:bg-amber-50"
								}`}
							>
								{isCompleted ? (
									<CheckCircle2 className="w-4 h-4 shrink-0" />
								) : (
									<XCircle className="w-4 h-4 shrink-0" />
								)}
								<span>{isCompleted ? "انجام شده" : "انجام نشده"}</span>
							</Button>
						</div>
					</div>
				</div>
			</CardTable>
		);
	};

	return (
		<PageCard>
			<HraderTitle
				title="مدیریت یادآورها"
				description="مشاهده، جستجو و انجام عملیات روی یادآورها"
				icon={<Bell />}
			/>

			<PageCardContent>
				<DataGrid<ReminderGetGridDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
					<Column<ReminderGetGridDto>
						field="Id"
						filterable={false}
						header="ترتیب پیش فرض"
						render={(reminder) => renderReminderCard(reminder)}
					/>

					<Column<ReminderGetGridDto> field="Title" header="عنوان" sortable render={() => null} />

					<Column<ReminderGetGridDto> field="UserFullName" header="کاربر" sortable render={() => null} />

					<Column<ReminderGetGridDto> field="TypeName" header="نوع یادآور" sortable render={() => null} />

					<Column<ReminderGetGridDto> field="EndDate" header="تاریخ پایان" sortable render={() => null} />
				</DataGrid>
			</PageCardContent>

			<Popup
				show={isAssignModalOpen}
				onClose={handleCloseAssignModal}
				title="ارجاع یادآوری"
				description="انتخاب کارمند مقصد برای ارجاع یادآوری"
				fullScreen
			>
				{selectedReminderId && (
					<ReminderAssignUserForm
						reminderId={selectedReminderId}
						onClose={handleCloseAssignModal}
						onSuccess={() => {
							handleCloseAssignModal();
							reloadGrid();
						}}
					/>
				)}
			</Popup>
		</PageCard>
	);
}

interface ReminderInfoBadgeProps {
	icon: React.ReactNode;
	value?: string | null;
	emptyText: string;
}

function ReminderInfoBadge({ icon, value, emptyText }: ReminderInfoBadgeProps) {
	const normalizedValue = value?.trim();

	return (
		<div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm w-fit max-w-full">
			{icon}

			<span className={`truncate ${normalizedValue ? "text-slate-700" : "text-slate-400"}`}>
				{normalizedValue || emptyText}
			</span>

			{normalizedValue && <CopyToClipboard textToCopy={normalizedValue} size={12} />}
		</div>
	);
}

function formatReminderDate(date?: string | Date | null) {
	if (!date) {
		return null;
	}

	const parsedDate = new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		return null;
	}

	return new Intl.DateTimeFormat("fa-IR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(parsedDate);
}
