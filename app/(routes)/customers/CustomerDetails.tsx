"use client";

import {
	AlertCircle,
	Briefcase,
	Building2,
	Code,
	CreditCard, // آیکون جدید برای کارت‌های بانکی
	Layers3,
	Loader2,
	MapPin,
	Phone,
	ShieldCheck,
	ShieldX,
	User,
	UserRoundCheck,
	Users,
	Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

import { CustomerGetDetailDto } from "@/dataBinding/models/Customer/CustomerDetailsDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import { CustomerBankCardDto } from "@/dataBinding/models/Customer/Card/CustomerBankCardDto";
import CopyToClipboard from "@/utilities/components/copy/CopyToClipboard";
import { formatCardNumber } from "@/utilities/lib/utils";

interface CustomerDetailsProps {
	id: number;
}

type CustomerDetailsTab =
	| "base"
	| "financial"
	| "bankCards"
	| "guildGroups"
	| "representatives"
	| "mainRepresentatives";

const formatPrice = (value?: number | null) => {
	const numberValue = Number(value || 0);
	return numberValue.toLocaleString("fa-IR");
};

export default function CustomerDetails({ id }: CustomerDetailsProps) {
	const [data, setData] = useState<CustomerGetDetailDto | null>(null);
	const [cardsData, setCardsData] = useState<CustomerBankCardDto[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<CustomerDetailsTab>("base");

	useEffect(() => {
		let isMounted = true;

		const fetchCustomerDetails = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await CustomerService.GetDetails(id);
				const cardsResponse = await CustomerService.GetCards(id);

				if (isMounted) {
					setData(response);
					setCardsData(cardsResponse);
				}
			} catch (err) {
				if (isMounted) {
					setError("خطا در دریافت اطلاعات مشتری. لطفا مجددا تلاش کنید.");
					console.error("Error fetching customer details:", err);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		if (id) {
			void fetchCustomerDetails();
		}

		return () => {
			isMounted = false;
		};
	}, [id]);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-slate-500 min-h-50">
				<Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-600" />
				<p className="text-sm font-medium">در حال دریافت اطلاعات...</p>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="flex flex-col items-center justify-center p-8 bg-rose-50 rounded-xl border border-rose-100 min-h-50">
				<AlertCircle className="w-8 h-8 text-rose-500 mb-3" />
				<p className="text-sm font-medium text-rose-700 text-center">{error || "اطلاعاتی یافت نشد."}</p>
			</div>
		);
	}

	const guildGroups = data.GuildGroups || [];
	const representatives = data.Representatives || [];
	const mainRepresentatives = data.MainRepresentatives || [];

	const bankCards = cardsData || [];

	const tabs: {
		key: CustomerDetailsTab;
		title: string;
		badge?: number;
	}[] = [
		{
			key: "base",
			title: "اطلاعات پایه",
		},
		{
			key: "financial",
			title: "اطلاعات مالی",
		},
		{
			key: "bankCards",
			title: "کارت‌های بانکی",
			badge: bankCards.length,
		},
		{
			key: "guildGroups",
			title: "گروه‌های سامانه",
			badge: guildGroups.length,
		},
		{
			key: "representatives",
			title: "نمایندگان",
			badge: representatives.length,
		},
		{
			key: "mainRepresentatives",
			title: "مشتریان تحت نمایندگی",
			badge: mainRepresentatives.length,
		},
	];

	return (
		<div className="flex flex-col gap-6 w-full">
			<div className="flex items-center gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
				<div className="bg-indigo-100 p-3.5 rounded-full shrink-0">
					<User className="w-7 h-7 text-indigo-600" />
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<h2 className="text-xl font-bold text-slate-800">
							{data.FirstName} {data.LastName}
						</h2>

						<span
							className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
								data.IsActive
									? "bg-emerald-50 text-emerald-700 border border-emerald-100"
									: "bg-rose-50 text-rose-700 border border-rose-100"
							}`}
						>
							{data.IsActive ? (
								<ShieldCheck className="w-3.5 h-3.5" />
							) : (
								<ShieldX className="w-3.5 h-3.5" />
							)}

							{data.IsActive ? "فعال" : "غیرفعال"}
						</span>

						<span className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 text-xs font-bold">
							{data.TypeName || "نوع نامشخص"}
						</span>
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
				<div className="flex flex-wrap gap-1 border-b border-slate-100 bg-slate-50 p-2">
					{tabs.map((tab) => {
						const isActive = activeTab === tab.key;

						return (
							<button
								key={tab.key}
								type="button"
								onClick={() => setActiveTab(tab.key)}
								className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-all ${
									isActive
										? "bg-indigo-600 text-white shadow-sm"
										: "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
								}`}
							>
								{tab.title}

								{typeof tab.badge === "number" && (
									<span
										className={`inline-flex min-w-5 h-5 items-center justify-center rounded-full px-1.5 text-[11px] font-extrabold ${
											isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
										}`}
									>
										{tab.badge}
									</span>
								)}
							</button>
						);
					})}
				</div>

				<div className="p-4">
					{activeTab === "base" && <BaseInfoTab data={data} />}

					{activeTab === "financial" && <FinancialInfoTab data={data} />}

					{activeTab === "bankCards" && <BankCardsTab items={bankCards} />}

					{activeTab === "guildGroups" && <GuildGroupsTab items={guildGroups} />}

					{activeTab === "representatives" && <RepresentativesTab items={representatives} />}

					{activeTab === "mainRepresentatives" && <MainRepresentativesTab items={mainRepresentatives} />}
				</div>
			</div>
		</div>
	);
}

