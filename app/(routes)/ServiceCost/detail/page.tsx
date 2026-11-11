"use client";

import { CheckCircle2, CircleDollarSign, Edit, Plus, XOctagon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { ServiceCostGetGuildIdDto } from "@/dataBinding/models/ServiceCost/ServiceCostGetGuildIdDto";
import { ServiceCostService } from "@/dataBinding/services/ServiceCost/ServiceCostService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

import AddServiceCostForm from "../AddServiceCostForm";
import ServiceCostEditForm from "../ServiceCostEditForm";

function ServiceCostPageContent() {
	const searchParams = useSearchParams();
	const guildId = Number(searchParams.get("id"));

	const gridRef = useRef<DataGridRef>(null);

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedServiceCostId, setSelectedServiceCostId] = useState<number | null>(null);

	const fetchServiceCosts = async (currentGridParams: BaseGrid) => {
		return await ServiceCostService.Get(currentGridParams, guildId);
	};

	const handleEditClick = (id: number) => {
		setSelectedServiceCostId(id);
		setIsEditModalOpen(true);
	};

	return (
		<PageCard>
			<HraderTitle
				title="مدیریت تعرفه‌ها"
				description="مشاهده، ثبت و ویرایش تعرفه‌های خدمات"
				icon={<CircleDollarSign />}
			/>

			<PageCardContent>
				<div className="flex w-full md:w-auto gap-3">
					<Button onClick={() => setIsAddModalOpen(true)} disabled={!guildId || isNaN(guildId)}>
						<Plus className="w-5 h-5" />
						افزودن هزینه خدمات
					</Button>
				</div>

				<div className="flex flex-col gap-4">
					<DataGrid<ServiceCostGetGuildIdDto> ref={gridRef} fetchFunction={fetchServiceCosts} layout="grid">
						<Column<ServiceCostGetGuildIdDto>
							field="Id"
							filterable={false}
							header="ترتیب پیش فرض"
							render={(item, index) => {
								return (
									<CardTable
										key={`${item.Id}-${index}`}
										className="bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
									>
										<div className="p-3 md:p-5">
											<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
												<div className="flex items-center gap-4 flex-1 w-full">
													<div className="bg-indigo-50 p-1.5 rounded-sm md:rounded-2xl border border-indigo-100 shrink-0">
														<CircleDollarSign className="text-indigo-600 md:w-6 md:h-6 w-4 h-4" />
													</div>

													<div className="flex flex-col gap-1.5 flex-1 min-w-0">
														<div className="flex items-center gap-3">
															<h3 className="font-bold text-lg text-slate-800 wrap-break-word">
																{item.Title}
															</h3>
														</div>
														{item.Description && (
															<p className="text-sm text-slate-500 truncate">
																{item.Description}
															</p>
														)}
													</div>
												</div>

												<div className="mt-4 sm:mt-0 w-full sm:w-auto flex justify-end">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleEditClick(item.Id)}
														className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1.5 w-full sm:w-auto"
													>
														<Edit className="w-4 h-4" />
														ویرایش
													</Button>
												</div>
											</div>

											<div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 text-sm text-slate-500 font-medium mt-4 w-full">
												<div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 shadow-sm w-fit">
													<span className="text-slate-500 text-xs">مبلغ:</span>
													<span className="text-indigo-700 font-bold">
														{item.Price ? item.Price.toLocaleString() : 0}{" "}
														<span className="text-xs font-normal">ریال</span>
													</span>
												</div>

												<div
													className={`flex items-center gap-1.5 px-2 py-1 rounded-md border shadow-sm w-fit ${item.IsActive ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}
												>
													{item.IsActive ? (
														<CheckCircle2 className="w-3.5 h-3.5" />
													) : (
														<XOctagon className="w-3.5 h-3.5" />
													)}
													<span className="text-xs font-bold">
														{item.IsActive ? "فعال" : "غیرفعال"}
													</span>
												</div>

												{item.AllowCustomPrice && (
													<div className="flex items-center gap-1.5 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-200 shadow-sm w-fit">
														<span className="text-indigo-700 text-xs font-bold">
															قیمت دلخواه کاربر
														</span>
													</div>
												)}
											</div>
										</div>
									</CardTable>
								);
							}}
						/>
					</DataGrid>
				</div>
			</PageCardContent>
			<Popup show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="افزودن هزینه خدمات" fullScreen>
				<AddServiceCostForm
					guildId={guildId}
					onClose={() => setIsAddModalOpen(false)}
					onSuccess={() => {
						setIsAddModalOpen(false);
						gridRef.current?.reload?.();
					}}
				/>
			</Popup>

			<Popup
				show={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title="ویرایش هزینه خدمات"
				fullScreen
			>
				{selectedServiceCostId && (
					<ServiceCostEditForm
						serviceCostId={selectedServiceCostId}
						onClose={() => setIsEditModalOpen(false)}
						onSuccess={() => {
							setIsEditModalOpen(false);
							gridRef.current?.reload?.();
						}}
					/>
				)}
			</Popup>
		</PageCard>
	);
}

export default function ServiceCostPage() {
	return (
		<Suspense fallback={<div className="flex h-screen items-center justify-center">در حال بارگذاری...</div>}>
			<ServiceCostPageContent />
		</Suspense>
	);
}
