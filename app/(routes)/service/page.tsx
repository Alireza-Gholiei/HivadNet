"use client";

import {
	BadgePercent,
	CalendarDays,
	ChevronDown,
	Eye,
	FileText,
	List,
	Pen,
	Plus,
	Receipt,
	UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { ServiceGetGridDto } from "@/dataBinding/models/Service/ServiceGetGridDto";
import { ServiceService } from "@/dataBinding/services/Service/ServiceService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

import ServiceDetailView from "./ServiceDetailView";
import ServicePaymentView from "./ServicePaymentView";
import ServiceEditForm from "./ServiceEditForm";

export default function ServiceGridPage() {
	const router = useRouter();
	const gridRef = useRef<DataGridRef>(null);

	const [showDetail, setShowDetail] = useState<boolean>(false);
	const [showEdit, setShowEdit] = useState<boolean>(false);
	const [showPayment, setShowPayment] = useState<boolean>(false);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [selectedCustomer, setSelectedCustomer] = useState<{ CustomerId: number; Amount: number } | null>(null);

	const [expandedServiceId, setExpandedServiceId] = useState<number | null>(null);

	const toggleServiceDetails = (id: number) => {
		setExpandedServiceId((prev) => (prev === id ? null : id));
	};

	const fetchData = async (params: BaseGrid) => {
		return await ServiceService.GetGridAll(params);
	};

	const formatPrice = (value: number) => {
		return new Intl.NumberFormat("fa-IR").format(value);
	};

	const formatDate = (date: string) => {
		if (!date) return "-";
		return new Date(date).toLocaleDateString("fa-IR");
	};

	return (
		<PageCard>
			<HraderTitle
				title="مدیریت خدمات/فاکتور"
				description="لیست و اطلاعات خدمات ثبت‌شده در سیستم"
				icon={<List />}
			/>

			<PageCardContent>
				<div className="flex w-full md:w-auto gap-3">
					<Button onClick={() => router.push("/service/add")}>
						<Plus className="w-5 h-5" />
						ثبت خدمت/فاکتور جدید
					</Button>
				</div>

				<DataGrid<ServiceGetGridDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
					<Column<ServiceGetGridDto>
						field="Id"
						filterable={false}
						header="ترتیب پیش فرض"
						render={(service) => {
							const isExpanded = expandedServiceId === service.Id;

							return (
								<CardTable
									key={service.Id}
									onClick={() => toggleServiceDetails(service.Id)}
									className={`bg-white border-slate-200 shadow-sm transition-all duration-200 cursor-pointer overflow-hidden hover:shadow-md hover:border-indigo-200 ${isExpanded ? "ring-2 ring-indigo-100 border-indigo-300 shadow-md" : ""}`}
								>
									<div className="p-4">
										<div className="flex items-center gap-4">
											<div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100">
												<List className="text-indigo-600 w-5 h-5" />
											</div>

											<div className="flex-1">
												<h3 className="font-bold text-lg text-slate-800">
													{service.CustomerFullName}
												</h3>

												<div className="flex flex-wrap gap-2 mt-2">
													<div className="text-xs bg-white border px-2 py-1 rounded flex items-center gap-1">
														<CalendarDays className="w-3.5 h-3.5" />
														تاریخ خدمت: {formatDate(service.ServiceDate)}
													</div>

													<div className="text-xs bg-white border px-2 py-1 rounded">
														مبلغ کل: {formatPrice(service.TotalPrice)} تومان
													</div>

													<div className="text-xs bg-white border px-2 py-1 rounded">
														تخفیف: {formatPrice(service.TotalDiscount)} تومان
													</div>

													<div className="text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded">
														مبلغ نهایی: {formatPrice(service.TotalEffectiveAmount)} تومان
													</div>

													<div className="text-xs bg-green-50 border border-red-200 text-red-700 px-2 py-1 rounded">
														مبلغ مانده: {formatPrice(service.Amount)} تومان
													</div>
												</div>
											</div>

											<div className="flex flex-col gap-2">
												<Button
													size="sm"
													variant="outline"
													className="text-blue-700 border-blue-700"
													onClick={(e) => {
														e.stopPropagation();
														setSelectedId(service.Id);
														setShowDetail(true);
													}}
												>
													<Eye className="w-4 h-4 mr-1" />
													جزئیات
												</Button>
												<Button
													size="sm"
													variant="outline"
													className="text-green-700 border-green-700"
													onClick={(e) => {
														e.stopPropagation();
														setSelectedId(service.Id);
														setShowEdit(true);
													}}
												>
													<Pen className="w-4 h-4 mr-1" />
													ویرایش
												</Button>
												<Button
													size="sm"
													variant="outline"
													className="text-emerald-700 border-emerald-700"
													onClick={(e) => {
														e.stopPropagation();
														setSelectedId(service.Id);
														setSelectedCustomer({
															CustomerId: service.CustomerId,
															Amount: service.Amount,
														});
														setShowPayment(true);
													}}
												>
													<Receipt className="w-4 h-4 mr-1" />
													پرداخت و جزئیات
												</Button>

												<Button
													size="sm"
													variant="outline"
													className="text-amber-500 border-amber-500"
													onClick={(e) => {
														e.stopPropagation();
														toggleServiceDetails(service.Id);
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
													<div className="rounded-xl border bg-slate-50 p-3">
														<div className="flex items-center gap-2 font-semibold text-sm text-slate-700">
															<FileText className="w-4 h-4" />
															توضیحات
														</div>
														<div className="text-sm text-slate-600 mt-2 leading-7">
															{service.Description?.trim()
																? service.Description
																: "توضیحی برای این خدمت ثبت نشده است."}
														</div>
													</div>

													<div className="rounded-xl border bg-slate-50 p-3">
														<div className="flex items-center gap-2 font-semibold text-sm text-slate-700">
															<UserRound className="w-4 h-4" />
															نمایندگان
														</div>
														<div className="text-sm text-slate-600 mt-2 leading-7">
															{service.Representatives?.trim()
																? service.Representatives
																: "نماینده‌ای برای این خدمت ثبت نشده است."}
														</div>
													</div>

													<div className="rounded-xl border bg-slate-50 p-3 sm:col-span-2">
														<div className="flex items-center gap-2 font-semibold text-sm text-slate-700 mb-2">
															<BadgePercent className="w-4 h-4" />
															خلاصه مالی
														</div>

														<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
															<div className="border rounded-lg bg-white px-3 py-2">
																<span className="text-slate-500">مبلغ کل:</span>
																<span className="font-bold text-slate-800 mr-2">
																	{formatPrice(service.TotalPrice)} تومان
																</span>
															</div>

															<div className="border rounded-lg bg-white px-3 py-2">
																<span className="text-slate-500">تخفیف:</span>
																<span className="font-bold text-amber-600 mr-2">
																	{formatPrice(service.TotalDiscount)} تومان
																</span>
															</div>

															<div className="border rounded-lg bg-white px-3 py-2">
																<span className="text-slate-500">مبلغ نهایی:</span>
																<span className="font-bold text-green-600 mr-2">
																	{formatPrice(service.TotalEffectiveAmount)} تومان
																</span>
															</div>
															<div className="border rounded-lg bg-white px-3 py-2">
																<span className="text-slate-500">مبلغ نهایی:</span>
																<span className="font-bold text-red-600 mr-2">
																	{formatPrice(service.Amount)} تومان
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										)}
									</div>
								</CardTable>
							);
						}}
					/>
					<Column<ServiceGetGridDto>
						field="CustomerFullName"
						header="نام"
						filterKey="Customer.FirstName"
						sortKey="Customer.FirstName"
						sortable
						render={() => null}
					/>
					<Column<ServiceGetGridDto>
						field="CustomerFullName"
						header="نام خانوادگی"
						filterKey="Customer.LastName"
						sortKey="Customer.LastName"
						sortable
						render={() => null}
					/>
				</DataGrid>
			</PageCardContent>

			<Popup
				show={showEdit}
				onClose={() => {
					setShowEdit(false);
					setSelectedId(null);
				}}
				title="ویرایش خدمت/فاکتور"
				description="ویرایش اطلاعات کامل خدمت/فاکتور ثبت شده"
				fullScreen
			>
				<ServiceEditForm
					serviceId={selectedId ?? 0}
					onClose={() => {
						setShowEdit(false);
						setSelectedId(null);
					}}
					onSuccess={() => {
						setShowEdit(false);
						setSelectedId(null);
					}}
				/>
			</Popup>

			<Popup
				show={showDetail}
				onClose={() => {
					setShowDetail(false);
					setSelectedId(null);
				}}
				title="جزئیات خدمت/فاکتور"
				description="مشاهده اطلاعات کامل خدمت/فاکتور ثبت شده"
				fullScreen
			>
				<ServiceDetailView serviceId={selectedId ?? 0} />
			</Popup>
			<Popup
				show={showPayment}
				onClose={() => {
					setShowPayment(false);
					setSelectedId(null);
				}}
				title="جزئیات پرداخت"
				description="مشاهده اطلاعات کامل پرداخت خدمت/فاکتور ثبت شده"
				fullScreen
			>
				<ServicePaymentView
					customerId={selectedCustomer?.CustomerId ?? 0}
					defaultAmount={selectedCustomer?.Amount ?? 0}
					onClose={() => {
						setShowPayment(false);
						setSelectedId(null);
						setSelectedCustomer(null);
						gridRef.current?.reload?.();
					}}
					onSuccess={() => {
						setShowPayment(false);
						setSelectedId(null);
						setSelectedCustomer(null);
						gridRef.current?.reload?.();
					}}
					serviceId={selectedId ?? 0}
				/>
			</Popup>
		</PageCard>
	);
}