function BaseInfoTab({ data }: { data: CustomerGetDetailDto }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<InfoCard
				icon={<Phone className="w-5 h-5 text-blue-600" />}
				iconClassName="bg-blue-50"
				label="شماره موبایل"
				value={data.PhoneNumber || "ثبت نشده"}
				valueClassName="dir-ltr text-right tracking-wider"
			/>

			<InfoCard
				icon={<Code className="w-5 h-5 text-emerald-600" />}
				iconClassName="bg-emerald-50"
				label="کد ملی"
				value={data.NationalCode || "ثبت نشده"}
			/>

			<InfoCard
				icon={<User className="w-5 h-5 text-indigo-600" />}
				iconClassName="bg-indigo-50"
				label="نوع مشتری"
				value={data.TypeName || "ثبت نشده"}
			/>

			<InfoCard
				icon={<Briefcase className="w-5 h-5 text-amber-600" />}
				iconClassName="bg-amber-50"
				label="شغل"
				value={data.Job || "ثبت نشده"}
			/>

			<div className="md:col-span-2">
				<InfoCard
					icon={<MapPin className="w-5 h-5 text-rose-600" />}
					iconClassName="bg-rose-50"
					label="آدرس"
					value={data.Address || "ثبت نشده"}
				/>
			</div>

			<div className="md:col-span-2">
				<div
					className={`flex items-center gap-3 p-4 rounded-xl border shadow-sm ${
						data.IsActive ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"
					}`}
				>
					<div className={`p-2.5 rounded-lg ${data.IsActive ? "bg-emerald-100" : "bg-rose-100"}`}>
						{data.IsActive ? (
							<ShieldCheck className="w-5 h-5 text-emerald-600" />
						) : (
							<ShieldX className="w-5 h-5 text-rose-600" />
						)}
					</div>

					<div>
						<p className="text-xs text-slate-500 mb-1">وضعیت حساب</p>
						<p className={`font-bold ${data.IsActive ? "text-emerald-700" : "text-rose-700"}`}>
							{data.IsActive ? "مشتری فعال است" : "مشتری غیرفعال است"}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function FinancialInfoTab({ data }: { data: CustomerGetDetailDto }) {
	const balance = Number(data.Transaction?.CurrentBalance || 0);

	return (
		<div className="space-y-4">
			<div
				className={`rounded-xl border p-5 ${
					balance >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"
				}`}
			>
				<div className="flex items-center gap-4">
					<div className={`p-3.5 rounded-xl ${balance >= 0 ? "bg-emerald-100" : "bg-rose-100"}`}>
						<Wallet className={`w-7 h-7 ${balance >= 0 ? "text-emerald-600" : "text-rose-600"}`} />
					</div>

					<div>
						<p className="text-sm text-slate-500 mb-1">مانده حساب فعلی</p>
						<p className={`text-2xl font-extrabold ${balance >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
							{formatPrice(balance)} تومان
						</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<InfoCard
					icon={<Wallet className="w-5 h-5 text-indigo-600" />}
					iconClassName="bg-indigo-50"
					label="وضعیت مالی"
					value={balance >= 0 ? "بستانکار / بدون بدهی" : "بدهکار"}
				/>
			</div>
		</div>
	);
}

function BankCardsTab({ items }: { items: CustomerBankCardDto[] }) {
	if (!items || items.length === 0) {
		return (
			<EmptyState
				icon={<CreditCard className="w-8 h-8 text-slate-400" />}
				title="کارت بانکی ثبت نشده است"
				description="برای این مشتری هنوز کارت بانکی ثبت نشده است."
			/>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
			{items.map((card) => (
				<div
					key={card.Id}
					className="flex flex-col max-w-85 w-full mx-auto md:mx-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
				>
					<div
						className={`relative p-5 aspect-[1.7/1] w-full flex flex-col justify-between text-white rounded-t-xl [direction:ltr] bg-linear-to-br from-slate-700 to-slate-900`}
					>
						<div className="flex justify-between items-center">
							<span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
								کارت بانکی
							</span>
						</div>

						<div className="flex items-center justify-between my-1">
							<span className="text-base md:text-lg font-bold tracking-widest text-slate-100">
								{formatCardNumber(card.CardNumber)}
								<CopyToClipboard textToCopy={card.CardNumber} size={14} />
							</span>
						</div>

						<div className="flex justify-between items-end">
							<div className="max-w-[70%] text-left">
								<span className="text-[8px] text-slate-400 block mb-0.5 [direction:rtl] text-left">
									دارنده کارت
								</span>
								<span className="font-medium text-xs truncate block text-slate-200">
									{card.OwnerName || "---"}
									<CopyToClipboard textToCopy={card.OwnerName} size={10} />
								</span>
							</div>

							<div className="flex gap-3">
								{(card.ExpireMonth || card.ExpireYear) && (
									<div>
										<span className="text-[8px] text-slate-400 block mb-0.5">EXP</span>
										<span className="text-[11px] text-slate-200">
											{card.ExpireMonth || "00"}
											<CopyToClipboard textToCopy={card.ExpireMonth} size={10} />/
											{card.ExpireYear || "00"}
											<CopyToClipboard textToCopy={card.ExpireYear} size={10} />
										</span>
									</div>
								)}
								{card.Cvv2 && (
									<div>
										<span className="text-[8px] text-slate-400 block mb-0.5">CVV2</span>
										<span className="text-[11px] text-slate-200">
											{card.Cvv2}
											<CopyToClipboard textToCopy={card.OwnerName} size={10} />
										</span>
									</div>
								)}
							</div>
						</div>
					</div>

					{(card.AccountNumber || card.ShebaNumber) && (
						<div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
							{card.AccountNumber && (
								<div className="flex justify-between items-center text-xs">
									<span className="text-slate-500 text-[11px]">شماره حساب:</span>
									<div className="flex items-center gap-1.5 [direction:ltr]">
										<span className="text-slate-700 font-medium">{card.AccountNumber}</span>
										<CopyToClipboard textToCopy={card.AccountNumber} size={12} />
									</div>
								</div>
							)}
							{card.ShebaNumber && (
								<div className="flex justify-between items-center text-xs">
									<span className="text-slate-500 text-[11px]">شماره شبا:</span>
									<div className="flex items-center gap-1.5 [direction:ltr]">
										<span className="text-slate-700 font-medium">
											{card.ShebaNumber.toUpperCase().startsWith("IR") ? "" : "IR-"}
											{card.ShebaNumber}
										</span>
										<CopyToClipboard textToCopy={card.ShebaNumber} size={12} />
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			))}
		</div>
	);
}

function GuildGroupsTab({ items }: { items: CustomerGetDetailDto["GuildGroups"] }) {
	if (!items || items.length === 0) {
		return (
			<EmptyState
				icon={<Layers3 className="w-8 h-8 text-slate-400" />}
				title="گروه سامانه‌ای ثبت نشده است"
				description="برای این مشتری هنوز گروه سامانه‌ای ثبت نشده است."
			/>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
			{items.map((item) => (
				<div
					key={item.Id}
					className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
				>
					<div className="bg-indigo-50 p-2.5 rounded-lg">
						<Layers3 className="w-5 h-5 text-indigo-600" />
					</div>

					<div>
						<p className="font-bold text-slate-800">{item.Name || "بدون عنوان"}</p>
					</div>
				</div>
			))}
		</div>
	);
}

function RepresentativesTab({ items }: { items: CustomerGetDetailDto["Representatives"] }) {
	if (!items || items.length === 0) {
		return (
			<EmptyState
				icon={<Users className="w-8 h-8 text-slate-400" />}
				title="نماینده‌ای ثبت نشده است"
				description="برای این مشتری هنوز نماینده‌ای ثبت نشده است."
			/>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-3">
			{items.map((item) => (
				<div
					key={item.Id}
					className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
				>
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-emerald-50 p-2.5 rounded-lg">
								<UserRoundCheck className="w-5 h-5 text-emerald-600" />
							</div>

							<div>
								<p className="font-bold text-slate-800">{item.Name || "بدون نام"}</p>
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							<span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
								<Building2 className="w-3.5 h-3.5" />
								{item.GuildName || "سامانه نامشخص"}
							</span>

							<span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
								<Layers3 className="w-3.5 h-3.5" />
								{item.GuildGroupName || "گروه نامشخص"}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

function InfoCard({
	icon,
	iconClassName,
	label,
	value,
	valueClassName = "",
}: {
	icon: React.ReactNode;
	iconClassName?: string;
	label: string;
	value: string;
	valueClassName?: string;
}) {
	return (
		<div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
			<div className={`${iconClassName || "bg-slate-50"} p-2.5 rounded-lg shrink-0`}>{icon}</div>

			<div className="min-w-0">
				<p className="text-xs text-slate-500 mb-1">{label}</p>
				<p className={`font-medium text-slate-800 wrap-break-word ${valueClassName}`}>
					{value}
					<CopyToClipboard textToCopy={value} size={12} />
				</p>
			</div>
		</div>
	);
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
	return (
		<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
			<div className="mb-3">{icon}</div>
			<p className="text-sm font-bold text-slate-700">{title}</p>
			<p className="text-xs text-slate-500 mt-1">{description}</p>
		</div>
	);
}

function MainRepresentativesTab({ items }: { items: CustomerGetDetailDto["MainRepresentatives"] }) {
	if (!items || items.length === 0) {
		return (
			<EmptyState
				icon={<UserRoundCheck className="w-8 h-8 text-slate-400" />}
				title="مشتری تحت نمایندگی ثبت نشده است"
				description="این مشتری در حال حاضر نماینده هیچ مشتری دیگری نیست."
			/>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-3">
			{items.map((item) => (
				<div
					key={item.Id}
					className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
				>
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-cyan-50 p-2.5 rounded-lg">
								<Users className="w-5 h-5 text-cyan-600" />
							</div>

							<div>
								<p className="font-bold text-slate-800">{item.Name || "بدون نام"}</p>
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							<span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
								<Building2 className="w-3.5 h-3.5" />
								{item.GuildName || "سامانه نامشخص"}
							</span>

							<span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
								<Layers3 className="w-3.5 h-3.5" />
								{item.GuildGroupName || "گروه نامشخص"}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
