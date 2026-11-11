"use client";

import { Eye, User } from "lucide-react";
import { useRef } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { UserGetGridDto } from "@/dataBinding/models/User/UserGetGridDto";
import { UserService } from "@/dataBinding/services/User/UserService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

export default function UserListShow() {
	const gridRef = useRef<DataGridRef>(null);

	const fetchData = async (params: BaseGrid) => {
		return await UserService.GetGrid(params);
	};

	return (
		<PageCard>
			<HraderTitle title="فهرست کاربران" description="مشاهده و جستجوی کاربران ثبت شده" icon={<Eye />} />

			<PageCardContent>
				<DataGrid<UserGetGridDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
					<Column<UserGetGridDto>
						field="Id"
						filterable={false}
						header="ترتیب پیش فرض"
						render={(user) => {
							const isLockedOut = user.LockoutEnabled?.toLowerCase() === "قفل شده";

							return (
								<CardTable
									key={user.Id}
									className="bg-white border-slate-200 shadow-sm transition-all duration-200 cursor-pointer overflow-hidden hover:shadow-md hover:border-indigo-200"
								>
									<div className="p-4">
										<div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
											<div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 hidden sm:block">
												<User className="text-indigo-600 w-6 h-6" />
											</div>

											<div className="flex-1 space-y-1">
												<h3 className="font-bold text-lg text-slate-800">{user.FullName}</h3>
												<div className="text-sm text-slate-500">
													<span className="font-medium text-slate-600">نام کاربری: </span>
													{user.UserName}
												</div>
												<div className="flex items-center gap-2 mt-2">
													<span
														className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${isLockedOut ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
													>
														{isLockedOut ? "غیرفعال / مسدود" : "فعال"}
													</span>
													<span className="text-xs text-slate-400">
														عضویت: {user.CreateDate}
													</span>
												</div>
											</div>
										</div>
									</div>
								</CardTable>
							);
						}}
					/>
					<Column<UserGetGridDto> field="UserName" header="نام کاربری" sortable render={() => null} />
					<Column<UserGetGridDto> field="FirstName" header="نام" sortable render={() => null} />
					<Column<UserGetGridDto> field="LastName" header="نام خانوادگی" sortable render={() => null} />
				</DataGrid>
			</PageCardContent>
		</PageCard>
	);
}
