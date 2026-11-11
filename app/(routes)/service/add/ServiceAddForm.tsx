"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, Loader2, Package, Plus, Save, User, CreditCard } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import CustomerSelector from "@/components/customer/CustomerSelector";
import { CustomerGetGuildsDto } from "@/dataBinding/models/Customer/CustomerGetGuildGroupDetailDto";
import { CustomerGetRepresentativeDto } from "@/dataBinding/models/Customer/CustomerGetRepresentativeDto";
import { GuildGroupGetCustomerGuildGroupListDto } from "@/dataBinding/models/Guild/GuildGroup/GuildGroupGetCustomerGuildGroupListDto";
import { ServiceAddDto, ServiceAddItemDto, ServiceAddSchema } from "@/dataBinding/models/Service/ServiceAddDto";
import { ServiceCostGetByGuildIdDto } from "@/dataBinding/models/ServiceCost/ServiceCostGetByGuildIdDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import { GuildGroupService } from "@/dataBinding/services/Guild/GuildGroupService";
import { GuildService } from "@/dataBinding/services/Guild/GuildService";
import { ServiceService } from "@/dataBinding/services/Service/ServiceService";
import { ServiceCostService } from "@/dataBinding/services/ServiceCost/ServiceCostService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";

import ServiceItemCard from "./ServiceItemCard";
import ServicePaymentForm from "./ServicePaymentForm";
import GuildGroupAddCustomerForm from "../../customers/GuildGroupAddCustomerForm";
import Popup from "@/utilities/components/popup";
import { Textarea } from "@/utilities/components/ui/textarea";
import { CustomerBankCardDto } from "@/dataBinding/models/Customer/Card/CustomerBankCardDto";
import CopyToClipboard from "@/utilities/components/copy/CopyToClipboard";
import { formatCardNumber } from "@/utilities/lib/utils";

export type CustomerGuildMonthStatusDto = {
	Month: number;
	IsDone: boolean;
	Title?: string | null;
	DoneAt?: string | null;
};

interface SelectOptionDto {
	Id: number;
	Title: string;
}

interface ServiceAddFormProps {
	onClose: () => void;
	onSuccess: () => void;
}

const getCurrentPersianPeriod = (): { PersianYear: number; PersianMonth: number } => {
	try {
		const parts = new Intl.DateTimeFormat("en-US-u-ca-persian", {
			year: "numeric",
			month: "numeric",
		}).formatToParts(new Date());

		const year = parts.find((part) => part.type === "year")?.value;
		const month = parts.find((part) => part.type === "month")?.value;
		const parsedYear = Number(year);
		const parsedMonth = Number(month);

		return { PersianYear: parsedYear, PersianMonth: parsedMonth };
	} catch {
		return { PersianYear: 1400, PersianMonth: 1 };
	}
};

const createDefaultItem = (): ServiceAddItemDto => ({
	GuildId: 0,
	GuildGroupId: 0,
	ServiceCostId: 0,
	RepresentativeCustomerId: 0,
	Quantity: 1,
	UnitPrice: 0,
	Discount: 0,
	Description: "",
	PerformedPeriods: [getCurrentPersianPeriod()],
});

