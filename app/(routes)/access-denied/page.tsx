"use client";

import { ArrowRight, Home, LockKeyhole, ShieldAlert, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccessDeniedPage() {
	const router = useRouter();

	const handleBack = () => {
		router.back();
	};

	return (
		<div
			className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-white to-rose-50 p-4 font-sans"
			dir="rtl"
		>
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-20 -right-15 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
				<div className="absolute -bottom-25 -left-20 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
				<div className="absolute top-1/3 left-1/4 h-40 w-40 rounded-full bg-blue-100/30 blur-2xl" />
			</div>

			<div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_20px_80px_-20px_rgba(15,23,42,0.25)] backdrop-blur-xl">
				<div className="absolute inset-x-0 top-0 h-1 bg-linear-to-l from-rose-500 via-orange-400 to-amber-400" />

				<div className="p-8 sm:p-10">
					<div className="mb-8 flex justify-center">
						<div className="relative">
							<div className="absolute inset-0 rounded-full bg-rose-500/20 blur-2xl" />
							<div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-rose-100 to-rose-50 ring-8 ring-rose-50 shadow-inner">
								<ShieldAlert className="h-11 w-11 text-rose-600" />
							</div>
							<div className="absolute -left-1 -top-1 rounded-full bg-white p-2 shadow-md">
								<LockKeyhole className="h-4 w-4 text-slate-600" />
							</div>
							<div className="absolute -bottom-1 -right-1 rounded-full bg-amber-100 p-2 shadow-md">
								<Sparkles className="h-4 w-4 text-amber-500" />
							</div>
						</div>
					</div>

					<div className="text-center">
						<div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
							<span className="h-2 w-2 rounded-full bg-rose-500" />
							خطای سطح دسترسی
						</div>

						<h1 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
							دسترسی غیرمجاز
						</h1>

						<p className="mx-auto mb-8 max-w-md leading-8 text-slate-600">
							متأسفانه شما مجوز لازم برای مشاهده این صفحه یا انجام این عملیات را ندارید. اگر فکر می‌کنید
							این مورد اشتباه است، لطفاً با مدیر سیستم تماس بگیرید.
						</p>
					</div>

					<div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-7 text-slate-600">
						<div className="mb-1 font-bold text-slate-800">پیشنهاد:</div>
						<ul className="space-y-1 pr-5 list-disc marker:text-rose-500">
							<li>به صفحه اصلی بازگردید و از منو مجدداً مسیر را بررسی کنید.</li>
							<li>در صورت نیاز، از مدیر سیستم درخواست سطح دسترسی کنید.</li>
							<li>اگر از لینک مستقیم وارد شده‌اید، ممکن است این صفحه برای نقش شما فعال نباشد.</li>
						</ul>
					</div>

					<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
						<button
							type="button"
							onClick={handleBack}
							className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
						>
							<ArrowRight className="h-4 w-4" />
							<span>بازگشت به صفحه قبل</span>
						</button>

						<Link
							href="/"
							className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-l from-indigo-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98]"
						>
							<Home className="h-5 w-5" />
							<span>بازگشت به صفحه اصلی</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
