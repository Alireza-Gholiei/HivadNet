"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { useHeader } from "@/dataBinding/hocks/HeaderContext";
import { Button } from "@/utilities/components/ui/button";

export default function PageHeaderLayout({ className = "" }: { className?: string }) {
	const router = useRouter();
	const { headerData } = useHeader();
	const { title, description, icon, showBackButton, backButtonText } = headerData;

	const handleBack = () => {
		router.back();
	};

	if (!title) return null;

	return (
		<header
			className={`relative w-full bg-white backdrop-blur-md border-b border-slate-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] z-10 ${className}`}
		>
			<div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

			<div className="px-3 sm:pr-14 md:pr-3 py-1">
				<div className="w-full flex flex-col gap-5 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="min-w-0 flex-1 flex items-start gap-4 sm:gap-2">
						{icon && (
							<div className="shrink-0 flex sm:h-7 sm:w-7 h-8 w-8 items-center mt-3.5 justify-center rounded-xs bg-cyan-50 text-cyan-600 border border-cyan-100 shadow-sm">
								{icon}
							</div>
						)}
						<div className="flex flex-col justify-center pt-1">
							<h1 className="text-xl sm:text-lg font-extrabold text-slate-800 tracking-tight">{title}</h1>
							{description && <p className="mt-1 text-sm font-medium text-slate-500">{description}</p>}
						</div>
					</div>

					{showBackButton && (
						<div className="shrink-0">
							<Button
								variant="outline"
								type="button"
								size="sm"
								onClick={handleBack}
								className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 sm:px-5 sm:py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
							>
								<ArrowRight className="h-5 w-5 sm:h-4 sm:w-4 text-slate-500 transition-transform duration-200 group-hover:-translate-x-1" />
								<span className="sm:hidden md:inline">{backButtonText}</span>
							</Button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
