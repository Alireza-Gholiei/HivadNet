"use client";

import { CheckCircle2, Search, User, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
	SmsTemplateGetByIdDto,
	SmsTemplateGetGridDto,
} from "@/dataBinding/models/Messaging/SmsTemplate/SmsTemplateDtos";
import { SmsTemplateService } from "@/dataBinding/services/Messaging/SmsTemplate/SmsTemplateService";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";

import SmsTempSelect from "./SmsTempSelect";

type SmsTempSelectorProps = {
	value?: SmsTemplateGetGridDto | null;
	valueId?: number | null;
	onChange?: (data: SmsTemplateGetGridDto | null) => void;
	onChangeId?: (id: number | null) => void;
	label?: string;
	buttonText?: string;
	disabled?: boolean;
	required?: boolean;
	className?: string;
};

const mapEditToGrid = (data: SmsTemplateGetByIdDto): SmsTemplateGetGridDto => {
	return {
		Id: data.Id,
		Title: data.Title,
		IsActive: data.IsActive,
	};
};

export default function SmsTempSelector({
	value = null,
	valueId = null,
	onChange,
	onChangeId,
	label = "قالب پیامک",
	buttonText = "انتخاب از لیست",
	disabled = false,
	required = false,
	className = "",
}: SmsTempSelectorProps) {
	const [open, setOpen] = useState(false);
	const [resolved, setResolved] = useState<SmsTemplateGetGridDto | null>(null);
	const [loading, setLoading] = useState(false);

	const selected = useMemo(() => {
		return value ?? resolved;
	}, [value, resolved]);

	const selectedId = selected?.Id ?? valueId ?? null;

	useEffect(() => {
		let ignore = false;

		const loadUser = async () => {
			if (value) {
				setResolved(null);
				return;
			}

			if (!valueId) {
				setResolved(null);
				return;
			}

			try {
				setLoading(true);

				const data = await SmsTemplateService.GetById(valueId);

				if (!ignore) {
					setResolved(data ? mapEditToGrid(data) : null);
				}
			} finally {
				if (!ignore) {
					setLoading(false);
				}
			}
		};

		void loadUser();

		return () => {
			ignore = true;
		};
	}, [value, valueId]);

	const handleSelect = (user: SmsTemplateGetGridDto) => {
		setResolved(user);
		if (onChange) {
			onChange(user);
		}
		if (onChangeId) {
			onChangeId(user.Id);
		}
		setOpen(false);
	};

	const handleClear = () => {
		setResolved(null);
		if (onChange) {
			onChange(null);
		}
		if (onChangeId) {
			onChangeId(null);
		}
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
				{selected ? (
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
						<div className="flex items-center gap-3 min-w-0">
							<div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
								<CheckCircle2 className="w-5 h-5 text-indigo-600" />
							</div>

							<div className="min-w-0">
								<div className="text-sm text-slate-500 mb-1">قالب انتخاب‌شده</div>

								<div className="font-bold text-slate-800 truncate">{selected.Title}</div>
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
								تغییر قالب
							</Button>

							<Button
								type="button"
								variant="outline"
								disabled={disabled}
								onClick={handleClear}
								className="border-rose-200 text-rose-600 hover:bg-rose-50"
							>
								<X className="w-4 h-4" />
							</Button>
						</div>
					</div>
				) : loading ? (
					<div className="flex items-center gap-3 text-slate-500">
						<div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
							<User className="w-5 h-5 text-slate-400" />
						</div>

						<div>
							<div className="font-medium text-slate-700">در حال دریافت اطلاعات قالب پیامک...</div>
							<div className="text-xs text-slate-400 mt-1">لطفا چند لحظه صبر کنید.</div>
						</div>
					</div>
				) : (
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
						<div className="flex items-center gap-3 text-slate-500">
							<div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
								<User className="w-5 h-5 text-slate-400" />
							</div>

							<div>
								<div className="font-medium text-slate-700">هنوز قالب پیامک انتخاب نشده است</div>
								<div className="text-xs text-slate-400 mt-1">
									برای انتخاب قالب پیامک، از لیست جستجو کنید.
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

			<Popup show={open} onClose={() => setOpen(false)} title="انتخاب قالب پیامک از لیست">
				<SmsTempSelect value={selectedId} onChange={handleSelect} searchFilterKey="NationalCode" />
			</Popup>
		</div>
	);
}
