"use client";

import { CreditCard, Pencil, Phone, Plus, Settings } from "lucide-react";
import { useRef, useState } from "react";
import HraderTitle from "@/components/Shared/HraderTitle";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { CardTable } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";
import AppSettingAddForm from "./AppSettingAddForm";
import AppSettingEditForm from "./AppSettingEditForm";
import { SettingService } from "@/dataBinding/services/Setting/AppSetting/SettingService";
import { SettingGetGridDto } from "@/dataBinding/models/Setting/AppSetting/SettingDtos";

export default function SmsSettingGridPage() {
	const gridRef = useRef<DataGridRef>(null);

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState(0);

	const fetchData = async (params: BaseGrid) => {
		return await SettingService.GetGrid(params);
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
		<div className="p-4 bg-slate-50 min-h-screen">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<HraderTitle title="نمایش تنظیمات" description="لیست تنظیمات" icon={<Settings />} />
			</div>

			<div className="flex w-full md:w-auto gap-3 mb-6">
				<Button onClick={() => setIsAddModalOpen(true)}>
					<Plus className="w-5 h-5" />
					ثبت تنظیمات جدید
				</Button>
			</div>

			<DataGrid<SettingGetGridDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
				<Column<SettingGetGridDto>
					field="Id"
					filterable={false}
					header="نمایش"
					render={(item) => {
						return (
							<CardTable
								key={item.Id}
								className="bg-white border-slate-200 shadow-sm transition-all duration-200 overflow-hidden hover:shadow-md hover:border-indigo-200"
							>
								<div className="p-5">
									<div className="flex items-start gap-4">
										<div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
											<Settings className="w-6 h-6 text-indigo-600" />
										</div>

										<div className="flex-1 space-y-5">
											<div>
												<h3 className="text-lg font-bold text-slate-800">{item.Name}</h3>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
													<div className="flex items-center gap-2 text-slate-500 mb-2">
														<Phone className="w-4 h-4" />
														<span className="text-xs font-bold">شماره تلفن</span>
													</div>

													<p
														dir="ltr"
														className="text-sm font-semibold text-slate-800 text-left"
													>
														{item.Phone || "-"}
													</p>
												</div>

												<div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
													<div className="flex items-center gap-2 text-slate-500 mb-2">
														<CreditCard className="w-4 h-4" />
														<span className="text-xs font-bold">شماره کارت مجموعه</span>
													</div>

													<p
														dir="ltr"
														className="text-sm font-semibold text-slate-800 text-left"
													>
														{item.CardNumber || "-"}
													</p>
												</div>
											</div>

											<div className="flex justify-end pt-2">
												<Button
													type="button"
													onClick={() => openEditModal(item.Id)}
													className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
												>
													<Pencil className="w-4 h-4 mr-2" />
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

				<Column<SettingGetGridDto> field="Name" header="نام" render={() => null} />
				<Column<SettingGetGridDto> field="Phone" header="شماره" render={() => null} />
			</DataGrid>

			<Popup
				show={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				title="افزودن تنظیمات"
				description="اطلاعات تنظیمات را وارد کنید"
				fullScreen
			>
				<AppSettingAddForm
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
				title="ویرایش تنظیمات"
				description="اطلاعات تنظیمات را ویرایش کنید"
				fullScreen
			>
				{selectedId > 0 && (
					<AppSettingEditForm
						id={selectedId}
						onClose={closeEditModal}
						onSuccess={() => {
							closeEditModal();
							gridRef.current?.reload?.();
						}}
					/>
				)}
			</Popup>
		</div>
	);
}
