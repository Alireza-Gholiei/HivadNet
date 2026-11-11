"use client";

import { Briefcase, Code, Eye, MapPin, Phone, Users } from "lucide-react";
import { useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { CustomerGetGridDto, CustomerType } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import CopyToClipboard from "@/utilities/components/copy/CopyToClipboard";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

import CustomerDetails from "../CustomerDetails";

export default function CustomersPage() {
	const [customers, setCustomers] = useState<CustomerGetGridDto[]>([]);

	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);

	const gridRef = useRef<DataGridRef>(null);

	const fetchData = async (params: BaseGrid) => {
		return await CustomerService.Get(params);
	};

	const handleOpenDetails = (id: number) => {
		setSelectedDetailId(id);
		setIsDetailsModalOpen(true);
	};

	return (
		<PageCard>
			<HraderTitle title="فهرست مشتریان" description="مشاهده و جستجوی تمامی مشتریان ثبت شده" icon={<Eye />} />

			<PageCardContent>
				<DataGrid<CustomerGetGridDto>
					ref={gridRef}
					fetchFunction={fetchData}
					onDataLoaded={(rows) => setCustomers(rows)}
					layout="grid"
				>
					<Column<CustomerGetGridDto>
						field="Id"
						filterable={false}
						header="ترتیب پیش فرض"
						render={(customer) =>
							!customers || customers.length === 0 ? null : (
								<CardTable>
									<div
										className={`flex flex-col xl:flex-row items-stretch justify-between w-full rounded-xl ${customer.Type === CustomerType.Vip ? "bg-sky-400/50 hover:bg-sky-500/50" : ""}`}
									>
										<div
											className="p-5 flex items-start sm:items-center gap-4 flex-1 cursor-pointer hover:bg-slate-50 transition-colors min-w-0 rounded-r-xl"
											onClick={() => handleOpenDetails(customer.Id)}
											title="برای مشاهده جزئیات کلیک کنید"
										>
											<div className="bg-indigo-50 p-3.5 rounded-2xl border border-indigo-100 shrink-0">
												<Users className="text-indigo-600 w-6 h-6" />
											</div>

											<div className="flex flex-col gap-2 flex-1 min-w-0">
												<div className="flex flex-wrap items-center gap-2 min-w-0">
													<h3 className="font-bold text-base sm:text-lg text-slate-800 wrap-break-word">
														{customer.FullName || "بدون نام"}
													</h3>

													{customer.FullName && (
														<CopyToClipboard textToCopy={customer.FullName} size={12} />
													)}

													<div className="flex items-center gap-1.5 mr-2">
														<span
															className={`px-2 py-0.5 text-xs font-semibold rounded-md ${customer.IsActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
														>
															{customer.IsActive ? "فعال" : "غیرفعال"}
														</span>
														{customer.TypeName && (
															<span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-100 text-blue-700">
																{customer.TypeName}
															</span>
														)}
													</div>
												</div>

												<div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium mt-1">
													<CustomerInfoBadge
														icon={<Phone className="w-3.5 h-3.5 text-slate-400" />}
														value={customer.PhoneNumber}
														emptyText="شماره تماس ثبت نشده"
													/>

													<CustomerInfoBadge
														icon={<Code className="w-3.5 h-3.5 text-slate-400" />}
														value={customer.NationalCode}
														emptyText="کد ملی ثبت نشده"
													/>

													<CustomerInfoBadge
														icon={<Briefcase className="w-3.5 h-3.5 text-slate-400" />}
														value={customer.Job}
														emptyText="شغل ثبت نشده"
													/>

													<CustomerInfoBadge
														icon={<MapPin className="w-3.5 h-3.5 text-slate-400" />}
														value={customer.Address}
														emptyText="آدرس ثبت نشده"
													/>
												</div>
											</div>
										</div>
									</div>
								</CardTable>
							)
						}
					/>
					<Column<CustomerGetGridDto> field="NationalCode" header="کدملی" sortable render={() => null} />
					<Column<CustomerGetGridDto> field="PhoneNumber" header="شماره تماس" sortable render={() => null} />
					<Column<CustomerGetGridDto> field="FirstName" header="نام مشتری" sortable render={() => null} />
					<Column<CustomerGetGridDto>
						field="LastName"
						header="نام خانوادگی مشتری"
						sortable
						render={() => null}
					/>
				</DataGrid>
			</PageCardContent>
			<Popup
				show={isDetailsModalOpen}
				onClose={() => setIsDetailsModalOpen(false)}
				title="جزئیات مشتری"
				fullScreen
			>
				{selectedDetailId && <CustomerDetails id={selectedDetailId} />}
			</Popup>
		</PageCard>
	);
}

interface CustomerInfoBadgeProps {
	icon: React.ReactNode;
	value?: string | null;
	emptyText: string;
}

function CustomerInfoBadge({ icon, value, emptyText }: CustomerInfoBadgeProps) {
	const normalizedValue = value?.trim();

	return (
		<div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm w-fit max-w-full">
			{icon}

			<span
				className={`dir-ltr tracking-wider truncate ${normalizedValue ? "text-slate-700" : "text-slate-400"}`}
			>
				{normalizedValue || emptyText}
			</span>

			{normalizedValue && <CopyToClipboard textToCopy={normalizedValue} size={12} />}
		</div>
	);
}
