"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ServiceIncomeReportDto } from "@/dataBinding/models/Service/ServiceIncomeReportDto";
import { formatCompactPrice, formatPrice } from "@/utilities/Extentions/Formatters";

type Props = {
	data: ServiceIncomeReportDto[];
};

export default function MonthlyIncomeChart({ data }: Props) {
	return (
		<div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
			<div className="mb-5">
				<h3 className="text-base font-bold text-gray-900">درآمد ماهانه</h3>
				<p className="mt-1 text-xs text-gray-500">مقایسه درآمد خالص، مبلغ کل و تخفیف در ماه‌های مختلف</p>
			</div>

			<div className="w-full min-w-0">
				<ResponsiveContainer width="100%" height={320} minWidth={0}>
					<BarChart data={data}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />

						<XAxis dataKey="PeriodTitle" tick={{ fontSize: 12 }} />

						<YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCompactPrice(Number(value))} />

						<Tooltip
							contentStyle={{
								borderRadius: "12px",
								border: "1px solid #e5e7eb",
								fontSize: "12px",
							}}
							formatter={(value, name) => {
								const labels: Record<string, string> = {
									TotalPrice: "مبلغ کل",
									TotalDiscount: "تخفیف",
									TotalEffectiveAmount: "درآمد خالص",
								};

								return [formatPrice(Number(value)), labels[String(name)] || String(name)];
							}}
							labelFormatter={(label) => `بازه: ${label}`}
						/>

						<Legend />

						<Bar dataKey="TotalPrice" name="مبلغ کل" fill="#2563eb" radius={[8, 8, 0, 0]} />

						<Bar dataKey="TotalEffectiveAmount" name="درآمد خالص" fill="#16a34a" radius={[8, 8, 0, 0]} />

						<Bar dataKey="TotalDiscount" name="تخفیف" fill="#f59e0b" radius={[8, 8, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
