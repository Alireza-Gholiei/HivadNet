"use client";

import { SquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";

import HraderTitle from "@/components/Shared/HraderTitle";

import SmsTemplateAddFrom from "../SmsTemplateAddForm";

export default function CustomerAddPage() {
	const router = useRouter();

	return (
		<div>
			<HraderTitle title="ثبت قالب جدید" description="ایجاد قالب جدید برای ارسال پیامک" icon={<SquarePlus />} />

			<SmsTemplateAddFrom onClose={() => router.refresh()} />
		</div>
	);
}
