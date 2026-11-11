"use client";

import { CheckCircle2, Edit, FileText, Plus, XOctagon } from "lucide-react";
import { useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { SmsTemplateGetGridDto } from "@/dataBinding/models/Messaging/SmsTemplate/SmsTemplateDtos";
import { SmsTemplateService } from "@/dataBinding/services/Messaging/SmsTemplate/SmsTemplateService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

import SmsTemplateAddForm from "./SmsTemplateAddForm";
import SmsTemplateEditForm from "./SmsTemplateEditForm";

export default function GuildGridPage() {
	const gridRef = useRef<DataGridRef>(null);

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const [selectedId, setSelectedId] = useState<number | null>(null);

	const handleEditClick = (id: number) => {
		setSelectedId(id);
		setIsEditModalOpen(true);
	};

	const fetchData = async (params: BaseGrid) => {
		return await SmsTemplateService.GetGrid(params);
	};

	return (
		<PageCard>
			<HraderTitle title="مدیریت قالب ها" description="مشاهده و مدیریت قالب‌های پیامکی" icon={<FileText />} />

			<PageCardContent>
				<div className="flex w-full md:w-auto gap-3">
					<Button onClick={() => setIsAddModalOpen(true)}>
						<Plus className="w-5 h-5" />
						ثبت قالب جدید
					</Button>
				</div>

				<DataGrid<SmsTemplateGetGridDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
					<Column<SmsTemplateGetGridDto>
						field="Id"
						filterable={false}
						header="ترتیب پیش فرض"
						render={(item) => {
							return (
								<CardTable
									key={item.Id}
									className={`bg-white border-slate-200 shadow-sm transition-all duration-200 cursor-pointer overflow-hidden hover:shadow-md hover:border-indigo-200`}
								>
									<div className="p-4">
										<div className="flex items-center gap-4">
											<div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100">
												<FileText className="text-indigo-600 w-5 h-5" />
											</div>

											<div className="flex-1">
												<h3 className="font-bold text-lg text-slate-800">{item.Title}</h3>

												<div
													className={`flex items-center gap-1.5 px-2 py-1 rounded-md border shadow-sm w-fit ${
														item.IsActive
															? "bg-emerald-50 border-emerald-200 text-emerald-700"
															: "bg-rose-50 border-rose-200 text-rose-700"
													}`}
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
											</div>

											<div className="flex flex-col gap-2">
												<Button
													size="sm"
													variant="outline"
													className="text-green-700"
													onClick={(e) => {
														e.stopPropagation();
														handleEditClick(item.Id);
													}}
												>
													<Edit className="w-4 h-4 ml-1" />
													ویرایش
												</Button>
											</div>
										</div>
									</div>
								</CardTable>
							);
						}}
					/>
					<Column<SmsTemplateGetGridDto> field="Title" header="عنوان" render={() => null} />
					<Column<SmsTemplateGetGridDto>
						field="IsActive"
						header="وضعیت"
						filterable={false}
						render={() => null}
					/>
				</DataGrid>
			</PageCardContent>

			<Popup
				show={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				title="ثبت قالب جدید"
				description="ایجاد قالب جدید برای ارسال پیامک"
			>
				<SmsTemplateAddForm
					onClose={() => {
						setIsAddModalOpen(false);
						gridRef.current?.reload?.();
					}}
				/>
			</Popup>

			<Popup
				show={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedId(null);
				}}
				title="ویرایش قالب پیامک"
			>
				{selectedId && (
					<SmsTemplateEditForm
						id={selectedId}
						onClose={() => {
							setIsEditModalOpen(false);
							setSelectedId(null);
							gridRef.current?.reload?.();
						}}
					/>
				)}
			</Popup>
		</PageCard>
	);
}
