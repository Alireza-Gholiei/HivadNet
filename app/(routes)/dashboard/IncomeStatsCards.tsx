"use client";

import { formatNumber, formatPercent, formatPrice } from "@/utilities/Extentions/Formatters";

import { IncomeDashboardSummary } from "./DashboardService";

type Props = {
	summary: IncomeDashboardSummary;
};

export default function IncomeStatsCards({ summary }: Props) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<StatCard
				title="مبلغ کل قبل از تخفیف"
				value={formatPrice(summary.TotalPrice)}
				description="مجموع مبلغ سرویس‌ها پیش از اعمال تخفیف"
				variant="default"
			/>

			<StatCard
				title="درآمد خالص کل"
				value={formatPrice(summary.TotalEffectiveAmount)}
				description="درآمد نهایی پس از کسر تخفیف‌ها"
				variant="success"
			/>

			<StatCard
				title="مجموع تخفیف‌ها"
				value={formatPrice(summary.TotalDiscount)}
				description="جمع کل تخفیف‌های اعمال‌شده"
				variant="warning"
			/>

			<StatCard
				title="درآمد ماه جاری"
				value={formatPrice(summary.CurrentMonthIncome)}
				description="درآمد خالص ثبت‌شده در ماه جاری"
				variant="default"
			/>

			<StatCard
				title="درآمد ماه قبل"
				value={formatPrice(summary.PreviousMonthIncome)}
				description="درآمد خالص ثبت‌شده در ماه قبل"
				variant="default"
			/>

			<StatCard
				title="درآمد امروز"
				value={formatPrice(summary.TodayIncome)}
				description="درآمد خالص امروز"
				variant="success"
			/>

			<StatCard
				title="تعداد سرویس‌ها"
				value={formatNumber(summary.TotalServiceCount)}
				description="مجموع سرویس‌های ثبت‌شده"
				variant="default"
			/>

			<StatCard
				title="رشد ماهانه"
				value={formatPercent(summary.MonthlyGrowthPercent)}
				description={
					summary.MonthlyGrowthPercent >= 0
						? "افزایش نسبت به ماه قبل"
						: "کاهش نسبت به ماه قبل"
				}
				variant={summary.MonthlyGrowthPercent >= 0 ? "success" : "danger"}
			/>

			<StatCard
				title="میانگین درآمد هر سرویس"
				value={formatPrice(summary.AverageIncomePerService)}
				description="میانگین درآمد خالص به ازای هر سرویس"
				variant="default"
			/>
		</div>
	);
}

type StatCardProps = {
	title: string;
	value: string;
	description: string;
	variant?: "default" | "success" | "warning" | "danger";
};

function StatCard({
	title,
	value,
	description,
	variant = "default",
}: StatCardProps) {
	const wrapperClass =
		variant === "success"
			? "border-green-200 bg-green-50"
			: variant === "warning"
				? "border-yellow-200 bg-yellow-50"
				: variant === "danger"
					? "border-red-200 bg-red-50"
					: "border-gray-200 bg-white";

	const valueClass =
		variant === "success"
			? "text-green-700"
			: variant === "warning"
				? "text-yellow-700"
				: variant === "danger"
					? "text-red-700"
					: "text-gray-900";

	return (
		<div className={`rounded-2xl border p-5 shadow-sm ${wrapperClass}`}>
			<div className="text-sm font-medium text-gray-500">{title}</div>
			<div className={`mt-3 text-2xl font-bold ${valueClass}`}>{value}</div>
			<div className="mt-2 text-xs leading-5 text-gray-500">{description}</div>
		</div>
	);
}
