"use client";

import { FileText, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import CustomerSelector from "@/components/customer/CustomerSelector";
import HraderTitle from "@/components/Shared/HraderTitle";
import { CustomerGetGridDto } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import { PageCard } from "@/utilities/components/ui/card";

import CustomerAddRepresentativeForm from "../CustomerAddRepresentativeForm";

export default function CustomerAddGuildPage() {
	const router = useRouter();
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerGetGridDto | null>(null);
	return (
		<PageCard>
			<HraderTitle title="ثبت نماینده مشتری" description="فرم ثبت نماینده مشتری" icon={<Receipt />} />
			<CustomerSelector value={selectedCustomer} onChange={setSelectedCustomer} required />

			<div>
				{selectedCustomer?.Id ? (
					<CustomerAddRepresentativeForm onClose={() => router.refresh()} customer={selectedCustomer} />
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
