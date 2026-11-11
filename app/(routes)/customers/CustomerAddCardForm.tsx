"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, CreditCard, Loader2, Save, ShieldCheck, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { CustomerAddCardDto, CustomerAddCardSchema } from "@/dataBinding/models/Customer/Card/CustomerAddCardDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Input } from "@/utilities/components/ui/input";
import { Messenger } from "@/utilities/Messenger";

interface CustomerAddCardFormProps {
	customerId: number;
	onClose: () => void;
}

export default function CustomerAddCardForm({ customerId, onClose }: CustomerAddCardFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CustomerAddCardDto>({
		resolver: zodResolver(CustomerAddCardSchema),
		defaultValues: {
			CustomerId: customerId,
			CardNumber: "",
			AccountNumber: null,
			ShebaNumber: null,
			OwnerName: null,
			ExpireMonth: "",
			ExpireYear: "",
			Cvv2: "",
		},
	});

	const onSubmit = async (data: CustomerAddCardDto) => {
		const result = await CustomerService.AddCard({
			...data,
			CardNumber: data.CardNumber.replaceAll(" ", ""),
		});

		if (result) {
			Messenger.successAlert("کارت بانکی با موفقیت ثبت شد");
			onClose();
		}
	};

	return (
		<PageCard className="overflow-hidden border-0 bg-linear-to-br from-white via-slate-50 to-indigo-50/60 shadow-xl shadow-slate-200/70">
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-6">
				<PageCardContent className="space-y-6 p-6">
					<div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2">
						<div className="md:col-span-2">
							<Input
								label="شماره کارت"
								schema={CustomerAddCardSchema}
								error={errors.CardNumber?.message}
								icon={<CreditCard className="h-5 w-5" />}
								dir="ltr"
								inputMode="numeric"
								maxLength={16}
								placeholder="6037991234567890"
								{...register("CardNumber")}
							/>
						</div>

						<Input
							label="نام صاحب حساب"
							schema={CustomerAddCardSchema}
							error={errors.OwnerName?.message}
							icon={<User className="h-5 w-5" />}
							placeholder="مثال: علی محمدی"
							{...register("OwnerName")}
						/>

						<Input
							label="شماره حساب"
							schema={CustomerAddCardSchema}
							error={errors.AccountNumber?.message}
							hint="اختیاری"
							type="text"
							dir="ltr"
							inputMode="numeric"
							placeholder="اختیاری"
							{...register("AccountNumber")}
						/>

						<div className="md:col-span-2">
							<Input
								label="شماره شبا"
								schema={CustomerAddCardSchema}
								error={errors.ShebaNumber?.message}
								hint="اختیاری"
								type="text"
								dir="ltr"
								placeholder="IRxxxxxxxxxxxxxxxxxxxxxxxx"
								{...register("ShebaNumber")}
							/>
						</div>

						<Input
							label="ماه انقضا"
							schema={CustomerAddCardSchema}
							error={errors.ExpireMonth?.message}
							icon={<Calendar className="h-5 w-5" />}
							dir="ltr"
							inputMode="numeric"
							maxLength={2}
							placeholder="01"
							{...register("ExpireMonth")}
						/>

						<Input
							label="سال انقضا"
							schema={CustomerAddCardSchema}
							error={errors.ExpireYear?.message}
							icon={<Calendar className="h-5 w-5" />}
							dir="ltr"
							inputMode="numeric"
							maxLength={2}
							placeholder="05"
							{...register("ExpireYear")}
						/>

						<Input
							label="CVV2"
							schema={CustomerAddCardSchema}
							error={errors.Cvv2?.message}
							hint="۳ یا ۴ رقم"
							icon={<ShieldCheck className="h-5 w-5" />}
							dir="ltr"
							inputMode="numeric"
							maxLength={4}
							placeholder="123"
							{...register("Cvv2")}
						/>
					</div>
				</PageCardContent>

				<PageCardFooter className="flex flex-col-reverse gap-3 border-t border-slate-200/70 bg-white/70 p-5 sm:flex-row sm:items-center sm:justify-end">
					<Button type="button" onClick={onClose} variant="secondary" className="w-full sm:w-auto">
						انصراف
					</Button>

					<Button type="submit" disabled={isSubmitting} variant="submit" className="w-full sm:w-auto">
						{isSubmitting ? (
							<>
								<Loader2 className="h-5 w-5 animate-spin" />
								در حال ذخیره...
							</>
						) : (
							<>
								<Save className="h-5 w-5" />
								ثبت کارت بانکی
							</>
						)}
					</Button>
				</PageCardFooter>
			</form>
		</PageCard>
	);
}
