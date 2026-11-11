import { RefreshCcw } from "lucide-react";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";

import { useGrid } from "@/utilities/hooks/Grid/UseGrid";
import { BaseGrid, GridData } from "@/utilities/models/Grid/base-grid.model";

import { Button } from "../ui/button";
import { Grid } from "./Grid";

export interface DataGridRef {
	reload: () => void;
	resetState: () => void;
}

interface DataGridProps<T> {
	fetchFunction: (params: BaseGrid) => Promise<GridData<T>>;
	initialLimit?: number;
	externalFilters?: Record<string, string | number | boolean>;
	onDataLoaded?: (data: T[], totalCount: number) => void;
	children?: React.ReactNode;
	layout?: "table" | "grid";
	rowClassName?: string | ((row: T) => string);
}

function DataGridInner<T>(
	{ fetchFunction, initialLimit = 10, onDataLoaded, children, layout, rowClassName = "" }: DataGridProps<T>,
	ref: React.Ref<DataGridRef>,
) {
	const {
		data,
		totalCount,
		gridState,
		isLoading,
		handlePageChange,
		handleLimitChange,
		handleSort,
		handleFilter,
		reload,
		resetState,
	} = useGrid<T>(fetchFunction, initialLimit);

	useImperativeHandle(
		ref,
		() => ({
			reload,
			resetState,
		}),
		[reload, resetState],
	);

	useEffect(() => {
		onDataLoaded?.(data, totalCount);
	}, [data, totalCount, onDataLoaded]);

	useEffect(() => {
		if (onDataLoaded && data) {
			onDataLoaded(data, totalCount);
		}
	}, [data, totalCount, onDataLoaded]);

	return (
		<div className="my-2">
			<div className="">
				<Button onClick={() => reload()} variant="outline">
					<RefreshCcw className="w-5 h-5" />
					بروزرسانی
				</Button>
			</div>
			<Grid<T>
				data={data}
				totalCount={totalCount}
				gridState={gridState}
				isLoading={isLoading}
				onSort={handleSort}
				onFilter={handleFilter}
				onPageChange={handlePageChange}
				onLimitChange={handleLimitChange}
				layout={layout}
				rowClassName={rowClassName}
			>
				{children}
			</Grid>
		</div>
	);
}

DataGridInner.displayName = "DataGrid";

export const DataGrid = forwardRef(DataGridInner) as <T>(
	props: DataGridProps<T> & { ref?: React.Ref<DataGridRef> },
) => React.ReactElement;
