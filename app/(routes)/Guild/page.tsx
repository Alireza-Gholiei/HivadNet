"use client";

import { Bell, BellOff, ChevronDown, CircleDollarSign, Edit, FolderTree, MonitorCog, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { GuildGetGridDto } from "@/dataBinding/models/Guild/GuildGetGridDto";
import { GuildService } from "@/dataBinding/services/Guild/GuildService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

import AddServiceCostForm from "../ServiceCost/AddServiceCostForm";
import GuildAddForm from "./GuildAddForm";
import GuildEditForm from "./GuildEditForm";

export default function GuildGridPage() {
	const router = useRouter();

	const gridRef = useRef<DataGridRef>(null);

	const [expandedGuildId, setExpandedGuildId] = useState<number | null>(null);

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const [isAddServiceCostModalOpen, setIsAddServiceCostModalOpen] = useState(false);

	const [selectedGuildId, setSelectedGuildId] = useState<number | null>(null);

	const toggleGuildDetails = (id: number) => {
		setExpandedGuildId((prev) => (prev === id ? null : id));
	};

	const handleEditClick = (id: number) => {
		setSelectedGuildId(id);
		setIsEditModalOpen(true);
	};

	const handleAddServiceCostClick = (id: number) => {
		setSelectedGuildId(id);
		setIsAddServiceCostModalOpen(true);
	};

	const fetchData = async (params: BaseGrid) => {
		return await GuildService.GetGrid(params);
	};

	return (
		<PageCard>
			<HraderTitle title="مدیریت سامانه‌ها" description="مشاهده و مدیریت سامانه‌های فعال" icon={<MonitorCog />} />

			<PageCardContent>
				<div className="flex w-full md:w-auto gap-3">
					<Button onClick={() => setIsAddModalOpen(true)}>
						<Plus className="w-5 h-5" />
						ثبت سامانه جدید
					</Button>
				</div>

				<DataGrid<GuildGetGridDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
					<Column<GuildGetGridDto>
						field="Id"
						filterable={false}
						header="ترتیب پیش فرض"
						render={(guild) => {
							const isExpanded = expandedGuildId === guild.Id;

							return (
								<CardTable
									key={guild.Id}
									onClick={() => toggleGuildDetails(guild.Id)}
									className={`bg-white border-slate-200 shadow-sm transition-all duration-200 cursor-pointer overflow-hidden
								hover:shadow-md hover:border-indigo-200
								${isExpanded ? "ring-2 ring-indigo-100 border-indigo-300 shadow-md" : ""}`}
								>
									<div className="p-4">
										<div className="flex items-center gap-4">
											<div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100">
												<MonitorCog className="text-indigo-600 w-5 h-5" />
											</div>

											<div className="flex-1">
												<h3 className="font-bold text-lg text-slate-800">{guild.Name}</h3>

												<div className="flex gap-2 mt-2">
													<div className="text-xs bg-white border px-2 py-1 rounded">
														تعداد فیلدها: {guild.FieldsCount}
													</div>
												</div>
											</div>

											<div className="flex flex-col gap-2">
												<Button
													size="sm"
													variant="outline"
													className="text-green-600"
													onClick={(e) => {
														e.stopPropagation();
														handleEditClick(guild.Id);
													}}
												>
													<Edit className="w-4 h-4 ml-1" />
													ویرایش
												</Button>

												<Button
													size="sm"
													variant="outline"
													className="text-cyan-600"
													onClick={(e) => {
														e.stopPropagation();
														router.push(`/Guild/Group?id=${guild.Id}`);
													}}
												>
													<FolderTree className="w-4 h-4 ml-1" />
													مدیریت گروه‌ها
												</Button>

												<Button
													size="sm"
													variant="outline"
													className="text-amber-700"
													onClick={(e) => {
														e.stopPropagation();
														handleAddServiceCostClick(guild.Id);
													}}
												>
													<Plus className="w-4 h-4 ml-1" />
													افزودن تعرفه خدمت
												</Button>

												<Button
													size="sm"
													variant="outline"
													className="text-indigo-600"
													onClick={(e) => {
														e.stopPropagation();
														router.push(`/ServiceCost/detail?id=${guild.Id}`);
													}}
												>
													<CircleDollarSign className="w-4 h-4 ml-1 text-indigo-600" />
													مدیریت تعرفه‌ها
												</Button>

												<Button
													size="sm"
													variant="outline"
													onClick={(e) => {
														e.stopPropagation();
														toggleGuildDetails(guild.Id);
													}}
												>
													<ChevronDown
														className={`w-4 h-4 transition-transform ${
															isExpanded ? "rotate-180" : ""
														}`}
													/>
												</Button>
											</div>
										</div>

										{isExpanded && (
											<div className="mt-4 border-t pt-4" onClick={(e) => e.stopPropagation()}>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
													{guild.Groups?.map((group) => (
														<div
															key={group.Id}
															className="rounded-xl border bg-slate-50 p-3"
														>
															<div className="font-semibold text-sm">{group.Name}</div>

															<div className="flex flex-wrap gap-2 mt-2 text-xs">
																<div className="border px-2 py-1 rounded">
																	فیلدها: {group.FieldsCount}
																</div>

																<div
																	className={`px-2 py-1 rounded border flex items-center gap-1 ${group.IsReminder ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}
																>
																	{group.IsReminder ? (
																		<Bell className="w-3 h-3" />
																	) : (
																		<BellOff className="w-3 h-3" />
																	)}

																	<span>
																		{group.IsReminder
																			? "دارای یادآور"
																			: "بدون یادآور"}
																	</span>
																</div>

																{group.ReminderType && (
																	<div className="bg-indigo-50 border border-indigo-200 px-2 py-1 rounded">
																		{group.ReminderType}
																	</div>
																)}
															</div>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								</CardTable>
							);
						}}
					/>
					<Column<GuildGetGridDto> field="Name" header="نام" sortable render={() => null} />
				</DataGrid>
			</PageCardContent>
			<Popup show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="ثبت سامانه جدید" fullScreen>
				<GuildAddForm
					onClose={() => setIsAddModalOpen(false)}
					onSuccess={() => {
						setIsAddModalOpen(false);
						gridRef.current?.reload?.();
					}}
				/>
			</Popup>

			<Popup
				show={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedGuildId(null);
				}}
				title="ویرایش سامانه"
				fullScreen
			>
				{selectedGuildId && (
					<GuildEditForm
						guildId={selectedGuildId}
						onClose={() => {
							setIsEditModalOpen(false);
							setSelectedGuildId(null);
						}}
						onSuccess={() => {
							setIsEditModalOpen(false);
							setSelectedGuildId(null);
							gridRef.current?.reload?.();
						}}
					/>
				)}
			</Popup>

			<Popup
				show={isAddServiceCostModalOpen}
				onClose={() => {
					setIsAddServiceCostModalOpen(false);
					setSelectedGuildId(null);
				}}
				title="افزودن تعرفه خدمت"
				fullScreen
			>
				{selectedGuildId && (
					<AddServiceCostForm
						guildId={selectedGuildId}
						onClose={() => {
							setIsAddServiceCostModalOpen(false);
							setSelectedGuildId(null);
						}}
						onSuccess={() => {
							setIsAddServiceCostModalOpen(false);
							setSelectedGuildId(null);
						}}
					/>
				)}
			</Popup>
		</PageCard>
	);
}
