"use client";

import { Check, Users } from "lucide-react";
import { useRef } from "react";

import { SmsTemplateGetGridDto } from "@/dataBinding/models/Messaging/SmsTemplate/SmsTemplateDtos";
import { SmsTemplateService } from "@/dataBinding/services/Messaging/SmsTemplate/SmsTemplateService";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import { Button } from "@/utilities/components/ui/button";

type SmsTempSelectProps = {
	value?: number | null;
	onChange: (smsTemp: SmsTemplateGetGridDto) => void;
	title?: string;
	description?: string;
	placeholder?: string;
	className?: string;
	searchFilterKey?: string;
};

export default function SmsTempSelect({
	value = null,
	onChange,
	title = "انتخاب قالب پیامک",
	description = "یک قالب پیامک را از لیست انتخاب کنید",
	className = "",
}: SmsTempSelectProps) {
	const gridRef = useRef<DataGridRef>(null);

	return (
		<div className={`w-full ${className}`}>
			<div className="mb-4">
				<h3 className="text-base font-bold text-slate-800">{title}</h3>
				<p className="text-sm text-slate-500 mt-1">{description}</p>
			</div>

			<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
				<DataGrid<SmsTemplateGetGridDto>
					ref={gridRef}
					fetchFunction={(params) => SmsTemplateService.GetGrid(params)}
					initialLimit={10}
				>
					<Column<SmsTemplateGetGridDto>
						field="Title"
						header="عنوان"
						render={(row) => (
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
									<Users className="w-4 h-4 text-slate-500" />
								</div>
								<span className="font-bold text-slate-800">{row.Title}</span>
							</div>
						)}
					/>

					<Column<SmsTemplateGetGridDto>
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
