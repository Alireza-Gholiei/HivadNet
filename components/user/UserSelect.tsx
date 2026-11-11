"use client";

import { Check, Users } from "lucide-react";
import { useRef } from "react";

import { UserGetGridDto } from "@/dataBinding/models/User/UserGetGridDto";
import { UserService } from "@/dataBinding/services/User/UserService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import { Button } from "@/utilities/components/ui/button";

type UserSelectProps = {
	value?: number | null;
	onChange: (user: UserGetGridDto) => void;
	title?: string;
	description?: string;
	placeholder?: string;
	className?: string;
	searchFilterKey?: string;
};

export default function UserSelect({
	value = null,
	onChange,
	title = "انتخاب کاربر",
	description = "یک کاربر را از لیست انتخاب کنید",
	className = "",
}: UserSelectProps) {
	const gridRef = useRef<DataGridRef>(null);

	return (
		<div className={`w-full ${className}`}>
			<div className="mb-4">
				<h3 className="text-base font-bold text-slate-800">{title}</h3>
				<p className="text-sm text-slate-500 mt-1">{description}</p>
			</div>

			<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
				<DataGrid<UserGetGridDto>
					ref={gridRef}
					fetchFunction={(params) => UserService.GetGrid(params)}
					initialLimit={10}
				>
					<Column<UserGetGridDto>
						field="FirstName"
						header="نام کاربر"
						render={(row) => (
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
									<Users className="w-4 h-4 text-slate-500" />
								</div>
								<span className="font-bold text-slate-800">{row.FirstName}</span>
							</div>
						)}
					/>

					<Column<UserGetGridDto>
						field="LastName"
						header="نام خانوادگی کاربر"
						render={(row) => (
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
									<Users className="w-4 h-4 text-slate-500" />
								</div>
								<span className="font-bold text-slate-800">{row.LastName}</span>
							</div>
						)}
					/>

					<Column<UserGetGridDto>
						field="UserName"
						header="شماره تماس"
						width="150px"
						render={(row) => <span className="dir-ltr text-slate-500">{row.UserName || "-"}</span>}
					/>

					<Column<UserGetGridDto>
						field="Id"
						filterable={false}
						header="ترتیب پیش فرض"
						align="center"
						width="120px"
						sortable={true}
						render={(row) => {
							const isSelected = value === row.Id;
							return isSelected ? (
								<div className="flex items-center justify-center gap-1 text-indigo-600 text-sm font-medium">
									<Check className="w-4 h-4" />
									انتخاب شده
								</div>
							) : (
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="border-slate-300 w-full"
									onClick={(e) => {
										e.stopPropagation();
										onChange(row);
									}}
								>
									انتخاب
								</Button>
							);
						}}
					/>
				</DataGrid>
			</div>
		</div>
	);
}
