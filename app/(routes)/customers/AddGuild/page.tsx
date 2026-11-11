"use client";

import { FileText, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import CustomerSelector from "@/components/customer/CustomerSelector";
import HraderTitle from "@/components/Shared/HraderTitle";
import { CustomerGetGridDto } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import { PageCard } from "@/utilities/components/ui/card";

import GuildGroupAddCustomerForm from "../GuildGroupAddCustomerForm";

export default function CustomerAddGuildPage() {
	const router = useRouter();
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerGetGridDto | null>(null);
	return (
		<PageCard>
			<HraderTitle
				title="اختصاص سامانه به مشتری"
				description="اتصال و تخصیص سامانه‌های فعال به مشتری"
				icon={<Link2 />}
			/>

			<CustomerSelector value={selectedCustomer} onChange={setSelectedCustomer} required />

			<div>
				{selectedCustomer?.Id ? (
					<GuildGroupAddCustomerForm
						onClose={() => router.refresh()}
						onSuccess={() => router.refresh()}
						customerId={selectedCustomer?.Id ?? 0}
					/>
				) : (
					<div className="flex-1 flex flex-col justify-center items-center text-slate-400 py-12 bg-white rounded-lg border border-dashed border-slate-300">
						<FileText className="w-12 h-12 mb-3 opacity-50" />
						<p>ابتدا یک مشتری انتخاب کنید</p>
					</div>
				)}
			</div>
		</PageCard>
	);
}
