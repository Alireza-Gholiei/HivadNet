import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import { UserChangePasswordDto, UserChangePasswordSchema } from "@/dataBinding/models/User/UserChangePasswordDto";
import { UserService } from "@/dataBinding/services/User/UserService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Input } from "@/utilities/components/ui/input";
import { Messenger } from "@/utilities/Messenger";

interface UserChangePasswordFormProps {
	userId: number;
	onSubmitSuccess: () => void;
	onClose: () => void;
}

export const UserChangePasswordForm: React.FC<UserChangePasswordFormProps> = ({ userId, onSubmitSuccess, onClose }) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<UserChangePasswordDto>({
		resolver: zodResolver(UserChangePasswordSchema),
		defaultValues: {
			UserId: userId,
		},
	});

	const onSubmit = async (data: UserChangePasswordDto) => {
		const result = await UserService.ChangePasswordAdmin(data);

		if (result) {
			Messenger.successAlert("رمز عبور با موفقیت ثبت شد.");
			onSubmitSuccess();
		}
	};

	return (
		<PageCard>
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
				<PageCardContent>
					<div className="space-y-4">
						<Input
							label="رمز عبور جدید"
							schema={UserChangePasswordSchema}
							error={errors.Password?.message}
							type="password"
							dir="ltr"
							{...register("Password")}
						/>

						<Input
							label="تکرار رمز عبور جدید"
							schema={UserChangePasswordSchema}
							error={errors.PasswordConfirmation?.message}
							type="password"
							dir="ltr"
							{...register("PasswordConfirmation")}
						/>
					</div>
				</PageCardContent>

				<PageCardFooter className="mt-6 flex justify-end gap-3 border-t pt-4">
					<Button type="button" onClick={onClose} variant="secondary">
						انصراف
					</Button>
					<Button type="submit" disabled={isSubmitting} variant="submit">
						{isSubmitting ? "در حال ثبت..." : "تغییر رمز"}
					</Button>
				</PageCardFooter>
			</form>
		</PageCard>
	);
};
