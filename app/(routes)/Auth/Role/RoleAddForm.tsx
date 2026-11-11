import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { RoleTreeSelect } from "@/components/Shared/RoleTreeSelect";
import { RoleAddDto, RoleAddSchema } from "@/dataBinding/models/Role/RoleAddDto";
import { RoleService } from "@/dataBinding/services/Role/RoleService";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Input } from "@/utilities/components/ui/input";
import { Messenger } from "@/utilities/Messenger";

import RoleFormSelectModal from "./RoleFormSelectModal";
import { Checkbox } from "@/utilities/components/ui/checkbox";

interface RoleAddFormProps {
	onClose: () => void;
	onSuccess: () => void;
}

export default function RoleAddForm({ onClose, onSuccess }: RoleAddFormProps) {
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<RoleAddDto>({
		resolver: zodResolver(RoleAddSchema),
		defaultValues: {
			Name: "",
			AccessAll: false,
			ParentId: undefined,
			Forms: [],
		},
	});

	const accessAllValue = watch("AccessAll");

	const onSubmit = async (data: RoleAddDto) => {
		const result = await RoleService.Create(data);

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
					<div className="grid grid-cols-1 items-end gap-6 md:grid-cols-2">
						<Input
							label="نام"
							schema={RoleAddSchema}
							error={errors.Name?.message}
							placeholder="ادمین"
							{...register("Name")}
						/>

						<Checkbox
							id="AccessAll"
							label="دسترسی کامل"
							schema={RoleAddSchema}
							error={errors.AccessAll?.message}
							containerClassName="pb-2"
							{...register("AccessAll")}
						/>

						<div className="text-center">
							<label className="mb-1 block text-sm font-medium text-gray-700">نقش کاربر</label>
							<Controller
								name="ParentId"
								control={control}
								render={({ field }) => (
									<RoleTreeSelect
										value={field.value}
										onChange={field.onChange}
										error={errors.ParentId?.message}
									/>
								)}
							/>
						</div>

						<div className="text-center">
							<Button
								type="button"
								onClick={() => setIsFormModalOpen(true)}
								disabled={accessAllValue}
								className="w-full"
							>
								انتخاب فرم قابل دسترس
							</Button>
						</div>
					</div>
				</PageCardContent>

				<PageCardFooter className="mt-6 flex justify-end gap-3 border-t pt-4">
					<Button type="button" onClick={onClose} variant="secondary">
						انصراف
					</Button>
					<Button type="submit" disabled={isSubmitting} variant="submit">
						{isSubmitting ? "در حال ثبت..." : "ثبت نقش"}
					</Button>
				</PageCardFooter>
			</form>

			<Popup
				show={isFormModalOpen}
				onClose={() => {
					setIsFormModalOpen(false);
				}}
				title="انتخاب فرم قابل دسترس"
			>
				<Controller
					name="Forms"
					control={control}
					render={({ field }) => (
						<RoleFormSelectModal
							isOpen={isFormModalOpen}
							initialSelected={field.value}
							onClose={() => setIsFormModalOpen(false)}
							onSubmit={(selectedIds) => {
								field.onChange(selectedIds);
								setIsFormModalOpen(false);
							}}
						/>
					)}
				/>
			</Popup>
		</PageCard>
	);
}
