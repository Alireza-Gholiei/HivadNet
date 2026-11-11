"use client";

interface PaginationProps {
	currentPage: number;
	pageCount: number;
	maxPagesToShow?: number;
	onPageChange: (page: number) => void;
	previousButtonClassName?: string;
	nextButtonClassName?: string;
	buttonClassName?: string;
	activeButtonClassName?: string;
	deActiveButtonClassName?: string;
	disabledButtonClassName?: string;
	ellipsisClassName?: string;
	containerClassName?: string;
}

export default function Pagination({
	currentPage,
	pageCount,
	maxPagesToShow = 5,
	onPageChange,
	previousButtonClassName = "px-4 py-2 rounded-xl bg-gray-200 disabled:opacity-50 hover:bg-gray-300",
	nextButtonClassName = "px-4 py-2 rounded-xl bg-gray-200 disabled:opacity-50 hover:bg-gray-300",
	buttonClassName = "px-4 py-2 rounded-xl",
	activeButtonClassName = "bg-blue-500 text-white",
	deActiveButtonClassName = "bg-gray-200",
	disabledButtonClassName = "opacity-50 cursor-not-allowed",
	ellipsisClassName = "px-2 py-2",
	containerClassName = "flex justify-center mt-6 space-x-2",
}: PaginationProps) {
	const getPageRange = () => {
		const pages: (number | string)[] = [];

		if (pageCount <= maxPagesToShow + 2) {
			for (let i = 1; i <= pageCount; i++) pages.push(i);
		} else {
			const start = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
			const end = Math.min(pageCount - 1, start + maxPagesToShow - 1);

			pages.push(1);

			if (start > 2) pages.push("...");

			for (let i = start; i <= end; i++) pages.push(i);

			if (end < pageCount - 1) pages.push("...");

			pages.push(pageCount);
		}

		return pages;
	};

	if (pageCount <= 1) return null;

	return (
		<div className={containerClassName}>
			<button
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
				className={`${previousButtonClassName} ${currentPage === 1 ? disabledButtonClassName : ""}`}
			>
				قبلی
			</button>

			{getPageRange().map((page, index) =>
				page === "..." ? (
					<span key={index} className={ellipsisClassName}>
						...
					</span>
				) : (
					<button
						key={index}
						onClick={() => onPageChange(Number(page))}
						className={`${buttonClassName} ${currentPage === page ? activeButtonClassName : deActiveButtonClassName}`}
					>
						{page}
					</button>
				),
			)}

			<button
				disabled={currentPage === pageCount}
				onClick={() => onPageChange(currentPage + 1)}
				className={`${nextButtonClassName} ${currentPage === pageCount ? disabledButtonClassName : ""}`}
			>
				بعدی
			</button>
		</div>
	);
}
