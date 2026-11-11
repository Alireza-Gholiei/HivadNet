import React from "react";

import { BaseGrid, ColumnDef, defineColumns, OrderType } from "@/utilities/models/Grid/base-grid.model";
import { Select } from "../ui/select";

interface GridProps<T> {
	data: T[];
	children?: React.ReactNode;
	rowClassName?: string | ((row: T) => string);
	totalCount: number;
	gridState: BaseGrid;
	isLoading?: boolean;
	onSort: (field: string) => void;
	onFilter: (key: string, value: string) => void;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
	layout?: "table" | "grid";
}

export const Grid = <T,>({
	data,
	children,
	rowClassName,
	totalCount,
	gridState,
	isLoading = false,
	layout = "table",
	onSort,
	onFilter,
	onPageChange,
	onLimitChange,
}: GridProps<T>) => {
	const rawColumns: ColumnDef<T>[] = [];
	React.Children.forEach(children, (child) => {
		if (React.isValidElement(child)) {
			rawColumns.push(child.props as ColumnDef<T>);
		}
	});
	const columns = defineColumns(rawColumns);

	const totalPages = Math.ceil(totalCount / gridState.Limit);

	if (layout === "grid") {
		const sortableColumns = columns.filter((col) => col.sortable);
		const filterableColumns = columns.filter((col) => col.filterable);

		return (
			<div className="w-full flex flex-col gap-4 my-3 rounded-xl border-2">
				{(sortableColumns.length > 0 || filterableColumns.length > 0) && (
					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
						{filterableColumns.length > 0 && (
							<div className="flex flex-wrap items-center gap-3 w-full lg:w-auto flex-1">
								{filterableColumns.map((col) => {
									const filterKey = col.filterKey ?? col.field;
									const currentFilter =
										gridState.FilterParam.find((f) => f.Key === filterKey)?.Value || "";

									return (
										<input
											key={`grid-filter-${String(filterKey)}`}
											type="text"
											placeholder={`جستجو در ${col.header}...`}
											className="w-full sm:w-48 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-indigo-500 transition-colors"
											value={currentFilter}
											onChange={(e) => {
												onFilter(String(filterKey), e.target.value);
											}}
										/>
									);
								})}
							</div>
						)}

						{sortableColumns.length > 0 && (
							<div className="flex items-center gap-2 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-r border-slate-200 pt-3 lg:pt-0 lg:pr-4">
								<span className="text-sm text-slate-600 font-medium whitespace-nowrap">مرتب‌سازی:</span>
								<Select
									value={gridState.OrderField || null}
									onValueChange={(value) => {
										if (value) {
											onSort(String(value));
										}
									}}
									options={sortableColumns
										.map((col) => {
											const sortKey = col.sortKey ?? col.field;

											return sortKey
												? {
														label: col.header,
														value: String(sortKey),
													}
												: null;
										})
										.filter((item): item is { label: string; value: string } => item !== null)}
									placeholder="انتخاب کنید..."
									clearable
									disabled={isLoading}
								/>

								{gridState.OrderField && (
									<button
										className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm transition-colors flex items-center justify-center min-w-10"
										onClick={() => onSort(gridState.OrderField)}
										title="تغییر جهت مرتب‌سازی"
									>
										{gridState.OrderType === OrderType.Ascending ? "▲" : "▼"}
									</button>
								)}
							</div>
						)}
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
					{isLoading ? (
						<div className="col-span-full text-center py-8 text-slate-500">در حال بارگذاری...</div>
					) : data.length === 0 ? (
						<div className="col-span-full text-center py-8 text-slate-500">داده‌ای یافت نشد.</div>
					) : (
						data.map((item, rowIndex) => (
							<div key={rowIndex} className="contents">
								{columns.map((col, colIndex) => {
									if (col.render?.length && col.render.length > 0) {
										return <div key={`${rowIndex}-${colIndex}`}>{col.render(item, colIndex)}</div>;
									}
									return null;
								})}
							</div>
						))
					)}
				</div>

				<GridPagination
					gridState={gridState}
					isLoading={isLoading}
					totalPages={totalPages}
					totalCount={totalCount}
					onLimitChange={onLimitChange}
					onPageChange={onPageChange}
				/>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-4 rounded-lg border my-3">
			<div className="overflow-x-auto border rounded-lg shadow-sm">
				<table className="min-w-full divide-y divide-gray-200 text-sm">
					<thead className="bg-gray-50">
						<tr>
							{columns.map((col, index) => {
								const sortKey = col.sortKey ?? col.field;
								return (
									<th key={index} className="px-4 py-3 text-right font-medium text-gray-700">
										<div
											className={`flex items-center gap-1 ${col.sortable ? "cursor-pointer select-none hover:text-blue-600" : ""}`}
											onClick={() => col.sortable && sortKey && onSort(sortKey.toString())}
										>
											{col.header}
											{col.sortable && gridState.OrderField === sortKey && (
												<span>{gridState.OrderType === OrderType.Ascending ? " ▲" : " ▼"}</span>
											)}
										</div>
									</th>
								);
							})}
						</tr>

						<tr>
							{columns.map((col) => {
								const filterKey = col.filterKey ?? col.field;
								return (
									<th key={`filter-${String(col.field)}`} className="px-4 py-2 border-t">
										{col.filterable && filterKey ? (
											<input
												type="text"
												placeholder="جستجو..."
												className="w-full px-2 py-1 border rounded text-xs"
												onKeyDown={(e) => {
													e.key === "Enter" &&
														(e.preventDefault(),
														onFilter(filterKey.toString(), (e.currentTarget as any).value));
												}}
												defaultValue={
													gridState.FilterParam.find((f) => f.Key === filterKey)?.Value || ""
												}
											/>
										) : null}
									</th>
								);
							})}
						</tr>
					</thead>

					<tbody className="bg-white divide-y divide-gray-200">
						{isLoading ? (
							<tr>
								<td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
									در حال بارگذاری...
								</td>
							</tr>
						) : data.length === 0 ? (
							<tr>
								<td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
									داده‌ای یافت نشد.
								</td>
							</tr>
						) : (
							data.map((item, rowIndex) => {
								const dynamicRowClass =
									typeof rowClassName === "function" ? rowClassName(item) : rowClassName || "";

								return (
									<tr
										key={rowIndex}
										className={`hover:bg-gray-50 transition-colors ${dynamicRowClass}`}
									>
										{columns.map((col, index) => (
											<td key={String(col.field)} className="px-4 py-3 text-gray-800">
												{col.render ? col.render(item, index) : String(item[col.field] ?? "")}
											</td>
										))}
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			<GridPagination
				gridState={gridState}
				isLoading={isLoading}
				totalPages={totalPages}
				totalCount={totalCount}
				onLimitChange={onLimitChange}
				onPageChange={onPageChange}
			/>
		</div>
	);
};

const GridPagination = ({
	gridState,
	isLoading,
	totalPages,
	totalCount,
	onLimitChange,
	onPageChange,
}: {
	gridState: BaseGrid;
	isLoading: boolean;
	totalPages: number;
	totalCount: number;
	onLimitChange: (limit: number) => void;
	onPageChange: (page: number) => void;
}) => (
	<div className="flex flex-wrap items-center justify-between gap-4 text-sm bg-gray-50 p-4 rounded-lg border">
		<div className="flex items-center gap-2">
			<span>تعداد در صفحه:</span>
			<Select
				value={gridState.Limit}
				onValueChange={(value) => {
					onLimitChange(Number(value));
				}}
				options={[
					{ label: "۵", value: 5 },
					{ label: "۱۰", value: 10 },
					{ label: "۲۰", value: 20 },
					{ label: "۵۰", value: 50 },
					{ label: "۱۰۰", value: 100 },
				]}
				placeholder="تعداد"
				disabled={isLoading}
			/>
		</div>

		<div className="flex items-center gap-4">
			<span>
				صفحه {gridState.CurrentPage} از {totalPages || 1}
			</span>
			<span>(کل رکوردها: {totalCount})</span>
		</div>

		<div className="flex items-center gap-2">
			<button
				className="px-3 py-1 border rounded bg-white disabled:opacity-50"
				disabled={gridState.CurrentPage <= 1 || isLoading}
				onClick={() => onPageChange(gridState.CurrentPage - 1)}
			>
				قبلی
			</button>
			<button
				className="px-3 py-1 border rounded bg-white disabled:opacity-50"
				disabled={gridState.CurrentPage >= totalPages || isLoading}
				onClick={() => onPageChange(gridState.CurrentPage + 1)}
			>
				بعدی
			</button>
		</div>
	</div>
);
