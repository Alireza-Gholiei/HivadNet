"use client";

import { Edit, FolderTree, MonitorCog, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { GuildGroupGetGridDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetGridDto";
import { GuildGroupService } from "@/dataBinding/services/Guild/GuildGroupService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

import GuildGroupAddForm from "./GuildGroupAddForm";
import GuildGroupEditForm from "./GuildGroupEditForm";

function GuildGroupPageContent() {
	const searchParams = useSearchParams();
	const guildId = Number(searchParams.get("id"));
	const gridRef = useRef<DataGridRef>(null);

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedGuildGroupId, setSelectedGuildGroupId] = useState<number | null>(null);

	const fetchData = async (params: BaseGrid) => {
		return await GuildGroupService.GetGrid(params, guildId);
	};

	const handleEditClick = (id: number) => {
		setSelectedGuildGroupId(id);
		setIsEditModalOpen(true);
	};

	return (
		<PageCard>
			<HraderTitle
				title="مدیریت گروه‌ها"
				description="مشاهده و مدیریت گروه‌بندی سامانه‌ها"
				icon={<FolderTree />}
			/>

			<PageCardContent>
				<div className="flex gap-3">
					<Button onClick={() => setIsAddModalOpen(true)}>
						<Plus className="w-5 h-5" />
						ثبت گروه سامانه جدید
					</Button>
				</div>
				<DataGrid<GuildGroupGetGridDto>
					ref={gridRef}
					fetchFunction={fetchData}
					layout="grid"
					externalFilters={{ GuildId: guildId }}
				>
					<Column<GuildGroupGetGridDto>
						field="Id"
						filterable={false}
						header="ترتیب پیش فرض"
						render={(guild) => (
							<CardTable
								key={guild.Id}
								className="bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
							>
								<div className="p-3 md:p-5">
									<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
										<div className="flex items-center gap-4 flex-1 w-full">
											<div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100 shrink-0">
												<MonitorCog className="text-indigo-600 w-5 h-5" />
											</div>

											<div className="flex flex-col flex-1 min-w-0">
												<h3 className="font-bold text-lg text-slate-800 wrap-break-word">
													{guild.Name}
												</h3>
											</div>
										</div>

										<div className="w-full sm:w-auto flex justify-end">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleEditClick(guild.Id)}
												className="text-green-600 border-green-200 hover:bg-indigo-50 flex items-center gap-1.5"
											>
												<Edit className="w-4 h-4" />
												ویرایش
											</Button>
										</div>
									</div>
									<div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 text-sm text-slate-500 font-medium mt-2 w-full">
										<div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm w-fit">
											<span className="text-slate-500 text-xs">تعداد فیلدها:</span>
											<span className="text-slate-700 font-bold">{guild.FieldsCount}</span>
										</div>

										<div
											className={`flex items-center gap-1.5 px-2 py-1 rounded-md border shadow-sm w-fit ${guild.IsReminder ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}
										>
											<span className="text-xs font-bold">
												{guild.IsReminder ? "دارای یادآور" : "بدون یادآور"}
											</span>
										</div>

										{guild.IsReminder && guild.ReminderType && (
											<div className="flex items-center gap-1.5 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-200 shadow-sm w-fit">
												<span className="text-indigo-700 text-xs font-bold">
													{guild.ReminderType}
												</span>
											</div>
										)}
									</div>
								</div>
							</CardTable>
						)}
					/>
					<Column<GuildGroupGetGridDto> field="Name" header="نام" sortable render={() => null} />
				</DataGrid>
			</PageCardContent>
			<Popup
				show={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				title="ثبت گروه سامانه جدید"
				fullScreen
			>
				<GuildGroupAddForm
					GuildId={guildId}
					onClose={() => setIsAddModalOpen(false)}
					onSuccess={() => {
						setIsAddModalOpen(false);
						gridRef.current?.reload();
					}}
				/>
			</Popup>

			<Popup
				show={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedGuildGroupId(null);
				}}
				title="ویرایش گروه سامانه"
				fullScreen
			>
				{selectedGuildGroupId !== null && (
					<GuildGroupEditForm
						guildGroupId={selectedGuildGroupId}
						onClose={() => {
							setIsEditModalOpen(false);
							setSelectedGuildGroupId(null);
						}}
						onSuccess={() => {
							setIsEditModalOpen(false);
							setSelectedGuildGroupId(null);
							gridRef.current?.reload();
						}}
					/>
				)}
			</Popup>
		</PageCard>
	);
}

export default function GuildGroupPage() {
	return (
		<Suspense fallback={<div className="flex h-screen items-center justify-center">در حال بارگذاری...</div>}>
			<GuildGroupPageContent />
		</Suspense>
	);
}
