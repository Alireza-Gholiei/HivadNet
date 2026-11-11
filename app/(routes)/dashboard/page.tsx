"use client";

import { BarChart3 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import { ServiceIncomeReportDto } from "@/dataBinding/models/Service/ServiceIncomeReportDto";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent } from "@/utilities/components/ui/card";

import { buildIncomeDashboardSummary, getIncomeDashboardReports } from "./DashboardService";
import IncomeStatsCards from "./IncomeStatsCards";

type ReportsState = {
	dailyReports: ServiceIncomeReportDto[];
	monthlyReports: ServiceIncomeReportDto[];
	yearlyReports: ServiceIncomeReportDto[];
};

export default function IncomeDashboardView() {
	const [reports, setReports] = useState<ReportsState | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		void loadData();
	}, []);

	const loadData = async () => {
		try {
			setLoading(true);
			setError(null);

			const result = await getIncomeDashboardReports();

			setReports(result);
		} catch (err) {
			console.error(err);
			setError("خطا در دریافت اطلاعات داشبورد درآمد");
		} finally {
			setLoading(false);
		}
	};

	const summary = useMemo(() => {
		if (!reports) return null;

		return buildIncomeDashboardSummary({
			dailyReports: reports.dailyReports,
			monthlyReports: reports.monthlyReports,
			yearlyReports: reports.yearlyReports,
		});
	}, [reports]);

	if (loading) {
		return <IncomeDashboardSkeleton />;
	}

	if (error || !reports || !summary) {
		return (
			<div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
				<div className="font-bold">خطا</div>
				<div className="mt-2 text-sm">{error || "اطلاعاتی برای نمایش وجود ندارد"}</div>

				<Button
					type="button"
					onClick={() => void loadData()}
					className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
				>
					تلاش مجدد
				</Button>
			</div>
		);
	}

	const DailyIncomeChart = dynamic(() => import("./DailyIncomeChart"), { ssr: false });
	const MonthlyIncomeChart = dynamic(() => import("./MonthlyIncomeChart"), { ssr: false });
	const YearlyIncomeChart = dynamic(() => import("./YearlyIncomeChart"), { ssr: false });

	return (
		<div>
			<HraderTitle
				title="داشبورد مالی"
				description="گزارش درآمد سرویس‌ها بر اساس بازه‌های روزانه، ماهانه و سالانه"
				icon={<BarChart3 />}
			/>

			<PageCard>
				<PageCardContent className="space-y-6">
					<IncomeStatsCards summary={summary} />

					<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
						<div className="min-w-0">
							<DailyIncomeChart data={sortByPeriodKey(reports.dailyReports)} />
						</div>

						<div className="min-w-0">
							<MonthlyIncomeChart data={sortByPeriodKey(reports.monthlyReports)} />
						</div>
					</div>

					<div className="min-w-0">
						<YearlyIncomeChart data={sortByPeriodKey(reports.yearlyReports)} />
					</div>
				</PageCardContent>
			</PageCard>
		</div>
	);
}

function sortByPeriodKey<T extends { PeriodKey?: string | null }>(items: T[]): T[] {
	return [...items].sort((a, b) => {
		const aKey = String(a.PeriodKey ?? "");
		const bKey = String(b.PeriodKey ?? "");

		if (!aKey && !bKey) return 0;
		if (!aKey) return -1;
		if (!bKey) return 1;

		return aKey.localeCompare(bKey, "fa-IR");
	});
}

function IncomeDashboardSkeleton() {
	return (
		<div className="space-y-6">
			<div className="h-16 animate-pulse rounded-2xl bg-gray-100" />

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{Array.from({ length: 8 }).map((_, index) => (
					<div key={index} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
				))}
			</div>

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
				<div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
				<div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
			</div>

			<div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
		</div>
	);
}
