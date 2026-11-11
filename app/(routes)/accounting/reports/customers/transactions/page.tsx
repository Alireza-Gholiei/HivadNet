"use client";

import { DollarSign, FileSpreadsheet } from "lucide-react";
import { useRef } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";
import { AccountingService } from "@/dataBinding/services/Accounting/AccountingService";
import { CustomerBalanceDto } from "@/dataBinding/models/Accounting/CustomerBalanceDto";

export default function AllCustomersTransactions() {
	const gridRef = useRef<DataGridRef>(null);

	const fetchData = async (params: BaseGrid) => {
		return await AccountingService.getCustomersBalanceGrid(params);
	};

	return (
		<PageCard>
			<HraderTitle
				title="صورتحساب مشتریان"
				description="مشاهده و مدیریت صورتحساب مشتریان"
				icon={<FileSpreadsheet />}
			/>

			<PageCardContent>
				<DataGrid<CustomerBalanceDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
					<Column<CustomerBalanceDto>
						field="CustomerId"
						filterable={false}
						header="ترتیب پیش فرض"
						render={(transaction) => (
							<CardTable className="p-5 flex flex-col gap-4 hover:shadow-md transition-shadow bg-white border-slate-200 h-full">
								<div className="flex items-start justify-between border-b border-slate-100 pb-3">
									<div className="flex items-center gap-3">
										<div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
											<FileSpreadsheet className="w-5 h-5" />
										</div>
										<div className="flex flex-col">
											<span className="text-sm font-normal text-slate-500">مشتری: </span>
											<span className="font-bold text-lg text-slate-800">
												{transaction.CustomerName}
											</span>
										</div>
									</div>
									<div className="text-left flex flex-col items-end gap-1">
										<span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 border border-indigo-100">
											{transaction.Balance === 0
												? "---"
												: transaction.Balance > 0
													? "بستانکار"
													: "بدهکار"}
										</span>
									</div>
								</div>

								{transaction.BalanceDisplay && (
									<div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
										<DollarSign className="w-4 h-4 text-slate-400" />
										<span className="font-bold">{transaction.BalanceDisplay}</span>
									</div>
								)}
							</CardTable>
						)}
					/>
				</DataGrid>
			</PageCardContent>
		</PageCard>
	);
}
