import {
	ChevronLeft,
	Clock,
	Code2,
	Layers,
	LineChart,
	MessageSquare,
	MonitorPlay,
	Receipt,
	Sparkles,
	UserPlus,
	Users,
} from "lucide-react";
import Link from "next/link";

import pkg from "../../package.json";

const quickAccessLinks = [
	{
		title: "مدیریت مشتریان",
		href: "/customers",
		icon: Users,
		color: "text-blue-500",
		bg: "bg-blue-500/10",
		hoverBorder: "hover:border-blue-500/50",
	},
	{
		title: "افزودن مشتری جدید",
		href: "/customers/Add",
		icon: UserPlus,
		color: "text-emerald-500",
		bg: "bg-emerald-500/10",
		hoverBorder: "hover:border-emerald-500/50",
	},
	{
		title: "سامانه‌های فعال",
		href: "/Guild",
		icon: MonitorPlay,
		color: "text-violet-500",
		bg: "bg-violet-500/10",
		hoverBorder: "hover:border-violet-500/50",
	},
	{
		title: "صورت‌حساب مشتریان",
		href: "/Transactions/All",
		icon: Receipt,
		color: "text-rose-500",
		bg: "bg-rose-500/10",
		hoverBorder: "hover:border-rose-500/50",
	},
	{
		title: "ارسال پیامک",
		href: "/Messaging/Sms",
		icon: MessageSquare,
		color: "text-amber-500",
		bg: "bg-amber-500/10",
		hoverBorder: "hover:border-amber-500/50",
	},
	{
		title: "داشبورد درآمد",
		href: "/dashboard",
		icon: LineChart,
		color: "text-cyan-500",
		bg: "bg-cyan-500/10",
		hoverBorder: "hover:border-cyan-500/50",
	},
	{
		title: "لیست خدمات",
		href: "/service",
		icon: Layers,
		color: "text-indigo-500",
		bg: "bg-indigo-500/10",
		hoverBorder: "hover:border-indigo-500/50",
	},
	{
		title: "ورود و خروج من",
		href: "/Auth/Employee/Timesheet",
		icon: Clock,
		color: "text-orange-500",
		bg: "bg-orange-500/10",
		hoverBorder: "hover:border-orange-500/50",
	},
];

export default function HomePage() {
	const currentVersion = pkg.version || "1.0.0";

	return (
		<div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
			<div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 shadow-2xl sm:p-12">
				<div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
				<div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[100px] pointer-events-none" />

				<div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" />

				<div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
					<div className="space-y-5">
						<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
							<Sparkles className="h-4 w-4 text-blue-400" />
							<span className="text-sm font-medium text-slate-300">هیوادنت • نسخه {currentVersion}</span>
						</div>

						<h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
							داشبورد مدیریت <br className="hidden sm:block" />
							<span className="bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
								هیوادنت
							</span>
						</h1>

						<p className="max-w-xl text-lg text-slate-400 leading-relaxed">
							سیستم جامع مدیریت هوشمند با دسترسی سریع به ابزارهای مشتریان، سامانه‌ها، امور مالی و
							پیام‌رسانی.
						</p>
					</div>

					<div className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md md:w-72">
						<div className="flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-violet-600 shadow-inner">
								<span className="text-lg font-black text-white">ATS</span>
							</div>
							<div>
								<h3 className="font-semibold text-white">آریا طراحان سورن</h3>
								<p className="text-xs text-slate-400">توسعه دهنده سیستم</p>
							</div>
						</div>
						<div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent my-1" />
						<p className="text-xs text-slate-500 text-center">تمامی حقوق مادی و معنوی محفوظ است</p>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<div className="flex items-center gap-3 px-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
						<Sparkles className="h-5 w-5" />
					</div>
					<h2 className="text-xl font-bold text-slate-800 dark:text-white">دسترسی سریع</h2>
					<div className="h-px flex-1 bg-linear-to-l from-slate-200 to-transparent dark:from-slate-800" />
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{quickAccessLinks.map((link, index) => {
						const Icon = link.icon;
						return (
							<Link
								key={index}
								href={link.href}
								className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 ${link.hoverBorder}`}
							>
								<div className="absolute inset-0 bg-linear-to-br from-transparent to-slate-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-slate-800/50" />

								<div className="relative z-10 flex items-start justify-between">
									<div
										className={`flex h-12 w-12 items-center justify-center rounded-xl ${link.bg} ${link.color}`}
									>
										<Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
									</div>
									<ChevronLeft className="h-5 w-5 text-slate-300 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400" />
								</div>

								<div className="relative z-10 mt-4">
									<h3 className="font-semibold text-slate-800 dark:text-slate-200 transition-colors group-hover:text-slate-900 dark:group-hover:text-white">
										{link.title}
									</h3>
								</div>
							</Link>
						);
					})}
				</div>
			</div>

			<div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
				<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div className="flex items-center gap-4">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-slate-800 to-slate-950 shadow-lg dark:from-slate-700 dark:to-slate-800">
							<Code2 className="h-8 w-8 text-white" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-slate-800 dark:text-white">هیوادنت (HivadNet)</h2>
							<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
								سیستم جامع مدیریت مشتریان و سامانه‌ها
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50 md:min-w-62.5">
						<div className="flex justify-between text-sm">
							<span className="text-slate-500 dark:text-slate-400">نسخه سیستم:</span>
							<span className="font-semibold text-slate-800 dark:text-slate-200">{currentVersion}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-slate-500 dark:text-slate-400">توسعه‌دهنده:</span>
							<span className="font-semibold text-blue-600 dark:text-blue-400">آریا طراحان سورن</span>
						</div>
						<div className="mt-2 border-t border-slate-200 pt-2 text-center text-xs text-slate-400 dark:border-slate-700">
							© تمامی حقوق مادی و معنوی محفوظ است.
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
