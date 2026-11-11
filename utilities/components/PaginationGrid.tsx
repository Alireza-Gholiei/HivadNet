"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

import { BaseGrid } from "../models/Grid/base-grid.model";

interface PaginationGridProps {
	children: React.ReactNode;
	pageCount: number;
	initialGrid: BaseGrid;
	maxPagesToShow?: number;
	fixedPagination?: boolean;
	previousButtonClassName?: string;
	nextButtonClassName?: string;
	buttonClassName?: string;
	activeButtonClassName?: string;
	deActiveButtonClassName?: string;
	disabledButtonClassName?: string;
	ellipsisClassName?: string;
	containerClassName?: string;
}

export default function PaginationGrid({
	children,
	pageCount,
	initialGrid,
	maxPagesToShow = 5,
	fixedPagination = true,
	previousButtonClassName = "px-4 py-2 rounded-xl bg-gray-200 disabled:opacity-50 hover:bg-gray-300",
	nextButtonClassName = "px-4 py-2 rounded-xl bg-gray-200 disabled:opacity-50 hover:bg-gray-300",
	buttonClassName = "px-4 py-2 rounded-xl",
	activeButtonClassName = "bg-blue-500 text-white",
	deActiveButtonClassName = "bg-gray-200",
	disabledButtonClassName = "opacity-50 cursor-not-allowed",
	ellipsisClassName = "px-2 py-2",
	containerClassName = "flex justify-center items-center space-x-2 p-3 bg-white/80 backdrop-blur-sm rounded-t-xl shadow-md",
}: PaginationGridProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const initialPage = initialGrid.CurrentPage || 1;
	const [grid, setGrid] = useState<BaseGrid>({
		...initialGrid,
		CurrentPage: initialPage,
	});

	const onPageChange = (page: number) => {
		if (page < 1 || page > pageCount) return;

		const params = new URLSearchParams(searchParams);
		params.set("page", String(page));
		const paramPage = params.toString();

		router.replace(`${pathname}?${paramPage}`);
		window.scrollTo({ top: 0, behavior: "smooth" });

		setGrid({ ...grid, CurrentPage: page });
	};

	const getPageRange = () => {
		const pages: (number | string)[] = [];
		if (pageCount <= maxPagesToShow) {
			for (let i = 1; i <= pageCount; i++) pages.push(i);
		} else {
			const start = Math.max(2, grid.CurrentPage - Math.floor(maxPagesToShow / 2));
			const end = Math.min(pageCount - 1, start + maxPagesToShow - 1);
			pages.push(1);
			if (start > 2) pages.push("...");
			for (let i = start; i <= end; i++) pages.push(i);
			if (end < pageCount - 1) pages.push("...");
			pages.push(pageCount);
		}
		return pages;
	};

	if (pageCount <= 1) return <>{children}</>;

	return (
		<div className="relative min-h-screen pb-24">
			{children}

			<div
				className={`${containerClassName} ${fixedPagination ? "fixed bottom-19 left-0 right-0 z-50" : "mt-6"}`}
			>
				<div className="flex justify-center items-center gap-1 sm:gap-2 px-2 sm:px-4 w-full max-w-full">
					<button
						disabled={grid.CurrentPage === 1}
						onClick={() => onPageChange(grid.CurrentPage - 1)}
						className={`${previousButtonClassName} ${
							grid.CurrentPage === 1 ? disabledButtonClassName : ""
						}`}
					>
						قبلی
					</button>
					<div className="flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar shrink">
						{getPageRange().map((page, index) =>
							page === "..." ? (
								<span key={index} className={ellipsisClassName}>
									...
								</span>
							) : (
								<button
									key={index}
									onClick={() => onPageChange(Number(page))}
									className={`${buttonClassName} ${
										grid.CurrentPage === page ? activeButtonClassName : deActiveButtonClassName
									}`}
								>
									{page}
								</button>
							),
						)}
					</div>
					<button
						disabled={grid.CurrentPage === pageCount}
						onClick={() => onPageChange(grid.CurrentPage + 1)}
						className={`${nextButtonClassName} ${
							grid.CurrentPage === pageCount ? disabledButtonClassName : ""
						}`}
					>
						بعدی
					</button>
				</div>
			</div>
		</div>
	);
}
