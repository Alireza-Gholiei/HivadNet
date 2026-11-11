import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { RoleTreeSelect } from "@/components/Shared/RoleTreeSelect";
import UserSelector from "@/components/user/UserSelector";
import { UserRoleAddDto, UserRoleAddSchema } from "@/dataBinding/models/User/UserRole/UserRoleAddDto";
import { UserRoleService } from "@/dataBinding/services/User/UserRoleService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";

interface RoleAddFormProps {
	onClose: () => void;
	onSuccess: () => void;
}

export default function UserRoleAddForm({ onClose, onSuccess }: RoleAddFormProps) {
	const {
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<UserRoleAddDto>({
		resolver: zodResolver(UserRoleAddSchema),
		defaultValues: {},
	});

	const onSubmit = async (data: UserRoleAddDto) => {
		const result = await UserRoleService.Add(data);

		if (result) {
			Messenger.successAlert();
			reset();
			onSuccess();
		}
	};

	return (
		<PageCard>
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
				<PageCardContent>
					<Controller
						name="UserId"
						control={control}
						render={({ field }) => (
							<UserSelector
								valueId={field.value}
								onChangeId={field.onChange}
								label="انتخاب کاربر"
								required
							/>
						)}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
						<div className="text-center">
							<label className="block text-sm font-medium text-gray-700 mb-1">نقش کاربر</label>
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
					</div>
				</PageCardContent>

				<PageCardFooter>
					<div className="flex justify-end gap-3 pt-4 border-t mt-6">
						<Button type="button" onClick={onClose} variant="secondary">
							انصراف
						</Button>
						<Button type="submit" disabled={isSubmitting} variant="submit">
							{isSubmitting ? "در حال ثبت..." : "ثبت نقش"}
						</Button>
					</div>
				</PageCardFooter>
			</form>
		</PageCard>
	);
}
