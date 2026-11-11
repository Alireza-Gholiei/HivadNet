"use client";

import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import HraderTitle from "@/components/Shared/HraderTitle";

import CustomerAdd from "../CustomerAddForm";

export default function CustomerAddPage() {
	const router = useRouter();

	return (
		<div>
			<HraderTitle title="ثبت مشتری جدید" description="ایجاد و ثبت مشتری جدید" icon={<UserPlus />} />

			<CustomerAdd onClose={() => router.refresh()} />
		</div>
	);
}
