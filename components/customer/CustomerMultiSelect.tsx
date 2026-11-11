"use client";

import { Check, CheckSquare, Square, Users, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { CustomerGetEditDto } from "@/dataBinding/models/Customer/CustomerGetEditDto";
import { CustomerGetGridDto, CustomerType } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import { Button } from "@/utilities/components/ui/button";

type CustomerMultiSelectProps = {
	selectedIds?: number[];
	onSubmit: (customers: CustomerGetGridDto[]) => void;
	title?: string;
	description?: string;
	className?: string;
};

export default function CustomerMultiSelect({
	selectedIds = [],
	onSubmit,
	title = "انتخاب مشتری‌ها",
	description = "یک یا چند مشتری را از لیست انتخاب کنید",
	className = "",
}: CustomerMultiSelectProps) {
	const gridRef = useRef<DataGridRef>(null);
	const [selectedCustomers, setSelectedCustomers] = useState<CustomerGetGridDto[]>([]);

	const selectedIdSet = useMemo(() => {
		return new Set(selectedCustomers.map((x) => x.Id));
	}, [selectedCustomers]);

	useEffect(() => {
		if (!selectedIds || selectedIds.length === 0) {
			setSelectedCustomers([]);
			return;
		}

		let ignore = false;

		const loadSelectedCustomers = async () => {
			try {
				const results = await Promise.all(selectedIds.map((id) => CustomerService.GetEdit(id)));

				if (ignore) return;

				const mapped: CustomerGetGridDto[] = results
					.filter((x): x is CustomerGetEditDto => !!x)
					.map((customer) => ({
						Id: customer.Id,
						FullName: `${customer.FirstName} ${customer.LastName}`,
						FirstName: customer.FirstName,
						LastName: customer.LastName,
						NationalCode: customer.NationalCode,
						PhoneNumber: customer.PhoneNumber,
						Address: customer.Address,
						Job: customer.Job,
						Type: customer.Type,
						TypeName: customer.TypeName,
						IsActive: customer.IsActive,
						ToggleRepPanel: false,
					}));

				setSelectedCustomers(mapped);
			} catch {
				if (!ignore) {
					setSelectedCustomers([]);
				}
			}
		};

		void loadSelectedCustomers();

		return () => {
			ignore = true;
		};
	}, [selectedIds]);

	const toggleCustomer = (customer: CustomerGetGridDto) => {
		setSelectedCustomers((prev) => {
			const exists = prev.some((x) => x.Id === customer.Id);

			if (exists) {
				return prev.filter((x) => x.Id !== customer.Id);
			}

			return [...prev, customer];
		});
	};

	const clearSelection = () => {
		setSelectedCustomers([]);
	};

	return (
		<div className={`w-full ${className}`}>
			<div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
				<div>
					<h3 className="text-base font-bold text-slate-800">{title}</h3>
					<p className="text-sm text-slate-500 mt-1">{description}</p>
				</div>

				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={clearSelection}
						disabled={selectedCustomers.length === 0}
						className="border-rose-200 text-rose-600 hover:bg-rose-50"
					>
						<X className="w-4 h-4 ml-1" />
						حذف انتخاب‌ها
					</Button>

					<Button
						type="button"
						onClick={() => onSubmit(selectedCustomers)}
						disabled={selectedCustomers.length === 0}
						className="bg-indigo-600 hover:bg-indigo-700 text-white"
					>
						<Check className="w-4 h-4 ml-1" />
						تأیید انتخاب ({selectedCustomers.length})
					</Button>
				</div>
			</div>

			{selectedCustomers.length > 0 && (
				<div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-700">
					{selectedCustomers.length} مشتری انتخاب شده است.
				</div>
			)}

			<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
				<DataGrid<CustomerGetGridDto>
					ref={gridRef}
					fetchFunction={(params) => CustomerService.Get(params)}
					rowClassName={(row) => (row.Type === CustomerType.Vip ? "bg-sky-400/50 hover:bg-sky-500/50" : "")}
					initialLimit={10}
				>
					<Column<CustomerGetGridDto>
						field="NationalCode"
						header="کدملی"
						width="150px"
						render={(row) => <span className="dir-ltr text-slate-500">{row.NationalCode || "-"}</span>}
					/>

					<Column<CustomerGetGridDto>
						field="FirstName"
						header="نام مشتری"
						render={(row) => (
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
									<Users className="w-4 h-4 text-slate-500" />
								</div>
								<span className="font-bold text-slate-800">{row.FirstName}</span>
							</div>
						)}
					/>

					<Column<CustomerGetGridDto>
						field="LastName"
						header="نام خانوادگی مشتری"
						render={(row) => (
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
									<Users className="w-4 h-4 text-slate-500" />
								</div>
								<span className="font-bold text-slate-800">{row.LastName}</span>
							</div>
						)}
					/>

					<Column<CustomerGetGridDto>
						field="PhoneNumber"
						header="شماره تماس"
						width="150px"
						render={(row) => <span className="dir-ltr text-slate-500">{row.PhoneNumber || "-"}</span>}
					/>

					<Column<CustomerGetGridDto>
						field="Id"
						filterable={false}
						header="انتخاب"
						align="center"
						width="140px"
						sortable={false}
						render={(row) => {
							const isSelected = selectedIdSet.has(row.Id);

							return (
								<Button
									type="button"
									variant={isSelected ? "default" : "outline"}
									size="sm"
									className={
										isSelected
											? "w-full bg-indigo-600 hover:bg-indigo-700 text-white"
											: "w-full border-slate-300"
									}
									onClick={(e) => {
										e.stopPropagation();
										toggleCustomer(row);
									}}
								>
									{isSelected ? (
										<>
											<CheckSquare className="w-4 h-4 ml-1" />
											انتخاب شده
										</>
									) : (
										<>
											<Square className="w-4 h-4 ml-1" />
											انتخاب
										</>
									)}
								</Button>
							);
						}}
					/>
				</DataGrid>
			</div>
		</div>
	);
}
