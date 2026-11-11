import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { RoleTreeSelect } from "@/components/Shared/RoleTreeSelect";
import { RoleEditDto, RoleEditSchema } from "@/dataBinding/models/Role/RoleEditDto";
import { RoleService } from "@/dataBinding/services/Role/RoleService";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";

import RoleFormSelectModal from "./RoleFormSelectModal";
import { Input } from "@/utilities/components/ui/input";
import { Checkbox } from "@/utilities/components/ui/checkbox";

interface RoleAddFormProps {
	id: number;
	onClose: () => void;
	onSuccess: () => void;
}

export default function RoleEditForm({ id, onClose, onSuccess }: RoleAddFormProps) {
	const [isFormModalOpen, setIsFormModalOpen] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<RoleEditDto>({
		resolver: zodResolver(RoleEditSchema),
		defaultValues: {
			Name: "",
			AccessAll: false,
			ParentId: undefined,
			Forms: [],
		},
	});

	const accessAllValue = watch("AccessAll");

	useEffect(() => {
		if (id) {
			void fetchData(id);
		}
	}, [id]);

	const fetchData = async (roleId: number) => {
		const result = await RoleService.GetEdit(roleId);
		if (result) {
			reset({
				Id: result.Id,
				Name: result.Name,
				ParentId: result.ParentId,
				AccessAll: result.AccessAll,
				Forms: result.Forms,
			});
		}
	};

	const onSubmit = async (data: RoleEditDto) => {
		const result = await RoleService.Update(data);

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
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
						<Input
							label="نام"
							schema={RoleEditSchema}
							error={errors.Name?.message}
							placeholder="ادمین"
							{...register("Name")}
						/>

						<Checkbox
							id="AccessAll"
							label="دسترسی کامل"
							schema={RoleEditSchema}
							error={errors.AccessAll?.message}
							containerClassName="pb-2"
							{...register("AccessAll")}
						/>

						<div className="text-center">
							<label className="block text-sm font-medium text-gray-700 mb-1">نقش کاربر</label>
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
								className={`w-full`}
							>
								انتخاب فرم قابل دسترس
							</Button>
						</div>
					</div>
				</PageCardContent>

				<PageCardFooter className="flex justify-end gap-3 pt-4 border-t mt-6">
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
