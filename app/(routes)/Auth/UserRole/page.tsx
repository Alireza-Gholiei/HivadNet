"use client";

import { Plus, Shield, ShieldEllipsis, Trash2, User } from "lucide-react";
import { useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { UserRoleGetGridDto } from "@/dataBinding/models/User/UserRole/UserRoleGetGridDto";
import { UserRoleService } from "@/dataBinding/services/User/UserRoleService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

import UserRoleAddForm from "./UserRoleAddForm";

export default function UserRoleGridPage() {
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const gridRef = useRef<DataGridRef>(null);

	const fetchData = async (params: BaseGrid) => {
		return await UserRoleService.GetGrid(params);
	};

	const handleDelete = async (userId: number, roleId: number) => {
		if (window.confirm("آیا از حذف این نقش برای کاربر اطمینان دارید؟")) {
			await UserRoleService.Delete(userId, roleId);
			gridRef.current?.reload?.();
		}
	};

	return (
		<PageCard>
			<HraderTitle
				title="مدیریت دسترسی ها"
				description="تخصیص و مدیریت دسترسی کاربران و نقش‌ها"
				icon={<Shield />}
			/>

			<PageCardContent>
				<div className="flex w-full md:w-auto gap-3">
					<Button onClick={() => setIsAddModalOpen(true)}>
						<Plus className="w-5 h-5" />
						انتساب نقش جدید
					</Button>
				</div>

				<DataGrid<UserRoleGetGridDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
					<Column<UserRoleGetGridDto>
						field="Id"
						filterable={false}
						header="ترتیب پیش فرض"
						render={(userRole) => {
							return (
								<CardTable
									key={userRole.Id}
									className="bg-white border-slate-200 shadow-sm transition-all duration-200 cursor-default overflow-hidden hover:shadow-md hover:border-indigo-200"
								>
									<div className="p-4">
										<div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
											<div className="bg-slate-100 p-3 rounded-xl border border-slate-200 hidden sm:flex items-center justify-center">
												<User className="text-slate-600 w-6 h-6" />
											</div>

											<div className="flex-1 space-y-2">
												<h3 className="font-bold text-lg text-slate-800">
													{userRole.UserFullName}
												</h3>

												<div className="flex items-center gap-2 mt-2">
													<span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
														<ShieldEllipsis className="w-4 h-4 ml-1.5" />
														{userRole.RoleName}
													</span>
												</div>
											</div>

											<div className="flex sm:flex-col flex-row flex-wrap gap-2 w-full sm:w-auto mt-4 sm:mt-0">
												<Button
													size="sm"
													variant="destructive"
													onClick={(e) => {
														e.stopPropagation();
														void handleDelete(userRole.UserId, userRole.RoleId);
													}}
												>
													<Trash2 className="w-4 h-4 ml-2" />
													لغو دسترسی
												</Button>
											</div>
										</div>
									</div>
								</CardTable>
							);
						}}
					/>
				</DataGrid>
			</PageCardContent>

			<Popup
				show={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				title="انتساب نقش به کاربر"
				fullScreen
			>
				<UserRoleAddForm
					onClose={() => setIsAddModalOpen(false)}
					onSuccess={() => {
						setIsAddModalOpen(false);
						gridRef.current?.reload?.();
					}}
				/>
			</Popup>
		</PageCard>
	);
}
