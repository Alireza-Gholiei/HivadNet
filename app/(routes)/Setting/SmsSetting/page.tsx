"use client";

import { CheckCircle2, Pencil, Phone, Plus, Server, ShieldCheck, SlidersHorizontal, User, XCircle } from "lucide-react";
import { useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { SmsSettingGetGridDto } from "@/dataBinding/models/Setting/SmsSetting/SmsSettingDtos";
import { SmsSettingService } from "@/dataBinding/services/Setting/SmsSetting/SmsSettingService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

import SmsSettingAddForm from "./SmsSettingAddForm";
import SmsSettingEditForm from "./SmsSettingEditForm";

export default function SmsSettingGridPage() {
	const gridRef = useRef<DataGridRef>(null);

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState(0);

	const fetchData = async (params: BaseGrid) => {
		return await SmsSettingService.GetGrid(params);
	};

	const getDefaultStatusStyle = (isDefault: string) => {
		const normalizedValue = isDefault?.trim();

		if (
			normalizedValue === "true" ||
			normalizedValue === "True" ||
			normalizedValue === "1" ||
			normalizedValue === "بله" ||
			normalizedValue === "پیش‌فرض" ||
			normalizedValue === "فعال"
		) {
			return {
				label: "پیش‌فرض",
				className: "bg-emerald-50 border-emerald-200 text-emerald-700",
				icon: <CheckCircle2 className="w-3.5 h-3.5" />,
			};
		}

		return {
			label: "غیر پیش‌فرض",
			className: "bg-slate-50 border-slate-200 text-slate-600",
			icon: <XCircle className="w-3.5 h-3.5" />,
		};
	};

	const openEditModal = (id: number) => {
		setSelectedId(id);
		setIsEditModalOpen(true);
	};

	const closeEditModal = () => {
		setIsEditModalOpen(false);
		setSelectedId(0);
	};

	return (
		<PageCard>
			<HraderTitle
				title="مدیریت تنظیمات پیامک"
				description="مشاهده و بروزرسانی تنظیمات پیامکی"
				icon={<SlidersHorizontal />}
			/>

			<PageCardContent>
				<div className="flex w-full md:w-auto gap-3 mb-6">
					<Button onClick={() => setIsAddModalOpen(true)}>
						<Plus className="w-5 h-5" />
						ثبت پنل جدید
					</Button>
				</div>

				<DataGrid<SmsSettingGetGridDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
					<Column<SmsSettingGetGridDto>
						field="Id"
						filterable={false}
						header="نمایش"
						render={(item) => {
							const defaultStatusStyle = getDefaultStatusStyle(item.IsDefault);

							return (
								<CardTable
									key={item.Id}
									className="bg-white border-slate-200 shadow-sm transition-all duration-200 overflow-hidden hover:shadow-md hover:border-indigo-200"
								>
									<div className="p-4">
										<div className="flex items-start gap-4">
											<div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100">
												<SlidersHorizontal className="text-indigo-600 w-5 h-5" />
											</div>

											<div className="flex-1 space-y-4">
												<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
													<div>
														<h3 className="font-bold text-lg text-slate-800">
															{item.Name}
														</h3>
													</div>

													<div
														className={`flex items-center gap-1.5 px-2 py-1 rounded-md border shadow-sm w-fit ${defaultStatusStyle.className}`}
													>
														{defaultStatusStyle.icon}
														<span className="text-xs font-bold">
															{defaultStatusStyle.label}
														</span>
													</div>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
													<div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
														<div className="flex items-center gap-2 text-slate-500 mb-2">
															<Phone className="w-4 h-4" />
															<span className="text-xs font-bold">شماره ارسال</span>
														</div>

														<p
															dir="ltr"
															className="text-sm font-semibold text-slate-800 text-left"
														>
															{item.Number || "-"}
														</p>
													</div>

													<div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
														<div className="flex items-center gap-2 text-slate-500 mb-2">
															<User className="w-4 h-4" />
															<span className="text-xs font-bold">نام کاربری</span>
														</div>

														<p className="text-sm font-semibold text-slate-800">
															{item.Username || "-"}
														</p>
													</div>
												</div>

												<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-3">
													<div className="flex items-center gap-2 text-indigo-700">
														<Server className="w-4 h-4" />
														<span className="text-sm font-medium">نوع سرویس پیامکی</span>
													</div>

													<span className="w-fit rounded-lg border border-indigo-200 bg-white px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm">
														{item.Type || "-"}
													</span>
												</div>

												<div className="flex items-center gap-2 text-sm text-slate-500">
													<ShieldCheck className="w-4 h-4 text-slate-400" />
													<span>وضعیت پیش‌فرض:</span>
													<span className="font-semibold text-slate-700">
														{defaultStatusStyle.label}
													</span>
												</div>

												<div className="flex justify-end pt-2">
													<Button
														type="button"
														onClick={() => openEditModal(item.Id)}
														className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center gap-2 px-4 py-2"
													>
														<Pencil className="w-4 h-4" />
														ویرایش
													</Button>
												</div>
											</div>
										</div>
									</div>
								</CardTable>
							);
						}}
					/>

					<Column<SmsSettingGetGridDto> field="Name" header="نام" render={() => null} />
					<Column<SmsSettingGetGridDto> field="Number" header="شماره" render={() => null} />
					<Column<SmsSettingGetGridDto> field="Username" header="نام کاربری" render={() => null} />
					<Column<SmsSettingGetGridDto> field="Type" header="نوع" render={() => null} />
					<Column<SmsSettingGetGridDto> field="IsDefault" header="پیش‌فرض" render={() => null} />
				</DataGrid>
			</PageCardContent>

			<Popup
				show={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				title="افزودن تنظیمات پیامک"
				description="اطلاعات پنل پیامکی را وارد کنید"
				fullScreen
			>
				<SmsSettingAddForm
					onClose={() => setIsAddModalOpen(false)}
					onSuccess={() => {
						setIsAddModalOpen(false);
						gridRef.current?.reload?.();
					}}
				/>
			</Popup>

			<Popup
				show={isEditModalOpen}
				onClose={closeEditModal}
				title="ویرایش تنظیمات پیامک"
				description="اطلاعات پنل پیامکی را ویرایش کنید"
				fullScreen
			>
				{selectedId > 0 && (
					<SmsSettingEditForm
						id={selectedId}
						onClose={closeEditModal}
						onSuccess={() => {
							closeEditModal();
							gridRef.current?.reload?.();
						}}
					/>
				)}
			</Popup>
		</PageCard>
	);
}
