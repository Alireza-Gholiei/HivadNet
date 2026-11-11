/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Fingerprint, Loader2, MapPin, Phone, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { CustomerAddDto, CustomerAddSchema } from "@/dataBinding/models/Customer/CustomerAddDto";
import { CustomerGetTypesDto } from "@/dataBinding/models/Customer/CustomerGetTypesDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Input } from "@/utilities/components/ui/input";
import { Messenger } from "@/utilities/Messenger";
import { Select } from "@/utilities/components/ui/select";
import { Textarea } from "@/utilities/components/ui/textarea";

interface CustomerAddProps {
	onClose: () => void;
	initialNationalCode?: string;
	initialPhone?: string;
}

export default function CustomerAdd({ onClose, initialNationalCode = "", initialPhone = "" }: CustomerAddProps) {
	const [customerTypes, setCustomerTypes] = useState<CustomerGetTypesDto[]>([]);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<CustomerAddDto>({
		resolver: zodResolver(CustomerAddSchema),
		defaultValues: {
			FirstName: "",
			LastName: "",
			NationalCode: initialNationalCode,
			PhoneNumber: initialPhone,
			Job: null,
			Address: null,
			Type: 1,
		},
	});

	useEffect(() => {
		void (async () => {
			const typesResult = await CustomerService.GetTypes();

			setCustomerTypes(typesResult);
		})();
	}, []);

	const onSubmit = async (data: CustomerAddDto) => {
		const result = await CustomerService.Add(data);

		if (result) {
			Messenger.successAlert("ثبت مشتری با موفقیت انجام شد");
			onClose();
		}
	};

	return (
		<PageCard>
			<div className="space-y-5">
				<PageCardContent>
					<div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2">
						<Input
							label="نام"
							schema={CustomerAddSchema}
							error={errors.FirstName?.message}
							icon={<User className="h-5 w-5" />}
							placeholder="مثال: علی"
							{...register("FirstName")}
						/>

						<Input
							label="نام خانوادگی"
							schema={CustomerAddSchema}
							error={errors.LastName?.message}
							icon={<User className="h-5 w-5" />}
							placeholder="مثال: محمدی"
							{...register("LastName")}
						/>

						<Input
							label="شماره تماس"
							schema={CustomerAddSchema}
							error={errors.PhoneNumber?.message}
							icon={<Phone className="h-5 w-5" />}
							type="tel"
							dir="ltr"
							placeholder="09123456789"
							{...register("PhoneNumber")}
						/>

						<Input
							label="کد ملی"
							schema={CustomerAddSchema}
							error={errors.NationalCode?.message}
							icon={<Fingerprint className="h-5 w-5" />}
							type="text"
							inputMode="numeric"
							dir="ltr"
							placeholder="0123456789"
							{...register("NationalCode")}
						/>

						<Controller
							control={control}
							name="Type"
							render={({ field }) => (
								<Select
									label="نوع مشتری"
									clearable
									name={field.name}
									value={field.value}
									onValueChange={field.onChange}
									onBlur={field.onBlur}
									schema={CustomerAddSchema}
									error={errors.Type?.message}
									placeholder="انتخاب نوع مشتری"
									searchPlaceholder="جستجوی نوع مشتری..."
									options={customerTypes.map((type) => ({
										label: type.Name,
										value: type.Id,
									}))}
								/>
							)}
						/>

						<Input
							label="شغل"
							schema={CustomerAddSchema}
							error={errors.Job?.message}
							icon={<User className="h-5 w-5" />}
							placeholder="مثال: کارمند"
							{...register("Job")}
						/>

						<Textarea
							label="آدرس"
							schema={CustomerAddSchema}
							error={errors.Address?.message}
							icon={<MapPin className="h-5 w-5" />}
							placeholder="مثال: تهران - میدان فردوسی"
							rows={4}
							textareaClassName="min-h-28 resize-none bg-slate-50 focus:bg-white"
							{...register("Address")}
						/>
					</div>
				</PageCardContent>

				<PageCardFooter className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-4">
					<Button type="button" onClick={onClose} variant="secondary">
						انصراف
					</Button>

					<Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting} variant="submit">
						{isSubmitting ? (
							<>
								<Loader2 className="h-5 w-5 animate-spin" />
								در حال ذخیره...
							</>
						) : (
							<>
								<Save className="h-5 w-5" />
								ثبت مشتری
							</>
						)}
					</Button>
				</PageCardFooter>
			</div>
		</PageCard>
	);
}
