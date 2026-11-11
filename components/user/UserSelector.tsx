"use client";

import { CheckCircle2, Search, User, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { UserGetEditDto } from "@/dataBinding/models/User/UserGetEditDto";
import { UserGetGridDto } from "@/dataBinding/models/User/UserGetGridDto";
import { UserService } from "@/dataBinding/services/User/UserService";
import CopyToClipboard from "@/utilities/components/copy/CopyToClipboard";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";

import UserSelect from "./UserSelect";

type UserSelectorProps = {
	value?: UserGetGridDto | null;
	valueId?: number | null;
	onChange?: (customer: UserGetGridDto | null) => void;
	onChangeId?: (id: number | null) => void;
	label?: string;
	buttonText?: string;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
	className?: string;
};

const mapEditToGrid = (user: UserGetEditDto): UserGetGridDto => {
	return {
		Id: user.Id,
		FullName: `${user.FirstName} ${user.LastName}`,
		FirstName: user.FirstName,
		LastName: user.LastName,
		UserName: user.UserName,
		CreateDate: "",
		LockoutEnabled: "",
	};
};

export default function UserSelector({
	value = null,
	valueId = null,
	onChange,
	onChangeId,
	label = "کاربر",
	buttonText = "انتخاب از لیست",
	placeholder = "جستجو با شماره تماس...",
	disabled = false,
	required = false,
	className = "",
}: UserSelectorProps) {
	const [open, setOpen] = useState(false);
	const [resolvedUser, setResolvedUser] = useState<UserGetGridDto | null>(null);
	const [loadingUser, setLoadingUser] = useState(false);

	const selectedUser = useMemo(() => {
		return value ?? resolvedUser;
	}, [value, resolvedUser]);

	const selectedUserId = selectedUser?.Id ?? valueId ?? null;

	useEffect(() => {
		let ignore = false;

		const loadUser = async () => {
			if (value) {
				setResolvedUser(null);
				return;
			}

			if (!valueId) {
				setResolvedUser(null);
				return;
			}

			try {
				setLoadingUser(true);

				const user = await UserService.GetEdit(valueId);

				if (!ignore) {
					setResolvedUser(user ? mapEditToGrid(user) : null);
				}
			} finally {
				if (!ignore) {
					setLoadingUser(false);
				}
			}
		};

		void loadUser();

		return () => {
			ignore = true;
		};
	}, [value, valueId]);

	const handleSelectUser = (user: UserGetGridDto) => {
		setResolvedUser(user);
		if (onChange) {
			onChange(user);
		}
		if (onChangeId) {
			onChangeId(user.Id);
		}
		setOpen(false);
	};

	const handleClear = () => {
		setResolvedUser(null);
		if (onChange) {
			onChange(null);
		}
		if (onChangeId) {
			onChangeId(null);
		}
	};

	return (
		<div className={`w-full ${className} py-3`}>
			<div className="flex items-center justify-between mb-2">
				<label className="text-sm font-bold text-slate-700">
					{label}
					{required && <span className="text-rose-500 mr-1">*</span>}
				</label>
			</div>

			<div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
				{selectedUser ? (
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
						<div className="flex items-center gap-3 min-w-0">
							<div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
								<CheckCircle2 className="w-5 h-5 text-indigo-600" />
							</div>

							<div className="min-w-0">
								<div className="text-sm text-slate-500 mb-1">کاربر انتخاب‌شده</div>

								<div className="font-bold text-slate-800 truncate">
									{selectedUser.FullName}
									<CopyToClipboard textToCopy={selectedUser.FullName || "-"} size={12} />
								</div>
								<div className="text-xs text-slate-500 mt-1">
									شماره تماس:
									<span className="dir-ltr inline-block mr-1 text-slate-700 font-medium">
										{selectedUser.UserName || "-"}
									</span>
									<CopyToClipboard textToCopy={selectedUser.UserName || "-"} size={12} />
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2 shrink-0">
							<Button
								type="button"
								variant="outline"
								disabled={disabled}
								onClick={() => setOpen(true)}
								className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
							>
								<Search className="w-4 h-4 ml-1" />
								تغییر کاربر
							</Button>

							<Button
								type="button"
								variant="outline"
								disabled={disabled}
								onClick={handleClear}
								className="border-rose-200 text-rose-600 hover:bg-rose-50"
							>
								<X className="w-4 h-4" />
							</Button>
						</div>
					</div>
				) : loadingUser ? (
					<div className="flex items-center gap-3 text-slate-500">
						<div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
							<User className="w-5 h-5 text-slate-400" />
						</div>

						<div>
							<div className="font-medium text-slate-700">در حال دریافت اطلاعات کاربر...</div>
							<div className="text-xs text-slate-400 mt-1">لطفا چند لحظه صبر کنید.</div>
						</div>
					</div>
				) : (
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
						<div className="flex items-center gap-3 text-slate-500">
							<div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
								<User className="w-5 h-5 text-slate-400" />
							</div>

							<div>
								<div className="font-medium text-slate-700">هنوز کاربر انتخاب نشده است</div>
								<div className="text-xs text-slate-400 mt-1">
									برای انتخاب کاربر، از لیست جستجو کنید.
								</div>
							</div>
						</div>

						<Button
							type="button"
							disabled={disabled}
							onClick={() => setOpen(true)}
							className="bg-indigo-600 hover:bg-indigo-700 text-white"
						>
							<Search className="w-4 h-4 ml-1" />
							{buttonText}
						</Button>
					</div>
				)}
			</div>

			<Popup show={open} onClose={() => setOpen(false)} title="انتخاب کاربر از لیست">
				<UserSelect
					value={selectedUserId}
					onChange={handleSelectUser}
					title="انتخاب کاربر"
					description="برای انتخاب کاربر، کد ملی را جستجو کنید."
					placeholder={placeholder}
					searchFilterKey="NationalCode"
				/>
			</Popup>
		</div>
	);
}
