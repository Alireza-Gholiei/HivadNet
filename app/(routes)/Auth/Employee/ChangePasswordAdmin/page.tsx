"use client";

import { FileText, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import HraderTitle from "@/components/Shared/HraderTitle";
import UserSelector from "@/components/user/UserSelector";
import { UserGetGridDto } from "@/dataBinding/models/User/UserGetGridDto";
import { PageCard } from "@/utilities/components/ui/card";

import { UserChangePasswordForm } from "../UserChangePasswordForm";

export default function EmployeeChangePasswordAdminPage() {
	const router = useRouter();
	const [selectedUser, setSelectedUser] = useState<UserGetGridDto | null>(null);
	return (
		<PageCard className="p-4 md:p-6 bg-slate-50 min-h-screen">
			<HraderTitle
				title="بازنشانی رمز عبور کاربران"
				description="غییر یا بازنشانی رمز عبور کاربران"
				icon={<KeyRound />}
			/>

			<UserSelector value={selectedUser} onChange={setSelectedUser} label="انتخاب کاربر" required />

			<div>
				{selectedUser?.Id ? (
					<UserChangePasswordForm
						onClose={() => router.refresh()}
						onSubmitSuccess={() => router.refresh()}
						userId={selectedUser?.Id ?? 0}
					/>
				) : (
					<div className="flex-1 flex flex-col justify-center items-center text-slate-400 py-12 bg-white rounded-lg border border-dashed border-slate-300">
						<FileText className="w-12 h-12 mb-3 opacity-50" />
						<p>ابتدا یک کاربر انتخاب کنید</p>
					</div>
				)}
			</div>
		</PageCard>
	);
}
