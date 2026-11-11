"use client";

import { Eye, Network, Shield, ShieldEllipsis, Users } from "lucide-react";
import { useRef } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { RoleGetGridDto } from "@/dataBinding/models/Role/RoleGetGridDto";
import { RoleService } from "@/dataBinding/services/Role/RoleService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

export default function RoleShowGridPage() {
	const gridRef = useRef<DataGridRef>(null);

	const fetchData = async (params: BaseGrid) => {
		return await RoleService.GetGrid(params);
	};

	return (
		<PageCard>
			<HraderTitle title="فهرست نقش ها" description="مشاهده تمامی نقش‌های ثبت شده" icon={<Eye />} />

			<PageCardContent>
				<DataGrid<RoleGetGridDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
					<Column<RoleGetGridDto>
						field="Id"
						filterable={false}
						header="ترتیب پیش فرض"
						render={(role) => {
							return (
								<CardTable
									key={role.Id}
									className="bg-white border-slate-200 shadow-sm transition-all duration-200 cursor-pointer overflow-hidden hover:shadow-md hover:border-indigo-200"
								>
									<div className="p-4">
										<div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
											<div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 hidden sm:flex items-center justify-center">
												<ShieldEllipsis className="text-indigo-600 w-6 h-6" />
											</div>

											<div className="flex-1 space-y-2">
												<h3 className="font-bold text-lg text-slate-800">{role.Name}</h3>
												<div className="text-sm text-slate-500 flex items-center gap-2">
													<Network className="w-4 h-4 text-slate-400" />
													<span className="font-medium text-slate-600">نقش والد: </span>
													{role.RoleParentName || "بدون والد (گره اصلی)"}
												</div>

												<div className="flex items-center gap-2 mt-2 flex-wrap">
													<span
														className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
															role.AccessAll
																? "bg-green-100 text-green-800"
																: "bg-orange-100 text-orange-800"
														}`}
													>
														<Shield className="w-3 h-3 ml-1" />
														{role.AccessAll ? "دسترسی کامل" : "دسترسی محدود"}
													</span>

													<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
														<Users className="w-3 h-3 ml-1" />
														کاربران: {role.UserRolesCount}
													</span>

													<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
														زیرنقش‌ها: {role.RoleChildrenCount}
													</span>
												</div>
											</div>
										</div>
									</div>
								</CardTable>
							);
						}}
					/>
					<Column<RoleGetGridDto> field="Name" header="نام" sortable render={() => null} />
				</DataGrid>
			</PageCardContent>
		</PageCard>
	);
}
