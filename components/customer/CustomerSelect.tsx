"use client";

import { Check, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CustomerGetGridDto, CustomerType } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import { Button } from "@/utilities/components/ui/button";
import { Input } from "@/utilities/components/ui/input";

type CustomerSelectProps = {
	value?: number | null;
	onChange: (customer: CustomerGetGridDto) => void;
	initialNationalCode?: string;
	initialPhone?: string;
};

export default function CustomerSelect({
	value = null,
	onChange,
	initialNationalCode = "",
	initialPhone = "",
}: CustomerSelectProps) {
	const gridRef = useRef<DataGridRef>(null);

	const [searchNationalCode, setSearchNationalCode] = useState(initialNationalCode);
	const [searchPhone, setSearchPhone] = useState(initialPhone);

	const handleSearch = () => {
		if (gridRef.current) {
			gridRef.current.reload();
		}
	};

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			handleSearch();
		}, 500);

		return () => clearTimeout(delayDebounceFn);
	}, [searchNationalCode, searchPhone]);

	return (
		<div className="w-full flex flex-col gap-4">
			<div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
				<div className="flex-1">
					<label className="text-xs font-bold text-slate-700 mb-1.5 block">کد ملی</label>
					<Input
						placeholder="جستجوی خودکار..."
						value={searchNationalCode}
						onChange={(e) => setSearchNationalCode(e.target.value)}
						className="dir-ltr text-right"
					/>
				</div>
				<div className="flex-1">
					<label className="text-xs font-bold text-slate-700 mb-1.5 block">شماره تماس</label>
					<Input
						placeholder="جستجوی خودکار..."
						value={searchPhone}
						onChange={(e) => setSearchPhone(e.target.value)}
						className="dir-ltr text-right"
					/>
				</div>
			</div>

			<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ">
				<DataGrid<CustomerGetGridDto>
					ref={gridRef}
					rowClassName={(row) => (row.Type === CustomerType.Vip ? "bg-sky-400/50 hover:bg-sky-500/50" : "")}
					fetchFunction={(params) => {
						const existingFilters = params.FilterParam ? [...params.FilterParam] : [];
						const searchItems = [
							{ key: "NationalCode", value: searchNationalCode },
							{ key: "PhoneNumber", value: searchPhone },
						];

						searchItems.forEach((item) => {
							const filterIndex = existingFilters.findIndex((f) => f.Key === item.key);
							if (!item.value) {
								if (filterIndex > -1) existingFilters.splice(filterIndex, 1);
							} else {
								if (filterIndex > -1) existingFilters[filterIndex].Value = item.value;
								else existingFilters.push({ Key: item.key, Value: item.value });
							}
						});

						return CustomerService.Get({
							...params,
							FilterParam: existingFilters,
						});
					}}
					initialLimit={10}
				>
					<Column<CustomerGetGridDto>
						field="NationalCode"
						header="کدملی"
						width="130px"
						render={(row) => (
							<span className="dir-ltr text-slate-700 font-medium">{row.NationalCode || "-"}</span>
						)}
					/>
					<Column<CustomerGetGridDto>
						field="FirstName"
						header="نام و نام خانوادگی"
						render={(row) => (
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 hidden sm:flex">
									<Users className="w-4 h-4 text-indigo-500" />
								</div>
								<span className="font-bold text-slate-800">
									{row.FirstName} {row.LastName}
								</span>
							</div>
						)}
					/>
					<Column<CustomerGetGridDto>
						field="PhoneNumber"
						header="شماره تماس"
						width="130px"
						render={(row) => (
							<span className="dir-ltr text-slate-700 font-medium">{row.PhoneNumber || "-"}</span>
						)}
					/>
					<Column<CustomerGetGridDto>
						field="Id"
						filterable={false}
						header="عملیات"
						align="center"
						width="120px"
						render={(row) => {
							const isSelected = value === row.Id;
							return isSelected ? (
								<div className="flex items-center justify-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 py-1.5 px-3 rounded-lg">
									<Check className="w-4 h-4" />
									انتخاب شده
								</div>
							) : (
								<Button
									type="button"
									size="sm"
									className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
									onClick={(e) => {
										e.stopPropagation();
										onChange(row);
									}}
								>
									انتخاب
								</Button>
							);
						}}
					/>
				</DataGrid>
			</div>
		</div>
	);
}
