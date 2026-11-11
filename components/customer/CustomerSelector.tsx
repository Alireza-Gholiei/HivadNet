"use client";

import { CheckCircle2, Loader2, Search, User, UserPlus, X } from "lucide-react";
import { SetStateAction, useEffect, useMemo, useState } from "react";

import CustomerAdd from "@/app/(routes)/customers/CustomerAddForm";
import { CustomerGetEditDto } from "@/dataBinding/models/Customer/CustomerGetEditDto";
import { CustomerGetGridDto, CustomerType } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import CopyToClipboard from "@/utilities/components/copy/CopyToClipboard";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { Input } from "@/utilities/components/ui/input";

import CustomerSelect from "./CustomerSelect";

type CustomerSelectorProps = {
	value?: CustomerGetGridDto | null;
	valueId?: number | null;
	onChange: (customer: CustomerGetGridDto | null) => void;
	label?: string;
	disabled?: boolean;
	required?: boolean;
	className?: string;
};

const mapEditToGrid = (customer: CustomerGetEditDto): CustomerGetGridDto => ({
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
});

export default function CustomerSelector({
	value = null,
	valueId = null,
	onChange,
	label = "مشتری",
	disabled = false,
	required = false,
	className = "",
}: CustomerSelectorProps) {
	const [open, setOpen] = useState(false);
	const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

	const [resolvedCustomer, setResolvedCustomer] = useState<CustomerGetGridDto | null>(null);
	const [loadingCustomer, setLoadingCustomer] = useState(false);

	const [quickNationalCode, setQuickNationalCode] = useState("");
	const [quickPhone, setQuickPhone] = useState("");

	const selectedCustomer = useMemo(() => value ?? resolvedCustomer, [value, resolvedCustomer]);
	const selectedCustomerId = selectedCustomer?.Id ?? valueId ?? null;

	useEffect(() => {
		let ignore = false;
		const loadCustomer = async () => {
			if (value || !valueId) {
				if (!value) setResolvedCustomer(null);
				return;
			}
			try {
				setLoadingCustomer(true);
				const customer = await CustomerService.GetEdit(valueId);
				if (!ignore && customer) {
					setResolvedCustomer(mapEditToGrid(customer));
				}
			} finally {
				if (!ignore) setLoadingCustomer(false);
			}
		};
		void loadCustomer();
		return () => {
			ignore = true;
		};
	}, [value, valueId]);

	const handleSelectCustomer = (customer: CustomerGetGridDto) => {
		setResolvedCustomer(customer);
		onChange(customer);
		setOpen(false);
		setQuickNationalCode("");
		setQuickPhone("");
	};

	const handleQuickSearch = async () => {
		if (disabled || loadingCustomer) return;

		if (!quickNationalCode && !quickPhone) {
			setOpen(true);
			return;
		}

		try {
			setLoadingCustomer(true);

			const filters = [];
			if (quickNationalCode) filters.push({ Key: "NationalCode", Value: quickNationalCode });
			if (quickPhone) filters.push({ Key: "PhoneNumber", Value: quickPhone });

			const response = await CustomerService.Get({
				CurrentPage: 1,
				Limit: 2,
				OrderField: "Id",
				OrderType: 2,
				FilterParam: filters,
			});

			const records = response.Data || [];

			if (records.length === 1) {
				handleSelectCustomer(records[0]);
			} else {
				setOpen(true);
			}
		} catch {
			setOpen(true);
		} finally {
			setLoadingCustomer(false);
		}
	};

	return (
		<div className={`w-full py-3 ${className}`}>
			<label className="block text-sm font-bold text-slate-700 mb-2">
				{label} {required && <span className="text-rose-500 mr-1">*</span>}
			</label>

			<div
				className={`rounded-xl border border-slate-200  p-3 shadow-sm transition-all hover:shadow-md
				${selectedCustomer?.Type === CustomerType.Vip ? "bg-sky-400/50 hover:bg-sky-500/50" : "bg-white"}`}
			>
				{selectedCustomer ? (
					<div className={`flex flex-col md:flex-row md:items-center justify-between gap-4`}>
						<div className="flex items-center gap-3 min-w-0">
							<div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
								<CheckCircle2 className="w-6 h-6 text-indigo-600" />
							</div>
							<div className="min-w-0">
								<div className="font-bold text-slate-800 text-base truncate flex items-center gap-2">
									{selectedCustomer.FullName}
									<CopyToClipboard textToCopy={selectedCustomer.FullName || "-"} size={14} />
								</div>
								<div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
									<div className="font-bold text-xs text-slate-500 flex items-center gap-1">
										کد ملی:{" "}
										<span className="dir-ltr font-bold text-slate-700">
											{selectedCustomer.NationalCode || "-"}
										</span>
										<CopyToClipboard textToCopy={selectedCustomer.NationalCode || "-"} size={14} />
									</div>
									<div className="text-xs text-slate-500 flex items-center gap-1">
										شماره تماس:{" "}
										<span className="dir-ltr text-slate-700 font-bold">
											{selectedCustomer.PhoneNumber || "-"}
										</span>
										<CopyToClipboard textToCopy={selectedCustomer.PhoneNumber || "-"} size={14} />
									</div>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
							<Button
								type="button"
								size="sm"
								variant="outline"
								disabled={disabled}
								onClick={() => setOpen(true)}
								className="flex-1 md:flex-none border-indigo-200 text-indigo-700 hover:bg-indigo-50 flex items-center justify-center gap-2 px-4"
							>
								<Search className="w-4 h-4" />
								<span>تغییر</span>
							</Button>

							<Button
								type="button"
								size="sm"
								variant="outline"
								disabled={disabled}
								onClick={() => {
									setResolvedCustomer(null);
									onChange(null);
								}}
								className="shrink-0 border-rose-200 text-rose-600 hover:bg-rose-50 px-3 flex items-center justify-center"
								title="حذف انتخاب"
							>
								<X className="w-4 h-4" />
							</Button>
						</div>
					</div>
				) : (
					<div className="flex flex-col xl:flex-row xl:items-center gap-4">
						<div className="flex items-center gap-3 shrink-0">
							<div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
								{loadingCustomer ? (
									<Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
								) : (
									<User className="w-5 h-5 text-slate-400" />
								)}
							</div>
							<div className="font-bold text-sm text-slate-700">
								{loadingCustomer ? "در حال جستجو..." : "جستجوی مشتری:"}
							</div>
						</div>

						<div className="flex-1 flex flex-col lg:flex-row gap-3">
							<Input
								placeholder="کد ملی..."
								value={quickNationalCode}
								onChange={(e: { target: { value: SetStateAction<string> } }) =>
									setQuickNationalCode(e.target.value)
								}
								onKeyDown={(e: { key: string; preventDefault: () => void }) => {
									if (e.key === "Enter") {
										e.preventDefault();
										void handleQuickSearch();
									}
								}}
								disabled={disabled || loadingCustomer}
								className="w-full dir-ltr text-right bg-slate-50"
							/>
							<Input
								placeholder="شماره تماس..."
								value={quickPhone}
								onChange={(e: { target: { value: SetStateAction<string> } }) =>
									setQuickPhone(e.target.value)
								}
								onKeyDown={(e: { key: string; preventDefault: () => void }) => {
									if (e.key === "Enter") {
										e.preventDefault();
										void handleQuickSearch();
									}
								}}
								disabled={disabled || loadingCustomer}
								className="w-full dir-ltr text-right bg-slate-50"
							/>

							<Button
								type="button"
								disabled={disabled || loadingCustomer}
								onClick={(e) => {
									e.preventDefault();
									void handleQuickSearch();
								}}
								className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 flex items-center justify-center gap-2"
							>
								<Search className="w-4 h-4" />
								<span>بررسی و انتخاب</span>
							</Button>

							<Button
								type="button"
								variant="outline"
								disabled={disabled || loadingCustomer}
								onClick={() => setIsAddPopupOpen(true)}
								className="w-full lg:w-auto shrink-0 flex items-center justify-center gap-2"
							>
								<UserPlus className="w-4 h-4" />
								<span>مشتری جدید</span>
							</Button>
						</div>
					</div>
				)}
			</div>

			<Popup show={open} onClose={() => setOpen(false)} title="انتخاب مشتری از لیست" fullScreen>
				<CustomerSelect
					value={selectedCustomerId}
					onChange={handleSelectCustomer}
					initialNationalCode={quickNationalCode}
					initialPhone={quickPhone}
				/>
			</Popup>

			<Popup
				show={isAddPopupOpen}
				onClose={() => setIsAddPopupOpen(false)}
				title="ثبت مشتری جدید"
				description="ایجاد و ثبت مشتری جدید"
				fullScreen
			>
				<CustomerAdd
					onClose={() => setIsAddPopupOpen(false)}
					initialNationalCode={quickNationalCode}
					initialPhone={quickPhone}
				/>
			</Popup>
		</div>
	);
}
