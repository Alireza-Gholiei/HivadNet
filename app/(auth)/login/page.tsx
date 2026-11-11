"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, LogIn, Phone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { LoginDto, LoginSchema } from "@/dataBinding/models/Auth/LoginDto";
import { AuthService } from "@/dataBinding/services/Auth/AuthService";
import { TokenService } from "@/utilities/services/token.service";

export default function LoginPageClient() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginDto>({
		resolver: zodResolver(LoginSchema),
	});

	useEffect(() => {
		void (async () => {
			const loginStatus = await TokenService.isLogin();
			if (loginStatus) {
				router.push("/");
			}
			setLoading(false);
		})();
	}, [router]);

	const onSubmit = async (data: LoginDto) => {
		const result = await AuthService.Login(data);
		if (result) {
			router.push("/");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
				<Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
				<p className="text-slate-500 font-medium">در حال بررسی وضعیت ورود...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
				<div className="p-8 pb-6 text-center">
					<div className="mx-auto w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center mb-5 border border-indigo-100 relative overflow-hidden">
						<Image
							src="/logo.png"
							alt="Logo"
							width={90}
							height={90}
							className="object-contain p-2"
							loading="eager"
						/>
					</div>
					<h2 className="text-2xl font-bold text-slate-900 mb-2">ورود به پنل مدیریت</h2>
					<p className="text-sm text-slate-500">نرم‌افزار جامع هیوادنت</p>
				</div>

				<div className="p-8 pt-0">
					<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-5">
						<div>
							<label className="block text-sm font-semibold text-slate-700 mb-1.5">شماره موبایل</label>
							<div className="relative">
								<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
									<Phone className="h-5 w-5 text-slate-400" />
								</div>
								<input
									type="tel"
									dir="ltr"
									{...register("PhoneNumber")}
									placeholder="09123456789"
									className="block w-full pl-3 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-900 placeholder-slate-400 sm:text-sm transition-all outline-none bg-slate-50 focus:bg-white"
								/>
							</div>
							{errors.PhoneNumber && (
								<p className="text-rose-500 text-sm mt-1.5 font-medium">{errors.PhoneNumber.message}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-semibold text-slate-700 mb-1.5">رمز عبور</label>
							<div className="relative">
								<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-slate-400" />
								</div>
								<input
									type="password"
									dir="ltr"
									{...register("Password")}
									placeholder="••••••••"
									className="block w-full pl-3 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-900 placeholder-slate-400 sm:text-sm transition-all outline-none bg-slate-50 focus:bg-white"
								/>
							</div>
							{errors.Password && (
								<p className="text-rose-500 text-sm mt-1.5 font-medium">{errors.Password.message}</p>
							)}
						</div>

						<div className="pt-2">
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										در حال ورود...
									</>
								) : (
									<>
										<LogIn className="w-5 h-5" />
										ورود به سیستم
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>

			<div className="absolute bottom-6 text-center text-sm text-slate-400 font-medium">
				تمامی حقوق نزد تولید کننده نرم‌افزار آریا طراحان سورن محفوظ است.
			</div>
		</div>
	);
}
