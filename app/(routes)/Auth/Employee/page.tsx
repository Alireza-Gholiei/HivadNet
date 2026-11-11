"use client";

import { Edit, Key, Shield, User2, UserPlus, UsersRound } from "lucide-react";
import { useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { UserGetGridDto } from "@/dataBinding/models/User/UserGetGridDto";
import { UserService } from "@/dataBinding/services/User/UserService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

import { UserAddForm } from "./UserAddForm";
import { UserChangePasswordForm } from "./UserChangePasswordForm";

export default function UserListGrid() {
	const gridRef = useRef<DataGridRef>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isChangePassword, setIsChangePassword] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState(0);

	const handleEdit = (id: number) => {
		setSelectedUserId(id);
	};

	const handleChangePassword = (id: number) => {
		setSelectedUserId(id);
		setIsChangePassword(true);
	};

	const handleToggleStatus = (id: number, currentStatus: string) => console.log("Toggle status:", id, currentStatus);

	const fetchData = async (params: BaseGrid) => {
		return await UserService.GetGrid(params);
	};

	return (
		<PageCard>
			<HraderTitle
				title="مدیریت کاربران"
				description="مشاهده و انجام عملیات مدیریتی روی کاربران"
				icon={<UsersRound />}
			/>

			<PageCardContent>
				<div className="flex w-full md:w-auto gap-3">
					<Button onClick={() => setIsAddModalOpen(true)}>
						<UserPlus className="w-5 h-5" />
						ثبت کاربر جدید
					</Button>
				</div>

				<DataGrid<UserGetGridDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
					<Column<UserGetGridDto>
						field="Id"
						filterable={false}
						header="ترتیب پیش فرض"
						render={(user) => {
							const isLockedOut = user.LockoutEnabled?.toLowerCase() === "قفل شده";

							return (
								<CardTable key={user.Id}>
									<div className="p-4">
										<div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
											<div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 hidden sm:block">
												<User2 className="text-indigo-600 w-6 h-6" />
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

											<div className="flex sm:flex-col flex-row flex-wrap gap-2 w-full sm:w-auto mt-4 sm:mt-0">
												<Button
													size="sm"
													variant="outline"
													onClick={(e) => {
														e.stopPropagation();
														handleEdit(user.Id);
													}}
												>
													<Edit className="w-4 h-4 ml-1 text-blue-600" />
													ویرایش
												</Button>

												<Button
													size="sm"
													variant="outline"
													onClick={(e) => {
														e.stopPropagation();
														handleChangePassword(user.Id);
													}}
												>
													<Key className="w-4 h-4 ml-1 text-emerald-600" />
													تغییر رمز
												</Button>
												{isLockedOut && (
													<Button
														size="sm"
														variant="outline"
														onClick={(e) => {
															e.stopPropagation();
															handleToggleStatus(user.Id, user.LockoutEnabled);
														}}
													>
														<Shield className="w-4 h-4 ml-1 text-green-600" /> فعال‌سازی
													</Button>
												)}
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

			<Popup show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="ثبت کاربر جدید" fullScreen>
				<UserAddForm
					onClose={() => setIsAddModalOpen(false)}
					onSuccess={() => {
						setIsAddModalOpen(false);
						gridRef.current?.reload?.();
					}}
				/>
			</Popup>

			<Popup show={isChangePassword} onClose={() => setIsChangePassword(false)} title="تغییر رمز عبور" fullScreen>
				<UserChangePasswordForm
					userId={selectedUserId}
					onClose={() => setIsChangePassword(false)}
					onSubmitSuccess={() => {
						setIsChangePassword(false);
						gridRef.current?.reload?.();
					}}
				/>
			</Popup>
		</PageCard>
	);
}
