"use client";

import { FileText, LayoutTemplate } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import CustomerSelector from "@/components/customer/CustomerSelector";
import HraderTitle from "@/components/Shared/HraderTitle";
import { CustomerGetGridDto } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import { PageCard, PageCardContent } from "@/utilities/components/ui/card";

import SmsSendWithTemplateForm from "./SmsSendWithTemplateForm";

export default function SmsSendWithTemplate() {
	const router = useRouter();
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerGetGridDto | null>(null);
	return (
		<PageCard>
			<HraderTitle
				title="ارسال با قالب"
				description="ارسال پیامک با استفاده از قالب‌های آماده"
				icon={<LayoutTemplate />}
			/>

			<PageCardContent>
				<CustomerSelector
					value={selectedCustomer}
					onChange={setSelectedCustomer}
					label="انتخاب کاربر"
					required
				/>

				<div className="bg-white border-slate-200 shadow-sm">
					{selectedCustomer?.Id ? (
						<SmsSendWithTemplateForm
							onClose={() => router.refresh()}
							customerId={selectedCustomer?.Id ?? 0}
						/>
					) : (
						<div className="flex-1 flex flex-col justify-center items-center text-slate-400 py-12 bg-white rounded-lg border border-dashed border-slate-300">
							<FileText className="w-12 h-12 mb-3 opacity-50" />
							<p>ابتدا یک مشتری انتخاب کنید</p>
						</div>
					)}
				</div>
			</PageCardContent>
		</PageCard>
	);
}
