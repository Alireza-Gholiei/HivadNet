"use client";

import { ArrowRightLeft, CalendarDays, ClipboardClock, Clock, LogIn, LogOut, Phone, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import UserSelector from "@/components/user/UserSelector";
import { TimesheetGetById } from "@/dataBinding/models/Timesheet/TimesheetGetById";
import { UserGetGridDto } from "@/dataBinding/models/User/UserGetGridDto";
import { TimesheetService } from "@/dataBinding/services/Timesheet/TimesheetService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

export default function AllUsersTimesheet() {
	const gridRef = useRef<DataGridRef>(null);

	const [selectedUser, setSelectedUser] = useState<UserGetGridDto | null>(null);

	useEffect(() => {
		gridRef.current?.reload?.();
	}, [selectedUser]);

	const fetchData = async (params: BaseGrid) => {
		return await TimesheetService.GetById(selectedUser?.Id ?? 0, params);
	};

	return (
		<PageCard>
			<HraderTitle
				title="تردد کارکنان"
				description="مشاهده و مدیریت تردد تمامی کارکنان"
				icon={<ClipboardClock />}
			/>

			<PageCardContent>
				<UserSelector value={selectedUser} onChange={setSelectedUser} label="انتخاب کاربر" required />

				{!selectedUser ? (
					<div className="flex-1 flex flex-col justify-center items-center text-slate-400 py-12 bg-white rounded-lg border border-dashed border-slate-300">
						<ArrowRightLeft className="w-12 h-12 mb-3 opacity-50" />
						<p>ابتدا یک کاربر انتخاب کنید</p>
					</div>
				) : (
					<DataGrid<TimesheetGetById> ref={gridRef} fetchFunction={fetchData} layout="grid">
						<Column<TimesheetGetById>
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
				)}
			</PageCardContent>
		</PageCard>
	);
}
