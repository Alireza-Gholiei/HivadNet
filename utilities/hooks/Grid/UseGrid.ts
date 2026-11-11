import { useCallback, useEffect, useMemo, useState } from "react";

import { Messenger } from "@/utilities/Messenger";

import { BaseGrid, createBaseGrid, GridData, OrderType } from "../../models/Grid/base-grid.model";

export function useGrid<T>(fetchFunction: (gridState: BaseGrid) => Promise<GridData<T>>, initialLimit: number = 10) {
	const initialGridState = useMemo<BaseGrid>(
		() => ({
			...createBaseGrid(),
			Limit: initialLimit,
		}),
		[initialLimit],
	);
	const [gridState, setGridState] = useState<BaseGrid>(initialGridState);

	const [data, setData] = useState<GridData<T>>({
		Data: [],
		PageCount: 0,
		EntityCount: 0,
	} as unknown as GridData<T>);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		let cancelled = false;

		const loadData = async () => {
			try {
				setIsLoading(true);
				const result = await fetchFunction(gridState);

				if (!cancelled && result) {
					setData(result);
				}
			} catch {
				if (!cancelled) {
					Messenger.errorMessage("خطا در دریافت اطلاعات");
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		};

		void loadData();

		return () => {
			cancelled = true;
		};
	}, [gridState, reloadKey]);

	const handlePageChange = useCallback((page: number) => {
		setGridState((prev) => ({
			...prev,
			CurrentPage: page,
		}));
	}, []);

	const handleLimitChange = useCallback((limit: number) => {
		setGridState((prev) => ({
			...prev,
			Limit: limit,
			CurrentPage: 1,
		}));
	}, []);

	const handleSort = useCallback((field: string) => {
		setGridState((prev) => {
			const isSameField = prev.OrderField === field;

			let newOrderField = field;
			let newOrderType = OrderType.Ascending;

			if (isSameField) {
				if (prev.OrderType === OrderType.Ascending) {
					newOrderType = OrderType.Descending;
				} else if (prev.OrderType === OrderType.Descending) {
					newOrderField = "Id";
					newOrderType = OrderType.Descending;
				}
			}

			return {
				...prev,
				OrderField: newOrderField,
				OrderType: newOrderType,
				CurrentPage: 1,
			};
		});
	}, []);

	const handleFilter = useCallback((key: string, value: string) => {
		setGridState((prev) => {
			const existingFilters = [...prev.FilterParam];
			const filterIndex = existingFilters.findIndex((f) => f.Key === key);

			if (!value) {
				if (filterIndex > -1) {
					existingFilters.splice(filterIndex, 1);
				}
			} else {
				if (filterIndex > -1) {
					existingFilters[filterIndex].Value = value;
				} else {
					existingFilters.push({ Key: key, Value: value });
				}
			}

			return {
				...prev,
				FilterParam: existingFilters,
				CurrentPage: 1,
			};
		});
	}, []);

	const reload = useCallback(() => {
		setReloadKey((prev) => prev + 1);
	}, []);

	const resetState = useCallback(() => {
		setGridState(initialGridState);
	}, [initialGridState]);

	return {
		gridState,
		data: data.Data,
		totalCount: data.EntityCount,
		isLoading,
		handlePageChange,
		handleLimitChange,
		handleSort,
		handleFilter,
		reload,
		resetState,
	};
}
