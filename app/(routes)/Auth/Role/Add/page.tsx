"use client";

import { BadgePlus } from "lucide-react";
import { useRouter } from "next/navigation";

import HraderTitle from "@/components/Shared/HraderTitle";
import { PageCard } from "@/utilities/components/ui/card";

import RoleAddForm from "../RoleAddForm";

export default function RoleAddPage() {
	const router = useRouter();

	return (
		<PageCard>
			<HraderTitle title="ثبت نقش جدید" description="ایجاد نقش جدید برای کاربران سامانه" icon={<BadgePlus />} />

			<RoleAddForm onClose={() => router.refresh()} onSuccess={() => router.refresh()} />
		</PageCard>
	);
}
