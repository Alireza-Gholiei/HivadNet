"use client";

import { CalendarDays, Clock, Loader2, LogIn, LogOut, Phone, User } from "lucide-react";
import { useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { TimesheetGet } from "@/dataBinding/models/Timesheet/TimesheetGet";
import { TimesheetService } from "@/dataBinding/services/Timesheet/TimesheetService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import { Button } from "@/utilities/components/ui/button";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

export default function MyTimesheet() {
	const gridRef = useRef<DataGridRef>(null);
	const [isEntryLoading, setIsEntryLoading] = useState(false);
	const [isExitLoading, setIsExitLoading] = useState(false);

	const fetchData = async (params: BaseGrid) => {
		return await TimesheetService.Get(params);
	};

	const handleEntry = async () => {
		try {
			setIsEntryLoading(true);
			const result = await TimesheetService.RegisterEntry();

			if (result) {
				Messenger.successAlert("ورود شما با موفقیت ثبت شد");
				gridRef.current?.reload?.();
			}
		} finally {
			setIsEntryLoading(false);
		}
	};

	const handleExit = async () => {
		try {
			setIsExitLoading(true);
			const result = await TimesheetService.RegisterExit();

			if (result) {
				Messenger.successAlert("خروج شما با موفقیت ثبت شد");
				gridRef.current?.reload?.();
			}
		} finally {
			setIsExitLoading(false);
		}
	};

	return (
		<PageCard className="flex flex-col h-full bg-slate-50 p-4 rounded-xl">
			<HraderTitle title="تردد من" description="مشاهده سوابق ورود و خروج شخصی" icon={<Clock />} />

			<PageCardContent>
				<div className="flex flex-wrap items-center gap-3">
					<Button
						type="button"
						onClick={() => void handleEntry()}
						disabled={isEntryLoading || isExitLoading}
						style={{ backgroundColor: "#059669", color: "#fff", borderColor: "#047857" }}
						className="inline-flex min-w-35 items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold shadow-md transition-all hover:opacity-90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isEntryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
						<span>ثبت ورود</span>
					</Button>

					<Button
						type="button"
						onClick={() => void handleExit()}
						disabled={isEntryLoading || isExitLoading}
						style={{ backgroundColor: "#e11d48", color: "#fff", borderColor: "#be123c" }}
						className="inline-flex min-w-35 items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold shadow-md transition-all hover:opacity-90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isExitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
						<span>ثبت خروج</span>
					</Button>
				</div>

				<br />

				<DataGrid<TimesheetGet> ref={gridRef} fetchFunction={fetchData} layout="grid">
					<Column<TimesheetGet>
						field="Id"
						filterable={false}
						header="ترتیب پیش فرض"
						render={(sheet) => (
							<CardTable className="p-5 flex flex-col gap-4 hover:shadow-md transition-shadow bg-white border-slate-200">
								<div className="flex items-start justify-between border-b border-slate-100 pb-3">
									<div className="flex items-center gap-3">
										<div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 border border-indigo-100">
											<User className="w-5 h-5" />
										</div>
										<div className="flex flex-col">
											<span className="font-bold text-base text-slate-800">
												{`${sheet.FirstName} ${sheet.LastName}`}
											</span>
											<div className="flex items-center gap-1 mt-1 text-slate-500">
												<Phone className="w-3.5 h-3.5" />
												<span className="text-xs font-medium" dir="ltr">
													{sheet.PhoneNumber || "---"}
												</span>
											</div>
										</div>
									</div>
									<div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-md flex items-center gap-1.5">
										<CalendarDays className="w-4 h-4 text-slate-500" />
										<span className="text-xs font-bold text-slate-700" dir="ltr">
											{sheet.Date}
										</span>
									</div>
								</div>

								<div className="mt-auto pt-1 flex items-center justify-between gap-4 text-sm">
									<div className="flex flex-col gap-1 flex-1 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
										<div className="flex items-center gap-1.5 text-emerald-600 mb-1">
											<LogIn className="w-4 h-4" />
											<span className="text-xs font-bold">زمان ورود</span>
										</div>
										<div className="flex items-center gap-1.5 text-slate-700">
											<Clock className="w-3.5 h-3.5 text-slate-400" />
											<span className="font-semibold text-sm" dir="ltr">
												{sheet.EntryTime || "--:--"}
											</span>
										</div>
									</div>

									<div className="flex flex-col gap-1 flex-1 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
										<div className="flex items-center gap-1.5 text-rose-600 mb-1">
											<LogOut className="w-4 h-4" />
											<span className="text-xs font-bold">زمان خروج</span>
										</div>
										<div className="flex items-center gap-1.5 text-slate-700">
											<Clock className="w-3.5 h-3.5 text-slate-400" />
											<span className="font-semibold text-sm" dir="ltr">
												{sheet.ExitTime || "--:--"}
											</span>
										</div>
									</div>
								</div>
							</CardTable>
						)}
					/>
				</DataGrid>
			</PageCardContent>
		</PageCard>
	);
}
