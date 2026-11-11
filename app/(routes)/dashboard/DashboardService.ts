import { ServiceIncomeReportDto } from "@/dataBinding/models/Service/ServiceIncomeReportDto";
import { ServiceService } from "@/dataBinding/services/Service/ServiceService";

export type IncomeDashboardFilters = {
	FromDate?: string | Date | null;
	ToDate?: string | Date | null;
	CustomerId?: number | null;
	GuildId?: number | null;
	GuildGroupId?: number | null;
};

export type IncomeDashboardReports = {
	dailyReports: ServiceIncomeReportDto[];
	monthlyReports: ServiceIncomeReportDto[];
	yearlyReports: ServiceIncomeReportDto[];
};

export async function getIncomeDashboardReports(filters: IncomeDashboardFilters = {}): Promise<IncomeDashboardReports> {
	const baseQuery = {
		FromDate: filters.FromDate,
		ToDate: filters.ToDate,
		CustomerId: filters.CustomerId,
		GuildId: filters.GuildId,
		GuildGroupId: filters.GuildGroupId,
	};

	const dailyReports = await ServiceService.getServiceIncomeReport({
		...baseQuery,
		Aggregation: 1,
	});
	const monthlyReports = await ServiceService.getServiceIncomeReport({
		...baseQuery,
		Aggregation: 2,
	});
	const yearlyReports = await ServiceService.getServiceIncomeReport({
		...baseQuery,
		Aggregation: 3,
	});

	return {
		dailyReports: dailyReports ?? [],
		monthlyReports: monthlyReports ?? [],
		yearlyReports: yearlyReports ?? [],
	};
}

export type IncomeDashboardSummary = {
	TotalPrice: number;
	TotalDiscount: number;
	TotalEffectiveAmount: number;
	CurrentMonthIncome: number;
	PreviousMonthIncome: number;
	TodayIncome: number;
	TotalServiceCount: number;
	AverageIncomePerService: number;
	MonthlyGrowthPercent: number;
};

export function buildIncomeDashboardSummary(params: {
	dailyReports: ServiceIncomeReportDto[];
	monthlyReports: ServiceIncomeReportDto[];
	yearlyReports: ServiceIncomeReportDto[];
}): IncomeDashboardSummary {
	const dailyReports = sortByPeriodKey(params.dailyReports);
	const monthlyReports = sortByPeriodKey(params.monthlyReports);
	const yearlyReports = sortByPeriodKey(params.yearlyReports);

	const totalPrice = yearlyReports.reduce((sum, item) => sum + Number(item.TotalPrice || 0), 0);

	const totalDiscount = yearlyReports.reduce((sum, item) => sum + Number(item.TotalDiscount || 0), 0);

	const totalEffectiveAmount = yearlyReports.reduce((sum, item) => sum + Number(item.TotalEffectiveAmount || 0), 0);

	const totalServiceCount = yearlyReports.reduce((sum, item) => sum + Number(item.ServiceCount || 0), 0);

	const today = dailyReports.at(-1);
	const currentMonth = monthlyReports.at(-1);
	const previousMonth = monthlyReports.at(-2);

	const currentMonthIncome = Number(currentMonth?.TotalEffectiveAmount || 0);
	const previousMonthIncome = Number(previousMonth?.TotalEffectiveAmount || 0);

	const monthlyGrowthPercent =
		previousMonthIncome > 0
			? ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100
			: currentMonthIncome > 0
				? 100
				: 0;

	const averageIncomePerService = totalServiceCount > 0 ? Math.round(totalEffectiveAmount / totalServiceCount) : 0;

	return {
		TotalPrice: totalPrice,
		TotalDiscount: totalDiscount,
		TotalEffectiveAmount: totalEffectiveAmount,
		CurrentMonthIncome: currentMonthIncome,
		PreviousMonthIncome: previousMonthIncome,
		TodayIncome: Number(today?.TotalEffectiveAmount || 0),
		TotalServiceCount: totalServiceCount,
		AverageIncomePerService: averageIncomePerService,
		MonthlyGrowthPercent: monthlyGrowthPercent,
	};
}

export function sortByPeriodKey<T extends { PeriodKey?: string }>(items: T[]) {
	return [...items].sort((a, b) => {
		const aKey = a.PeriodKey || "";
		const bKey = b.PeriodKey || "";
		return aKey.localeCompare(bKey);
	});
}
