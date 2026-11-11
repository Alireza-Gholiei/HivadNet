import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { RoleTreeSelect } from "@/components/Shared/RoleTreeSelect";
import { UserAddDto, UserAddSchema } from "@/dataBinding/models/User/UserAddDto";
import { UserService } from "@/dataBinding/services/User/UserService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Input } from "@/utilities/components/ui/input";
import { Messenger } from "@/utilities/Messenger";

interface UserAddFormProps {
	onSuccess: () => void;
	onClose: () => void;
}

export const UserAddForm: React.FC<UserAddFormProps> = ({ onSuccess, onClose }) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		control,
	} = useForm<UserAddDto>({
		resolver: zodResolver(UserAddSchema),
		defaultValues: { RoleId: 0 },
	});

	const onSubmit = async (data: UserAddDto) => {
		const result = await UserService.Add(data);

		if (result) {
			Messenger.successAlert("کاربر با موفقیت ثبت شد.");
			onSuccess();
		}
	};

	return (
		<PageCard>
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
				<PageCardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Input
							label="نام"
							schema={UserAddSchema}
							error={errors.FirstName?.message}
							{...register("FirstName")}
						/>

						<Input
							label="نام خانوادگی"
							schema={UserAddSchema}
							error={errors.LastName?.message}
							{...register("LastName")}
						/>

						<Input
							label="نام کاربری"
							schema={UserAddSchema}
							error={errors.UserName?.message}
							dir="ltr"
							{...register("UserName")}
						/>

						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">نقش کاربر</label>
							<Controller
								name="RoleId"
								control={control}
								render={({ field }) => (
									<RoleTreeSelect
										value={field.value}
										onChange={field.onChange}
										error={errors.RoleId?.message}
									/>
								)}
							/>
						</div>

						<Input
							label="رمز عبور"
							schema={UserAddSchema}
							error={errors.Password?.message}
							type="password"
							dir="ltr"
							{...register("Password")}
						/>

						<Input
							label="تکرار رمز عبور"
							schema={UserAddSchema}
							error={errors.PasswordConfirmation?.message}
							type="password"
							dir="ltr"
							{...register("PasswordConfirmation")}
						/>
					</div>
				</PageCardContent>

				<PageCardFooter>
					<div className="mt-6 flex justify-end gap-3 border-t pt-4">
						<Button onClick={onClose} variant="secondary">
							انصراف
						</Button>
						<Button variant="submit" type="submit" disabled={isSubmitting}>
							{isSubmitting ? "در حال ثبت..." : "ثبت کاربر"}
						</Button>
					</div>
				</PageCardFooter>
			</form>
		</PageCard>
	);
};
