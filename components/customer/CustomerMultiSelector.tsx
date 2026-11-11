"use client";

import { CheckCircle2, Search, User, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CustomerGetEditDto } from "@/dataBinding/models/Customer/CustomerGetEditDto";
import { CustomerGetGridDto, CustomerType } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import CopyToClipboard from "@/utilities/components/copy/CopyToClipboard";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";

import CustomerMultiSelect from "./CustomerMultiSelect";

type CustomerMultiSelectorProps = {
	value?: CustomerGetGridDto[];
	valueIds?: number[];
	onChange: (customers: CustomerGetGridDto[]) => void;
	label?: string;
	buttonText?: string;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
	className?: string;
};

const mapEditToGrid = (customer: CustomerGetEditDto): CustomerGetGridDto => {
	return {
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
	};
};

export default function CustomerMultiSelector({
	value = [],
	valueIds = [],
	onChange,
	label = "مشتریان",
	buttonText = "انتخاب از لیست",
	disabled = false,
	required = false,
	className = "",
}: CustomerMultiSelectorProps) {
	const [open, setOpen] = useState(false);
	const [resolvedCustomers, setResolvedCustomers] = useState<CustomerGetGridDto[]>([]);
	const [loadingCustomers, setLoadingCustomers] = useState(false);

	const selectedCustomers = useMemo(() => {
		if (value && value.length > 0) return value;
		return resolvedCustomers;
	}, [value, resolvedCustomers]);

	useEffect(() => {
		let ignore = false;

		const loadCustomers = async () => {
			if (value && value.length > 0) {
				setResolvedCustomers([]);
				return;
			}

			if (!valueIds || valueIds.length === 0) {
				setResolvedCustomers([]);
				return;
			}

			try {
				setLoadingCustomers(true);

				const results = await Promise.all(valueIds.map((id) => CustomerService.GetEdit(id)));

				if (!ignore) {
					const mapped = results.filter((x): x is CustomerGetEditDto => !!x).map(mapEditToGrid);

					setResolvedCustomers(mapped);
				}
			} finally {
				if (!ignore) {
					setLoadingCustomers(false);
				}
			}
		};

		void loadCustomers();

		return () => {
			ignore = true;
		};
	}, []);

	const handleRemoveCustomer = (customerId: number) => {
		const updated = selectedCustomers.filter((x) => x.Id !== customerId);
		setResolvedCustomers(updated);
		onChange(updated);
	};

	const handleClearAll = () => {
		setResolvedCustomers([]);
		onChange([]);
	};

	return (
		<div className={`w-full ${className} py-3`}>
			<div className="flex items-center justify-between mb-2">
				<label className="text-sm font-bold text-slate-700">
					{label}
					{required && <span className="text-rose-500 mr-1">*</span>}
				</label>
			</div>

			<div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
				{loadingCustomers ? (
					<div className="flex items-center gap-3 text-slate-500">
						<div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
							<User className="w-5 h-5 text-slate-400" />
						</div>

						<div>
							<div className="font-medium text-slate-700">در حال دریافت اطلاعات مشتری‌ها...</div>
							<div className="text-xs text-slate-400 mt-1">لطفا چند لحظه صبر کنید.</div>
						</div>
					</div>
				) : selectedCustomers.length > 0 ? (
					<div className="space-y-4">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
							<div className="flex items-center gap-3 min-w-0">
								<div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
									<Users className="w-5 h-5 text-indigo-600" />
								</div>

								<div className="min-w-0">
									<div className="text-sm text-slate-500 mb-1">مشتریان انتخاب‌شده</div>
									<div className="font-bold text-slate-800">
										{selectedCustomers.length} مشتری انتخاب شده است
									</div>
								</div>
							</div>

							<div className="flex items-center gap-2 shrink-0">
								<Button
									type="button"
									variant="outline"
									disabled={disabled}
									onClick={() => setOpen(true)}
									className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
								>
									<Search className="w-4 h-4 ml-1" />
									افزودن مشتری
								</Button>

								<Button
									type="button"
									variant="outline"
									disabled={disabled}
									onClick={handleClearAll}
									className="border-rose-200 text-rose-600 hover:bg-rose-50"
								>
									<X className="w-4 h-4 ml-1" />
									حذف همه
								</Button>
							</div>
						</div>

						<div className="space-y-3">
							{selectedCustomers.map((customer) => (
								<div
									key={customer.Id}
									className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 
										${customer.Type === CustomerType.Vip ? "bg-sky-400/50 hover:bg-sky-500/50" : "bg-slate-50"}`}
								>
									<div className="flex items-center gap-3 min-w-0">
										<div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
											<CheckCircle2 className="w-4 h-4 text-green-600" />
										</div>

										<div className="min-w-0">
											<div className="font-semibold text-slate-800 truncate">
												{customer.FullName}
												<CopyToClipboard textToCopy={customer.FullName || "-"} size={12} />
											</div>

											<div className="text-xs text-slate-500 mt-1">
												کد ملی:
												<span className="dir-ltr inline-block mr-1 text-slate-700 font-medium">
													{customer.NationalCode || "-"}
												</span>
												<CopyToClipboard textToCopy={customer.NationalCode || "-"} size={12} />
											</div>

											<div className="text-xs text-slate-500 mt-1">
												شماره تماس:
												<span className="dir-ltr inline-block mr-1 text-slate-700 font-medium">
													{customer.PhoneNumber || "-"}
												</span>
												<CopyToClipboard textToCopy={customer.PhoneNumber || "-"} size={12} />
											</div>
										</div>
									</div>

									<Button
										type="button"
										variant="outline"
										disabled={disabled}
										onClick={() => handleRemoveCustomer(customer.Id)}
										className="border-rose-200 text-rose-600 hover:bg-rose-50"
									>
										<X className="w-4 h-4 ml-1" />
										حذف
									</Button>
								</div>
							))}
						</div>
					</div>
				) : (
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
						<div className="flex items-center gap-3 text-slate-500">
							<div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
								<Users className="w-5 h-5 text-slate-400" />
							</div>

							<div>
								<div className="font-medium text-slate-700">هنوز مشتری‌ای انتخاب نشده است</div>
								<div className="text-xs text-slate-400 mt-1">
									برای انتخاب مشتری‌ها، از لیست جستجو کنید.
								</div>
							</div>
						</div>

						<Button
							type="button"
							disabled={disabled}
							onClick={() => setOpen(true)}
							className="bg-indigo-600 hover:bg-indigo-700 text-white"
						>
							<Search className="w-4 h-4 ml-1" />
							{buttonText}
						</Button>
					</div>
				)}
			</div>

			<Popup show={open} onClose={() => setOpen(false)} title="انتخاب مشتری از لیست">
				<CustomerMultiSelect
					selectedIds={selectedCustomers.map((x) => x.Id)}
					onSubmit={(customers) => {
						setResolvedCustomers(customers);
						onChange(customers);
						setOpen(false);
					}}
					title="انتخاب مشتری‌ها"
					description="برای انتخاب یک یا چند مشتری، از لیست جستجو کنید."
				/>
			</Popup>
		</div>
	);
}