export default function ServiceAddForm({ onClose, onSuccess }: ServiceAddFormProps) {
	const [registeredServiceId, setRegisteredServiceId] = useState<number | null>(null);

	const [isAddGuildModalOpen, setIsAddGuildModalOpen] = useState(false);

	const [guildsMap, setGuildsMap] = useState<Record<number, SelectOptionDto[]>>({});
	const [serviceCostsMap, setServiceCostsMap] = useState<Record<number, ServiceCostGetByGuildIdDto[]>>({});
	const [guildGroupsMap, setGuildGroupsMap] = useState<Record<number, GuildGroupGetCustomerGuildGroupListDto[]>>({});
	const [guildGroupDetailMap, setGuildGroupDetailMap] = useState<
		Record<number, Record<number, CustomerGetGuildsDto>>
	>({});
	const [representativesMap, setRepresentativesMap] = useState<
		Record<number, Record<number, CustomerGetRepresentativeDto[]>>
	>({});
	const [collapsedItemMap, setCollapsedItemMap] = useState<Record<string, boolean>>({});

	const [cardsData, setCardsData] = useState<CustomerBankCardDto[] | null>(null);

	const {
		register,
		control,
		handleSubmit,
		watch,
		reset,
		setValue,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<ServiceAddDto>({
		resolver: zodResolver(ServiceAddSchema),
		defaultValues: {
			CustomerId: 0,
			Description: "",
			Items: [createDefaultItem()],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "Items",
	});

	const watchedItems = useWatch({
		control,
		name: "Items",
	});

	const customerId = watch("CustomerId");

	const summary = useMemo(() => {
		const totalPrice =
			watchedItems.reduce((sum, item) => {
				const quantity = Number(item?.Quantity || 0);
				const unitPrice = Number(item?.UnitPrice || 0);
				return sum + quantity * unitPrice;
			}, 0) || 0;

		const totalDiscount =
			watchedItems.reduce((sum, item) => {
				return sum + Number(item?.Discount || 0);
			}, 0) || 0;

		const totalFinal = Math.max(totalPrice - totalDiscount, 0);
		return {
			totalPrice,
			totalDiscount,
			totalFinal,
		};
	}, [watchedItems]);

	useEffect(() => {
		const currentItems = getValues("Items") || [];
		currentItems.forEach((_, index) => {
			setValue(`Items.${index}.RepresentativeCustomerId`, 0);
		});
		void fetchBaseData();
		void fetchCardsData(customerId);
	}, [customerId]);

	const fetchCardsData = async (id: number) => {
		if (!id || id <= 0) {
			setCardsData(null);
			return;
		}
		try {
			const result = await CustomerService.GetCards(id);
			setCardsData(result || []);
		} catch {
			setCardsData([]);
			Messenger.errorMessage("خطا در دریافت کارت‌های بانکی مشتری");
		}
	};

	const fetchBaseData = async () => {
		try {
			await fetchGuildData();

			const last = await ServiceService.GetLast(customerId);

			if (last) {
				reset({
					CustomerId: customerId,
					Description: last.Description ?? "",
					Items: last.Items.map((e) => ({
						GuildId: e.GuildId,
						GuildGroupId: e.GuildGroupId,
						ServiceCostId: e.ServiceCostId,
						RepresentativeCustomerId: e.RepresentativeCustomerId ?? null,
						Quantity: e.Quantity,
						UnitPrice: e.UnitPrice,
						Discount: e.Discount,
						Description: e.Description ?? "",
						PerformedPeriods: [getCurrentPersianPeriod()],
					})),
				});

				for (const item of last.Items) {
					if (item.GuildId) {
						await fetchGuildGroupData(item.GuildId);
						await fetchServiceCosts(item.GuildId);
					}

					if (item.GuildGroupId) {
						await fetchRepresentatives(customerId, item.GuildGroupId);
					}
				}
			}
		} catch {
			Messenger.errorMessage("خطا در دریافت اطلاعات پایه");
		}
	};

	const fetchGuildData = async () => {
		for (let index = 0; index < watchedItems.length; index++) {
			setValue(`Items.${index}.GuildId`, 0);
			setValue(`Items.${index}.GuildGroupId`, 0);
			setValue(`Items.${index}.ServiceCostId`, 0);
			setValue(`Items.${index}.RepresentativeCustomerId`, null);
			setValue(`Items.${index}.UnitPrice`, 0);
		}

		const guildResult = await GuildService.GetCustomerGuildList(customerId);

		setGuildsMap((prev) => ({
			...prev,
			[customerId]: normalizeOptions(guildResult),
		}));
	};

	const fetchGuildGroupData = async (guildId: number) => {
		try {
			const guildGroupListResult = await GuildGroupService.GetCustomerGuildGroupList(guildId, customerId);

			setGuildGroupsMap((prev) => ({
				...prev,
				[guildId]: guildGroupListResult,
			}));
		} catch {
			setGuildGroupsMap((prev) => ({
				...prev,
				[guildId]: [],
			}));
			Messenger.errorMessage("خطا در دریافت گروه‌های سامانه از سرور");
		}
	};

	const fetchServiceCosts = async (guildId: number) => {
		try {
			const result = await ServiceCostService.GetByGuildId(guildId);

			setServiceCostsMap((prev) => ({
				...prev,
				[guildId]: result,
			}));
		} catch {
			setServiceCostsMap((prev) => ({
				...prev,
				[guildId]: [],
			}));
			Messenger.errorMessage("خطا در دریافت هزینه‌های خدمت");
		}
	};

	const fetchRepresentatives = async (customerId: number, guildGroupId: number) => {
		try {
			const result = await CustomerService.GetRepresentative(customerId, guildGroupId);

			setRepresentativesMap((prev) => ({
				...prev,
				[customerId]: {
					...(prev[customerId] || {}),
					[guildGroupId]: result,
				},
			}));

			const guildGroupDetail = await CustomerService.GetGuildGroupDetail(customerId, guildGroupId);

			setGuildGroupDetailMap((prev) => ({
				...prev,
				[customerId]: {
					...(prev[customerId] || {}),
					[guildGroupId]: guildGroupDetail,
				},
			}));
		} catch {
			setRepresentativesMap((prev) => ({
				...prev,
				[customerId]: {
					...(prev[customerId] || {}),
					[guildGroupId]: [],
				},
			}));

			Messenger.errorMessage("خطا در دریافت نمایندگان مشتری");
		}
	};

	const normalizeOptions = (result: any): SelectOptionDto[] => {
		const list = Array.isArray(result) ? result : result?.Data || result?.data || [];

		return (list || []).map((item: any) => ({
			Id: Number(item.Id ?? item.id ?? 0),
			Title: String(item.Title ?? item.Name ?? item.Label ?? ""),
		}));
	};

	const formatPrice = (value: number) => {
		return new Intl.NumberFormat("fa-IR").format(value);
	};

	const handleGuildChange = async (index: number, guildId: number) => {
		setValue(`Items.${index}.GuildGroupId`, 0);
		setValue(`Items.${index}.ServiceCostId`, 0);
		setValue(`Items.${index}.RepresentativeCustomerId`, null);
		setValue(`Items.${index}.UnitPrice`, 0);

		if (!guildId || guildId <= 0) return;

		if (!guildGroupsMap[guildId]) {
			await fetchGuildGroupData(guildId);
		}

		if (!serviceCostsMap[guildId]) {
			await fetchServiceCosts(guildId);
		}
	};

	const handleServiceCostChange = (index: number, serviceCostId: number) => {
		const currentGuildId = Number(getValues(`Items.${index}.GuildId`) || 0);
		const rowServiceCosts = serviceCostsMap[currentGuildId] || [];
		const selectedServiceCost = rowServiceCosts.find((x) => x.Id === serviceCostId);

		setValue(`Items.${index}.UnitPrice`, selectedServiceCost?.Price || 0);
	};

	const toggleItemCollapse = (fieldId: string) => {
		setCollapsedItemMap((prev) => ({
			...prev,
			[fieldId]: !prev[fieldId],
		}));
	};

	const collapseAllItems = () => {
		setCollapsedItemMap(() => {
			const next: Record<string, boolean> = {};

			fields.forEach((item) => {
				next[item.id] = true;
			});

			return next;
		});
	};

	const expandAllItems = () => {
		setCollapsedItemMap(() => {
			const next: Record<string, boolean> = {};

			fields.forEach((item) => {
				next[item.id] = false;
			});

			return next;
		});
	};

	const handleAddItem = () => {
		setCollapsedItemMap(() => {
			const next: Record<string, boolean> = {};

			fields.forEach((item) => {
				next[item.id] = true;
			});

			return next;
		});

		append(createDefaultItem());
	};

	const onInvalid = (formErrors: any) => {
		if (formErrors?.Items) {
			setCollapsedItemMap((prev) => {
				const next = { ...prev };

				formErrors.Items.forEach((itemError: any, index: number) => {
					if (itemError && fields[index]) {
						next[fields[index].id] = false;
					}
				});

				return next;
			});
		}

		Messenger.errorMessage("لطفاً خطاهای فرم را بررسی کنید.");
	};

	const handleGuildGroupChange = async (index: number, guildGroupId: number) => {
		setValue(`Items.${index}.RepresentativeCustomerId`, null);

		if (!customerId || customerId <= 0 || !guildGroupId || guildGroupId <= 0) return;

		if (!representativesMap[customerId]?.[guildGroupId]) {
			await fetchRepresentatives(customerId, guildGroupId);
		}
	};

	const handleCopyItem = (index: number) => {
		const currentItems = getValues("Items") || [];
		const itemToCopy = currentItems[index];

		if (!itemToCopy) return;

		const copiedItem: ServiceAddItemDto = {
			...itemToCopy,
			Description: itemToCopy.Description || "",
			PerformedPeriods: (itemToCopy.PerformedPeriods || []).map((period) => ({
				PersianYear: period.PersianYear,
				PersianMonth: period.PersianMonth,
			})),
		};

		setCollapsedItemMap(() => {
			const next: Record<string, boolean> = {};

			fields.forEach((item) => {
				next[item.id] = true;
			});

			return next;
		});

		append(copiedItem);

		Messenger.successAlert?.("آیتم با موفقیت کپی شد.");
	};

	const onSubmit = async (data: ServiceAddDto) => {
		try {
			const payload: ServiceAddDto = {
				...data,
				Description: data.Description || "",
				Items: data.Items.map((item) => ({
					...item,
					RepresentativeCustomerId:
						item.RepresentativeCustomerId && item.RepresentativeCustomerId > 0
							? item.RepresentativeCustomerId
							: null,
					Description: item.Description || "",
					PerformedPeriods: (item.PerformedPeriods || []).map((period) => ({
						PersianYear: Number(period.PersianYear),
						PersianMonth: Number(period.PersianMonth),
					})),
				})),
			};

			const result = await ServiceService.Add(payload);

			if (result) {
				Messenger.successAlert("خدمت با موفقیت ثبت شد. لطفا وضعیت تسویه را مشخص کنید.");
				setRegisteredServiceId(result);
			}
		} catch {
			Messenger.errorMessage("ارتباط با سرور برقرار نشد.");
		}
	};

	if (registeredServiceId) {
		return (
			<ServicePaymentForm
				customerId={customerId}
				defaultAmount={summary.totalFinal}
				onClose={onClose}
				onSuccess={onSuccess}
				serviceId={registeredServiceId}
			/>
		);
	}

	return (
		<PageCard>
			<form onSubmit={(e) => void handleSubmit(onSubmit, onInvalid)(e)} className="space-y-6">
				<PageCardContent className="grid grid-cols-1 xl:grid-cols-3 gap-6">
					<div className="xl:col-span-2 space-y-6">
						<div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
							<div className="p-4 border-b border-slate-200 flex items-center gap-2">
								<User className="w-5 h-5 text-indigo-600" />
								<span className="text-sm font-semibold text-slate-700">اطلاعات اصلی</span>
							</div>

							<div className="p-4 space-y-5">
								<div>
									<CustomerSelector
										valueId={watch("CustomerId")}
										onChange={(e) => setValue("CustomerId", e?.Id ?? 0)}
										label="انتخاب مشتری"
										required
									/>

									{errors.CustomerId && (
										<p className="text-rose-500 text-sm mt-1.5 font-medium">
											{errors.CustomerId.message}
										</p>
									)}
								</div>

								<Textarea
									label="توضیحات"
									schema={ServiceAddSchema}
									error={errors.Description?.message}
									placeholder="توضیحات مربوط به خدمت..."
									rows={2}
									textareaClassName="focus:bg-white"
									{...register("Description")}
								/>

								{customerId > 0 && cardsData !== null && (
									<div className="pt-5 border-t border-slate-100">
										<div className="flex items-center gap-2 mb-3">
											<CreditCard className="w-4 h-4 text-slate-500" />
											<span className="text-sm font-semibold text-slate-600">
												کارت‌های بانکی ثبت‌شده مشتری
											</span>
										</div>

										{cardsData.length === 0 ? (
											<p className="text-sm text-slate-400">
												هیچ کارت بانکی برای این مشتری ثبت نشده است.
											</p>
										) : (
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
												{cardsData.map((card) => (
													<div
														key={card.Id}
														className="p-3.5 rounded-lg border text-sm transition-all flex flex-col gap-2 border-slate-200 bg-white"
													>
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-2">
																<CreditCard className="w-4 h-4 text-slate-400" />
																<span className="font-mono font-bold text-slate-700 [direction:ltr] tracking-wide text-sm inline-flex items-center gap-1.5">
																	{formatCardNumber(card.CardNumber)}
																	<CopyToClipboard
																		textToCopy={card.CardNumber}
																		size={13}
																	/>
																</span>
															</div>
														</div>

														<div className="flex justify-between items-center text-xs text-slate-500">
															<span className="font-medium text-slate-600 inline-flex items-center gap-1">
																{card.OwnerName || "بدون نام"}
																<CopyToClipboard
																	textToCopy={card.OwnerName || "بدون نام"}
																	size={11}
																/>
															</span>
															{(card.ExpireMonth || card.ExpireYear) && (
																<span className="font-mono text-slate-400 inline-flex items-center gap-1">
																	<span>انقضا:</span>
																	<span className="inline-flex items-center">
																		{card.ExpireMonth || "00"}
																		<CopyToClipboard
																			textToCopy={card.ExpireMonth}
																			size={10}
																		/>
																	</span>
																	<span>/</span>
																	<span className="inline-flex items-center">
																		{card.ExpireYear || "00"}
																		<CopyToClipboard
																			textToCopy={card.ExpireYear}
																			size={10}
																		/>
																	</span>
																</span>
															)}
														</div>

														{(card.AccountNumber || card.ShebaNumber) && (
															<div className="pt-2 mt-1 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-500 font-mono [direction:ltr] text-right">
																{card.AccountNumber && (
																	<div className="flex justify-between items-center">
																		<span className="text-slate-400 font-sans [direction:rtl]">
																			حساب:
																		</span>
																		<span className="font-semibold inline-flex items-center gap-1">
																			{card.AccountNumber}
																			<CopyToClipboard
																				textToCopy={card.AccountNumber}
																				size={11}
																			/>
																		</span>
																	</div>
																)}
																{card.ShebaNumber && (
																	<div className="flex justify-between items-center">
																		<span className="text-slate-400 font-sans [direction:rtl]">
																			شبا:
																		</span>
																		<span className="font-semibold inline-flex items-center gap-1">
																			{card.ShebaNumber.toUpperCase().startsWith(
																				"IR",
																			)
																				? ""
																				: "IR-"}
																			{card.ShebaNumber}
																			<CopyToClipboard
																				textToCopy={card.ShebaNumber}
																				size={11}
																			/>
																		</span>
																	</div>
																)}
															</div>
														)}
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						<div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
							<div className="p-4 border-b border-slate-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex items-center gap-2">
									<Package className="w-5 h-5 text-indigo-600" />
									<span className="text-sm font-semibold text-slate-700">آیتم‌های خدمت</span>

									<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
										{fields.length} آیتم
									</span>
								</div>

								<div className="flex flex-wrap items-center gap-2 flex-col md:flex-row">
									<Button
										size="sm"
										type="button"
										onClick={expandAllItems}
										className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
									>
										باز کردن همه
									</Button>

									<Button
										size="sm"
										type="button"
										onClick={collapseAllItems}
										className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
									>
										بستن همه
									</Button>

									<Button
										size="sm"
										type="button"
										onClick={handleAddItem}
										className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
									>
										<Plus className="w-4 h-4" />
										افزودن آیتم
									</Button>
								</div>
							</div>

							<div className="p-4 flex flex-col gap-4 bg-slate-50/30">
								{fields.map((field, index) => {
									const row = watchedItems?.[index];

									const selectedGuildId = Number(row?.GuildId || 0);
									const selectedGuildGroupId = Number(row?.GuildGroupId || 0);

									const rowGuildGroups = guildGroupsMap[selectedGuildId] || [];
									const rowServiceCosts = serviceCostsMap[selectedGuildId] || [];

									const rowRepresentatives =
										customerId > 0
											? representativesMap[customerId]?.[selectedGuildGroupId] || []
											: [];

									const rowGuildGroupDetail =
										customerId > 0
											? guildGroupDetailMap[customerId]?.[selectedGuildGroupId] || null
											: null;

									const isCollapsed = collapsedItemMap[field.id] === true;
									const itemHasError = Boolean(errors.Items?.[index]);

									return (
										<ServiceItemCard
											key={field.id}
											fieldId={field.id}
											index={index}
											fieldsLength={fields.length}
											row={row}
											customerId={customerId}
											control={control}
											register={register}
											errors={errors}
											setValue={setValue}
											isCollapsed={isCollapsed}
											itemHasError={itemHasError}
											guilds={guildsMap[customerId] || []}
											rowGuildGroups={rowGuildGroups}
											rowServiceCosts={rowServiceCosts}
											rowRepresentatives={rowRepresentatives}
											rowGuildGroupDetail={rowGuildGroupDetail}
											onToggleCollapse={toggleItemCollapse}
											onRemove={remove}
											setIsAddGuildModalOpen={setIsAddGuildModalOpen}
											onGuildChange={handleGuildChange}
											onGuildGroupChange={handleGuildGroupChange}
											onServiceCostChange={handleServiceCostChange}
											formatPrice={formatPrice}
											onCopy={() => handleCopyItem(index)}
										/>
									);
								})}
							</div>
						</div>
					</div>

					<div className="border border-slate-200 rounded-xl overflow-hidden bg-white sticky top-4">
						<div className="p-4 border-b border-slate-200 flex items-center gap-2">
							<Calculator className="w-5 h-5 text-indigo-600" />
							<span className="text-sm font-semibold text-slate-700">خلاصه مالی</span>
						</div>

						<div className="p-4 space-y-3">
							<div className="flex items-center justify-between border rounded-xl px-3 py-3">
								<span className="text-slate-600 text-sm">جمع کل</span>
								<span className="font-bold text-slate-800">
									{formatPrice(summary.totalPrice)} تومان
								</span>
							</div>

							<div className="flex items-center justify-between border rounded-xl px-3 py-3">
								<span className="text-slate-600 text-sm">جمع تخفیف</span>
								<span className="font-bold text-amber-600">
									{formatPrice(summary.totalDiscount)} تومان
								</span>
							</div>

							<div className="flex items-center justify-between border rounded-xl px-3 py-3 bg-green-50 border-green-200">
								<span className="text-slate-700 text-sm">مبلغ نهایی</span>
								<span className="font-extrabold text-green-700">
									{formatPrice(summary.totalFinal)} تومان
								</span>
							</div>
						</div>
					</div>
				</PageCardContent>
				<PageCardFooter className="flex items-center gap-3 mt-8 pt-4 border-t border-slate-100">
					<Button type="button" onClick={onClose} variant="secondary">
						انصراف
					</Button>

					<Button type="submit" disabled={isSubmitting} variant="submit">
						{isSubmitting ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								در حال ذخیره...
							</>
						) : (
							<>
								<Save className="w-5 h-5" />
								ثبت خدمت
							</>
						)}
					</Button>
				</PageCardFooter>
			</form>

			<Popup
				show={isAddGuildModalOpen}
				onClose={() => setIsAddGuildModalOpen(false)}
				title="اختصاص سامانه به مشتری"
				description="اتصال و تخصیص سامانه‌های فعال به مشتری"
				fullScreen
			>
				<GuildGroupAddCustomerForm
					onClose={() => setIsAddGuildModalOpen(false)}
					onSuccess={() => {
						setIsAddGuildModalOpen(false);

						void fetchGuildData();
					}}
					customerId={customerId}
				/>
			</Popup>
		</PageCard>
	);
}
