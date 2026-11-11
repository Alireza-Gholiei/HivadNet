"use client";

import { Check } from "lucide-react";

import { Button } from "@/utilities/components/ui/button";

type MonthMultiSelectProps = {
	value?: number[];
	onChange: (months: number[]) => void;
	error?: string;
	disabled?: boolean;
};

const persianMonths = [
	{ id: 1, title: "فروردین" },
	{ id: 2, title: "اردیبهشت" },
	{ id: 3, title: "خرداد" },
	{ id: 4, title: "تیر" },
	{ id: 5, title: "مرداد" },
	{ id: 6, title: "شهریور" },
	{ id: 7, title: "مهر" },
	{ id: 8, title: "آبان" },
	{ id: 9, title: "آذر" },
	{ id: 10, title: "دی" },
	{ id: 11, title: "بهمن" },
	{ id: 12, title: "اسفند" },
];

export default function MonthMultiSelect({ value = [], onChange, error, disabled = false }: MonthMultiSelectProps) {
	const selectedMonths = Array.isArray(value) ? value : [];

	const toggleMonth = (monthId: number) => {
		if (disabled) return;

		const exists = selectedMonths.includes(monthId);

		if (exists) {
			onChange(selectedMonths.filter((x) => x !== monthId));
		} else {
			onChange([...selectedMonths, monthId].sort((a, b) => a - b));
		}
	};

	return (
		<div className="space-y-2">
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
				{persianMonths.map((month) => {
					const selected = selectedMonths.includes(month.id);

					return (
						<Button
							key={month.id}
							type="button"
							disabled={disabled}
							onClick={() => toggleMonth(month.id)}
							className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all disabled:opacity-60 ${
								selected
									? "border-indigo-500 bg-indigo-50 text-indigo-700"
									: "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
							}`}
						>
							<span>{month.title}</span>

							{selected && (
								<span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
									<Check className="h-3.5 w-3.5" />
								</span>
							)}
						</Button>
					);
				})}
			</div>

			{error && <p className="text-rose-500 text-sm font-medium">{error}</p>}
		</div>
	);
}
