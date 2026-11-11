"use client";

import { UserCheck } from "lucide-react";
import { useState } from "react";
import { ReminderService } from "@/dataBinding/services/Reminder/ReminderService";
import { Button } from "@/utilities/components/ui/button";
import { Messenger } from "@/utilities/Messenger";
import UserSelector from "@/components/user/UserSelector";
import { UserGetGridDto } from "@/dataBinding/models/User/UserGetGridDto";

interface ReminderAssignUserFormProps {
	reminderId: number;
	onClose?: () => void;
	onSuccess?: () => void;
}

export default function ReminderAssignUserForm({ reminderId, onClose, onSuccess }: ReminderAssignUserFormProps) {
	const [selectedUser, setSelectedUser] = useState<UserGetGridDto | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!selectedUser) {
			Messenger.errorMessage("لطفا کارمند مورد نظر را انتخاب کنید");
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await ReminderService.AssignToUser({
				reminderId,
				userId: selectedUser.Id,
			});

			if (result) {
				Messenger.successAlert("یادآوری با موفقیت ارجاع داده شد");
				onSuccess?.();
				onClose?.();
			}
		} catch {
			Messenger.errorMessage("خطا در ارجاع یادآوری");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col gap-5">
			<div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
				<div className="flex items-start gap-3">
					<div className="rounded-xl border border-indigo-100 bg-white p-2.5 shrink-0">
						<UserCheck className="h-5 w-5 text-indigo-600" />
					</div>

					<div className="flex flex-col gap-1">
						<h3 className="font-bold text-slate-800">ارجاع یادآوری</h3>
						<p className="text-sm leading-7 text-slate-600">
							برای ارجاع این یادآوری، کارمند مقصد را انتخاب کنید.
						</p>
					</div>
				</div>
			</div>

			<UserSelector value={selectedUser} onChange={setSelectedUser} label="انتخاب کاربر" required />

			<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				<Button type="button" variant="outline" className="h-11 px-5" onClick={onClose} disabled={isSubmitting}>
					انصراف
				</Button>

				<Button
					type="button"
					className="h-11 bg-indigo-600 px-5 text-white hover:bg-indigo-700"
					onClick={() => void handleSubmit()}
					disabled={isSubmitting}
				>
					{isSubmitting ? "در حال ارجاع..." : "ارجاع یادآوری"}
				</Button>
			</div>
		</div>
	);
}
