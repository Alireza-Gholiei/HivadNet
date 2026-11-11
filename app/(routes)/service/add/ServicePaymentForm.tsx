"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Calculator, CreditCard, Globe, Loader2, Save, Smartphone } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { ServicePaymentDto, ServicePaymentSchema } from "@/dataBinding/models/Service/ServicePaymentDto";
import { ServiceService } from "@/dataBinding/services/Service/ServiceService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";

const formatNumberWithCommas = (value: string | number) => {
	const rawValue = String(value ?? "")
		.replace(/,/g, "")
		.replace(/[^\d]/g, "");

	if (!rawValue) return "";

	return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseCurrencyValue = (value: string) => {
	const rawValue = value.replace(/,/g, "").replace(/[^\d]/g, "");
	return rawValue ? Number(rawValue) : 0;
};

interface ServicePaymentFormProps {
	onClose: () => void;
	onSuccess: () => void;
	customerId: number;
	serviceId: number;
	defaultAmount: number;
}

export default function ServicePaymentForm({
	onClose,
	onSuccess,
	customerId,
	serviceId,
	defaultAmount,
}: ServicePaymentFormProps) {
	const {
		handleSubmit,
		watch,
		control,
		setValue,
		formState: { isSubmitting },
	} = useForm<ServicePaymentDto>({
		resolver: zodResolver(ServicePaymentSchema),
		defaultValues: {
			CustomerId: customerId,
			ServiceId: serviceId,
			Amount: defaultAmount,
			Method: 1,
		},
	});

	const paymentAmount = watch("Amount");
	const paymentMethod = watch("Method");

	const formatPrice = (value: number) => {
		return new Intl.NumberFormat("fa-IR").format(value || 0);
	};

	const remainingAmount = Math.max(defaultAmount - (paymentAmount || 0), 0);

	const onSubmit = async (data: ServicePaymentDto) => {
		try {
			const result = await ServiceService.Payment(data);

			if (result) {
				Messenger.successAlert("تسویه با موفقیت انجام شد.");
				onSuccess();
			}
		} catch {
			Messenger.errorMessage("خطا در برقراری ارتباط جهت ثبت تسویه.");
		}
	};

	return (
		<PageCard>
			<form
				onSubmit={(e) => void handleSubmit(onSubmit)(e)}
				className="space-y-6 animate-in fade-in zoom-in-95 duration-300"
			>
				<PageCardContent>
					<div className="border border-green-200 bg-green-50 rounded-xl p-6 text-center space-y-2">
						<div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
							<Save className="w-6 h-6" />
						</div>
						<h3 className="text-lg font-bold text-green-800">خدمت با موفقیت ثبت شد</h3>
						<p className="text-sm text-green-600">
							شماره پیگیری: <span className="font-bold">{serviceId}</span>
						</p>
					</div>

					<div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
						<div className="p-4 border-b border-slate-200 flex items-center gap-2">
							<Calculator className="w-5 h-5 text-indigo-600" />
							<span className="text-sm font-semibold text-slate-700">فرم تسویه حساب</span>
						</div>

						<div className="p-6 space-y-6">
							<div className="flex items-center justify-between border-b pb-4">
								<span className="text-slate-600">مبلغ کل قابل پرداخت:</span>
								<span className="text-xl font-extrabold text-slate-800">
									{formatPrice(defaultAmount)} تومان
								</span>
							</div>

							<div>
								<label className="block text-sm font-semibold text-slate-700 mb-1.5">
									مبلغ پرداختی (تومان)
								</label>
								<Controller
									control={control}
									name={`Amount`}
									render={({ field }) => (
										<div className="relative">
											<input
												type="text"
												inputMode="numeric"
												placeholder="مثلاً 150,000"
												value={formatNumberWithCommas(field.value || 0)}
												onChange={(e) => {
													const numericValue = parseCurrencyValue(e.target.value);

													field.onChange(numericValue);

													setValue(`Amount`, numericValue, {
														shouldValidate: true,
														shouldDirty: true,
													});
												}}
												className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-900 sm:text-sm transition-all outline-none bg-slate-50 focus:bg-white disabled:opacity-60"
											/>

											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
												تومان
											</span>
										</div>
									)}
								/>
								{remainingAmount > 0 && (
									<p className="text-amber-600 text-sm mt-2 font-medium">
										مبلغ {formatPrice(remainingAmount)} تومان در حساب مشتری باقی خواهد ماند (عدم
										تسویه کامل).
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-semibold text-slate-700 mb-3">روش پرداخت</label>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
									<Button
										type="button"
										onClick={() => setValue("Method", 1)}
										className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
											paymentMethod === 1
												? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold"
												: "border-slate-200 text-slate-600 hover:bg-slate-50"
										}`}
									>
										<CreditCard className="w-5 h-5" />
										دستگاه پوز
									</Button>

									<Button
										type="button"
										onClick={() => setValue("Method", 2)}
										className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
											paymentMethod === 2
												? "border-green-600 bg-green-50 text-green-700 font-bold"
												: "border-slate-200 text-slate-600 hover:bg-slate-50"
										}`}
									>
										<Banknote className="w-5 h-5" />
										نقدی
									</Button>

									<Button
										type="button"
										onClick={() => setValue("Method", 3)}
										className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
											paymentMethod === 3
												? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
												: "border-slate-200 text-slate-600 hover:bg-slate-50"
										}`}
									>
										<Globe className="w-5 h-5" />
										درگاه اینترنتی
									</Button>

									<Button
										type="button"
										onClick={() => setValue("Method", 4)}
										className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
											paymentMethod === 4
												? "border-amber-600 bg-amber-50 text-amber-700 font-bold"
												: "border-slate-200 text-slate-600 hover:bg-slate-50"
										}`}
									>
										<Smartphone className="w-5 h-5" />
										کارت به کارت
									</Button>
								</div>
							</div>
						</div>
					</div>
				</PageCardContent>
				<PageCardFooter className="flex items-center gap-3 mt-8 pt-4 border-t border-slate-100">
					<button
						type="button"
						onClick={onClose}
						className="px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors w-full sm:w-auto"
					>
						رد شدن و پایان
					</button>

					<Button
						type="submit"
						disabled={isSubmitting || paymentAmount <= 0}
						className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 flex-1 flex items-center justify-center gap-2"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								در حال ثبت پرداختی...
							</>
						) : (
							<>
								<Save className="w-5 h-5" />
								ثبت تسویه و پایان
							</>
						)}
					</Button>
				</PageCardFooter>
			</form>
		</PageCard>
	);
}
