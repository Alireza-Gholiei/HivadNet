"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ServiceIncomeReportDto } from "@/dataBinding/models/Service/ServiceIncomeReportDto";
import { formatCompactPrice, formatNumber, formatPrice } from "@/utilities/Extentions/Formatters";

type Props = {
	data: ServiceIncomeReportDto[];
};

export default function YearlyIncomeChart({ data }: Props) {
	return (
		<div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
			<div className="mb-5">
				<h3 className="text-base font-bold text-gray-900">گزارش سالانه درآمد</h3>
				<p className="mt-1 text-xs text-gray-500">بررسی درآمد خالص و تعداد سرویس‌ها در سال‌های مختلف</p>
			</div>

			<div className="w-full min-w-0">
				<ResponsiveContainer width="100%" height={384} minWidth={0}>
					<BarChart data={data}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />

						<XAxis dataKey="PeriodTitle" tick={{ fontSize: 12 }} />

						<YAxis
							yAxisId="left"
							tick={{ fontSize: 12 }}
							tickFormatter={(value) => formatCompactPrice(Number(value))}
						/>

						<YAxis
							yAxisId="right"
							orientation="right"
							tick={{ fontSize: 12 }}
							tickFormatter={(value) => formatNumber(Number(value))}
						/>

						<Tooltip
							contentStyle={{
								borderRadius: "12px",
								border: "1px solid #e5e7eb",
								fontSize: "12px",
							}}
							formatter={(value, name) => {
								const key = String(name);

								if (key === "ServiceCount") {
									return [formatNumber(Number(value)), "تعداد سرویس"];
								}

								const labels: Record<string, string> = {
									TotalPrice: "مبلغ کل",
									TotalDiscount: "تخفیف",
									TotalEffectiveAmount: "درآمد خالص",
								};

								return [formatPrice(Number(value)), labels[key] || key];
							}}
							labelFormatter={(label) => `سال: ${label}`}
						/>

						<Legend />

						<Bar
							yAxisId="left"
							dataKey="TotalEffectiveAmount"
							name="درآمد خالص"
							fill="#16a34a"
							radius={[8, 8, 0, 0]}
						/>

						<Bar
							yAxisId="right"
							dataKey="ServiceCount"
							name="تعداد سرویس"
							fill="#7c3aed"
							radius={[8, 8, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
