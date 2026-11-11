import { ReactNode } from "react";

export class BaseGrid {
	CurrentPage: number = 1;
	Limit: number = 5;
	OrderField: string = "Id";
	OrderType: OrderType = OrderType.Descending;
	FilterParam: FilterParam[] = [];
}

export function createBaseGrid(): BaseGrid {
	return {
		CurrentPage: 1,
		Limit: 5,
		OrderField: "Id",
		OrderType: OrderType.Descending,
		FilterParam: [],
	};
}

export class GridData<TData> extends BaseGrid {
	Data: TData[] = [];
	EntityCount: number = 0;
	PageCount: number = 1;
}

export enum OrderType {
	Ascending = 1,
	Descending = 2,
}

export class FilterParam {
	constructor(key?: string, value?: string) {
		this.Key = key;
		this.Value = value;
	}

	Key?: string;
	Value?: string;
	Operator?: string;
	SearchExpression?: boolean;
}

const defaultColumnDef: Partial<ColumnDef<any>> = {
	sortable: true,
	filterable: true,
	filterType: "text",
	align: "right",
};

export function createColumn<T>(col: ColumnDef<T>): ColumnDef<T> {
	return { ...defaultColumnDef, ...col };
}

export function defineColumns<T>(columns: ColumnDef<T>[]): ColumnDef<T>[] {
	return columns.map(createColumn);
}

export interface ColumnDef<T> {
	field: keyof T;
	header: string;
	sortable?: boolean;
	sortKey?: string;
	filterable?: boolean;
	filterKey?: string;
	filterType?: "text" | "number" | "boolean" | "date" | "select";
	render?: (row: T, index: number) => ReactNode;
	width?: string | number;
	align?: "left" | "center" | "right";
	className?: string;
	headerClassName?: string;
}
