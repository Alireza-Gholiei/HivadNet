"use client";

import { ArrowLeftRight, ArrowRightLeft, CalendarDays } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import CustomerSelector from "@/components/customer/CustomerSelector";
import HraderTitle from "@/components/Shared/HraderTitle";
import { CustomerGetGridDto } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";
import { AccountingService } from "@/dataBinding/services/Accounting/AccountingService";
import { CustomerJournalLineDto } from "@/dataBinding/models/Accounting/CustomerJournalLineDto";

export default function SpecificCustomerTransactions() {
	const gridRef = useRef<DataGridRef>(null);

	const [selectedCustomer, setSelectedCustomer] = useState<CustomerGetGridDto | null>(null);

	useEffect(() => {
		gridRef.current?.reload?.();
	}, [selectedCustomer]);

	const fetchData = async (params: BaseGrid) => {
		return await AccountingService.getCustomerJournalLinesGrid(selectedCustomer?.Id ?? 0, params);
	};

	return (
		<PageCard>
			<HraderTitle
				title="تراکنش های مشتریان"
				description="مشاهده سوابق مالی و تراکنش‌های مشتریان"
				icon={<ArrowLeftRight />}
			/>

			<PageCardContent>
				<CustomerSelector
					value={selectedCustomer}
					onChange={setSelectedCustomer}
					label="انتخاب مشتری"
					required
				/>

				{!selectedCustomer ? (
					<div className="flex-1 flex flex-col justify-center items-center text-slate-400 py-12 bg-white rounded-lg border border-dashed border-slate-300">
						<ArrowRightLeft className="w-12 h-12 mb-3 opacity-50" />
						<p>ابتدا یک مشتری انتخاب کنید</p>
					</div>
				) : (
					<DataGrid<CustomerJournalLineDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
						<Column<CustomerJournalLineDto>
							field="LineId"
							filterable={false}
							header="ترتیب پیش فرض"
							render={(transaction) => (
								<CardTable className="p-5 flex flex-col gap-4 hover:shadow-md transition-shadow bg-white border-slate-200">
									<div className="flex items-start justify-between border-b border-slate-100 pb-3">
										<div className="flex items-center gap-3">
											<div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
												<ArrowLeftRight className="w-4 h-4" />
											</div>
											<div className="flex flex-col">
												<span className="font-bold text-lg text-slate-800">
													{(Math.abs(transaction.SignedAmount) || 0).toLocaleString()}{" "}
													<span className="text-sm font-normal text-slate-500">تومان</span>
												</span>
												{transaction.EntryType && (
													<span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md w-fit mt-1">
														{transaction.EntryType}{" "}
														{transaction.PaymentMethodName
															? `(${transaction.PaymentMethodName})`
															: ""}
													</span>
												)}
											</div>
										</div>
										<div className="text-left flex flex-col items-end gap-1">
											{transaction.EntryDate && (
												<div className="flex items-center gap-1.5 text-sm text-slate-500">
													<CalendarDays className="w-4 h-4" />
													<span dir="ltr">{transaction.EntryDate}</span>
												</div>
											)}
											{transaction.EntryNo && (
												<span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 border border-indigo-100">
													سند: {transaction.EntryNo}
												</span>
											)}
										</div>
									</div>

									<div className="flex flex-col gap-1 min-h-10">
										<span className="text-xs text-slate-400">{transaction.AccountTitle}</span>
										<p className="text-sm text-slate-600">
											{transaction.LineDescription ||
												transaction.EntryDescription ||
												"بدون توضیحات"}
										</p>
									</div>

									<div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-4 text-sm">
										<div className="flex flex-col gap-1 flex-1 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 text-center">
											<span className="text-xs text-emerald-600 font-medium">
												بستانکار (واریز/دریافت)
											</span>
											<span className="font-semibold text-emerald-700">
												{transaction.Credit > 0
													? `${transaction.Credit.toLocaleString()} تومان`
													: "---"}
											</span>
										</div>
										<div className="flex flex-col gap-1 flex-1 bg-rose-50/50 p-2 rounded-lg border border-rose-100 text-center">
											<span className="text-xs text-rose-600 font-medium">
												بدهکار (خرید/فروش)
											</span>
											<span className="font-semibold text-rose-700">
												{transaction.Debit > 0
													? `${transaction.Debit.toLocaleString()} تومان`
													: "---"}
											</span>
										</div>
									</div>
								</CardTable>
							)}
						/>
					</DataGrid>
				)}
			</PageCardContent>
		</PageCard>
	);
}
