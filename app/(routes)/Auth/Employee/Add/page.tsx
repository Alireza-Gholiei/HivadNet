"use client";

import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import HraderTitle from "@/components/Shared/HraderTitle";

import { UserAddForm } from "../UserAddForm";

export default function EmployeeAddPage() {
	const router = useRouter();

	return (
		<div>
			<HraderTitle title="ثبت کاربر جدید" description="ایجاد حساب کاربری جدید برای کارکنان" icon={<UserPlus />} />

			<UserAddForm onClose={() => router.refresh()} onSuccess={() => router.refresh()} />
		</div>
	);
}
