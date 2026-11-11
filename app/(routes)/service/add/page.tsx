"use client";

import { SquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";

import HraderTitle from "@/components/Shared/HraderTitle";

import ServiceAddForm from "./ServiceAddForm";

export default function ServiceCreatePage() {
	const router = useRouter();

	return (
		<div>
			<HraderTitle
				title="ثبت خدمت/فاکتور جدید"
				description="فرم فاکتور خدمت جدید به همراه آیتم‌های مربوطه"
				icon={<SquarePlus />}
			/>

			<ServiceAddForm onClose={() => router.push("/service")} onSuccess={() => router.push("/service")} />
		</div>
	);
}
