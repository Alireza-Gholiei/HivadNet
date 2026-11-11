"use client";

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ServiceIncomeReportDto } from "@/dataBinding/models/Service/ServiceIncomeReportDto";
import { formatCompactPrice, formatPrice } from "@/utilities/Extentions/Formatters";

type Props = {
	data: ServiceIncomeReportDto[];
};

export default function DailyIncomeChart({ data }: Props) {
	return (
		<div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
			<div className="mb-5">
				<h3 className="text-base font-bold text-gray-900">روند درآمد روزانه</h3>
				<p className="mt-1 text-xs text-gray-500">نمایش مبلغ کل، تخفیف و درآمد خالص در روزهای اخیر</p>
			</div>

			<div className="w-full min-w-0">
				<ResponsiveContainer width="100%" height={320} minWidth={0}>
					<AreaChart data={data}>
						<defs>
							<linearGradient id="dailyTotalPrice" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
								<stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
							</linearGradient>

							<linearGradient id="dailyEffectiveAmount" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
								<stop offset="95%" stopColor="#16a34a" stopOpacity={0.03} />
							</linearGradient>

							<linearGradient id="dailyDiscount" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
								<stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
							</linearGradient>
						</defs>

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

						<Area
							type="monotone"
							dataKey="TotalPrice"
							name="مبلغ کل"
							stroke="#2563eb"
							strokeWidth={2}
							fill="url(#dailyTotalPrice)"
						/>

						<Area
							type="monotone"
							dataKey="TotalEffectiveAmount"
							name="درآمد خالص"
							stroke="#16a34a"
							strokeWidth={2}
							fill="url(#dailyEffectiveAmount)"
						/>

						<Area
							type="monotone"
							dataKey="TotalDiscount"
							name="تخفیف"
							stroke="#f59e0b"
							strokeWidth={2}
							fill="url(#dailyDiscount)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
