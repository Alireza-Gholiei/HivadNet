"use client";

import { Briefcase, Code, Layers, MapPin, Pencil, Phone, Plus, UserPlus, Users, UsersRound } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import CustomerAdd from "@/app/(routes)/customers/CustomerAddForm";
import CustomerAddWithRepresentativeForm from "@/app/(routes)/customers/CustomerAddWithRepresentativeForm";
import CustomerDetails from "@/app/(routes)/customers/CustomerDetails";
import CustomerEdit from "@/app/(routes)/customers/CustomerEditForm";
import HraderTitle from "@/components/Shared/HraderTitle";
import { CustomerGetGridDto, CustomerType } from "@/dataBinding/models/Customer/CustomerGetGridDto";
import { CustomerService } from "@/dataBinding/services/Customer/CustomerService";
import CopyToClipboard from "@/utilities/components/copy/CopyToClipboard";
import { Column } from "@/utilities/components/GridUI/Column";
import { DataGrid, DataGridRef } from "@/utilities/components/GridUI/DataGrid";
import Popup from "@/utilities/components/popup";
import { Button } from "@/utilities/components/ui/button";
import { CardTable, PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { BaseGrid } from "@/utilities/models/Grid/base-grid.model";

import CustomerAddRepresentativeByIdForm from "./CustomerAddRepresentativeByIdForm";
import CustomerAddRepresentativeForm from "./CustomerAddRepresentativeForm";
import GuildGroupAddCustomerForm from "./GuildGroupAddCustomerForm";
import CustomerAddCardForm from "./CustomerAddCardForm";

export default function CustomersPage() {
	const gridRef = useRef<DataGridRef>(null);

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isAddWithRepModalOpen, setIsAddWithRepModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [isAddToGuildModalOpen, setIsAddToGuildModalOpen] = useState(false);
	const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

	const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
	const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);
	const [selectedCustomerForGuildId, setSelectedCustomerForGuildId] = useState<number | null>(null);

	const [openNewRepPanelId, setOpenNewRepPanelId] = useState<number | null>(null);
	const [openExistingRepPanelId, setOpenExistingRepPanelId] = useState<number | null>(null);

	const fetchData = useCallback(async (params: BaseGrid) => {
		return await CustomerService.Get(params);
	}, []);

	const reloadGrid = useCallback(() => {
		gridRef.current?.reload?.();
	}, []);

	const closeRepresentativePanels = useCallback(() => {
		setOpenNewRepPanelId(null);
		setOpenExistingRepPanelId(null);
	}, []);

	const handleOpenAdd = () => {
		closeRepresentativePanels();
		setIsAddModalOpen(true);
	};

	const handleOpenAddWithRepresentative = () => {
		closeRepresentativePanels();
		setIsAddWithRepModalOpen(true);
	};

	const handleOpenEdit = (id: number) => {
		closeRepresentativePanels();
		setSelectedCustomerId(id);
		setIsEditModalOpen(true);
	};

	const handleOpenDetails = (id: number) => {
		closeRepresentativePanels();
		setSelectedDetailId(id);
		setIsDetailsModalOpen(true);
	};

	const handleOpenAddToGuild = (id: number) => {
		closeRepresentativePanels();
		setSelectedCustomerForGuildId(id);
		setIsAddToGuildModalOpen(true);
	};

	const handleOpenAddBankCard = (id: number) => {
		closeRepresentativePanels();
		setSelectedCustomerId(id);
		setIsAddCardModalOpen(true);
	};

	const handleToggleNewRepresentativePanel = (customerId: number) => {
		setOpenExistingRepPanelId(null);
		setOpenNewRepPanelId((prev) => (prev === customerId ? null : customerId));
	};

	const handleToggleExistingRepresentativePanel = (customerId: number) => {
		setOpenNewRepPanelId(null);
		setOpenExistingRepPanelId((prev) => (prev === customerId ? null : customerId));
	};

	const handleCloseAddModal = () => {
		setIsAddModalOpen(false);
	};

	const handleCloseAddWithRepModal = () => {
		setIsAddWithRepModalOpen(false);
	};

	const handleCloseEditModal = () => {
		setIsEditModalOpen(false);
		setSelectedCustomerId(null);
	};

	const handleCloseDetailsModal = () => {
		setIsDetailsModalOpen(false);
		setSelectedDetailId(null);
	};

	const handleCloseAddToGuildModal = () => {
		setIsAddToGuildModalOpen(false);
		setSelectedCustomerForGuildId(null);
	};

	const handleCloseAddBankCardModal = () => {
		setIsAddCardModalOpen(false);
		setSelectedCustomerId(null);
	};

	const renderCustomerCard = (customer: CustomerGetGridDto) => {
		return (
			<CardTable>
				<div
					className={`flex flex-col xl:flex-row items-stretch justify-between w-full rounded-xl ${customer.Type === CustomerType.Vip ? "bg-sky-400/50 hover:bg-sky-500/50" : ""}`}
				>
					<div
						className="p-5 flex items-start sm:items-center gap-4 flex-1 cursor-pointer hover:bg-slate-50 transition-colors min-w-0 rounded-r-xl"
						onClick={() => handleOpenDetails(customer.Id)}
						title="برای مشاهده جزئیات کلیک کنید"
					>
						<div className="bg-indigo-50 p-3.5 rounded-2xl border border-indigo-100 shrink-0">
							<Users className="text-indigo-600 w-6 h-6" />
						</div>

						<div className="flex flex-col gap-2 flex-1 min-w-0">
							<div className="flex flex-wrap items-center gap-2 min-w-0">
								<h3 className="font-bold text-base sm:text-lg text-slate-800 wrap-break-word">
									{customer.FullName || "بدون نام"}
								</h3>

								{customer.FullName && <CopyToClipboard textToCopy={customer.FullName} size={12} />}

								<div className="flex items-center gap-1.5 mr-2">
									<span
										className={`px-2 py-0.5 text-xs font-semibold rounded-md ${customer.IsActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
									>
										{customer.IsActive ? "فعال" : "غیرفعال"}
									</span>
									{customer.TypeName && (
										<span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-100 text-blue-700">
											{customer.TypeName}
										</span>
									)}
								</div>
							</div>

							<div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium mt-1">
								<CustomerInfoBadge
									icon={<Phone className="w-3.5 h-3.5 text-slate-400" />}
									value={customer.PhoneNumber}
									emptyText="شماره تماس ثبت نشده"
								/>

								<CustomerInfoBadge
									icon={<Code className="w-3.5 h-3.5 text-slate-400" />}
									value={customer.NationalCode}
									emptyText="کد ملی ثبت نشده"
								/>

								<CustomerInfoBadge
									icon={<Briefcase className="w-3.5 h-3.5 text-slate-400" />}
									value={customer.Job}
									emptyText="شغل ثبت نشده"
								/>

								<CustomerInfoBadge
									icon={<MapPin className="w-3.5 h-3.5 text-slate-400" />}
									value={customer.Address}
									emptyText="آدرس ثبت نشده"
								/>
							</div>
						</div>
					</div>

					<div className="p-3 sm:p-5 border-t xl:border-t-0 xl:border-r border-slate-100 bg-slate-50/60 xl:bg-transparent shrink-0">
						<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2 xl:w-40">
							<Button
								variant="outline"
								className="h-10 justify-center gap-1.5 px-2 text-xs sm:text-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50 bg-white transition-colors"
								onClick={(e) => {
									e.stopPropagation();
									handleToggleNewRepresentativePanel(customer.Id);
								}}
							>
								<UserPlus className="w-4 h-4 shrink-0 text-indigo-700" />
								<span>نماینده جدید</span>
							</Button>

							<Button
								variant="outline"
								className="h-10 justify-center gap-1.5 px-2 text-xs sm:text-sm border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white transition-colors"
								onClick={(e) => {
									e.stopPropagation();
									handleToggleExistingRepresentativePanel(customer.Id);
								}}
							>
								<UserPlus className="w-4 h-4 shrink-0 text-emerald-700" />
								<span>از مشتریان</span>
							</Button>

							<Button
								variant="outline"
								className="h-10 justify-center gap-1.5 px-2 text-xs sm:text-sm border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 bg-white transition-colors"
								onClick={(e) => {
									e.stopPropagation();
									handleOpenAddToGuild(customer.Id);
								}}
							>
								<Layers className="w-4 h-4 shrink-0" />
								<span>ثبت سامانه</span>
							</Button>

							<Button
								variant="outline"
								className="h-10 justify-center gap-1.5 px-2 text-xs sm:text-sm border-cyan-300 text-cyan-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 bg-white transition-colors"
								onClick={(e) => {
									e.stopPropagation();
									handleOpenEdit(customer.Id);
								}}
							>
								<Pencil className="w-4 h-4 shrink-0" />
								<span>ویرایش</span>
							</Button>

							<Button
								variant="outline"
								className="h-10 justify-center gap-1.5 px-2 text-xs sm:text-sm border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 bg-white transition-colors"
								onClick={(e) => {
									e.stopPropagation();
									handleOpenAddBankCard(customer.Id);
								}}
							>
								<Plus className="w-4 h-4 shrink-0" />
								<span>افزودن کارت</span>
							</Button>
						</div>
					</div>
				</div>

				{openNewRepPanelId === customer.Id && (
					<CustomerAddRepresentativeForm customer={customer} onClose={() => setOpenNewRepPanelId(null)} />
				)}

				{openExistingRepPanelId === customer.Id && (
					<CustomerAddRepresentativeByIdForm
						customer={customer}
						onClose={() => {
							setOpenExistingRepPanelId(null);
							reloadGrid();
						}}
					/>
				)}
			</CardTable>
		);
	};

	return (
		<PageCard>
			<HraderTitle
				title="مدیریت مشتریان"
				description="مشاهده، جستجو و انجام عملیات روی مشتریان"
				icon={<UsersRound />}
			/>

			<PageCardContent>
				<div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
					<Button
						className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center gap-2 px-5"
						onClick={handleOpenAdd}
					>
						<Plus className="w-5 h-5" />
						ثبت مشتری جدید
					</Button>

					<Button
						className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center gap-2 px-5"
						onClick={handleOpenAddWithRepresentative}
					>
						<UserPlus className="w-5 h-5" />
						ثبت مشتری و نماینده
					</Button>
				</div>

				<DataGrid<CustomerGetGridDto> ref={gridRef} fetchFunction={fetchData} layout="grid">
					<Column<CustomerGetGridDto>
						field="Id"
						filterable={false}
						header="ترتیب پیش فرض"
						render={(customer) => renderCustomerCard(customer)}
					/>

					<Column<CustomerGetGridDto> field="NationalCode" header="کد ملی" sortable render={() => null} />

					<Column<CustomerGetGridDto> field="PhoneNumber" header="شماره تماس" sortable render={() => null} />

					<Column<CustomerGetGridDto> field="FirstName" header="نام مشتری" sortable render={() => null} />

					<Column<CustomerGetGridDto>
						field="LastName"
						header="نام خانوادگی مشتری"
						sortable
						render={() => null}
					/>
				</DataGrid>
			</PageCardContent>

			<Popup
				show={isAddModalOpen}
				onClose={handleCloseAddModal}
				title="ثبت مشتری جدید"
				description="ایجاد و ثبت مشتری جدید"
				fullScreen
			>
				<CustomerAdd
					onClose={() => {
						handleCloseAddModal();
						reloadGrid();
					}}
				/>
			</Popup>

			<Popup
				show={isAddWithRepModalOpen}
				onClose={handleCloseAddWithRepModal}
				title="ثبت مشتری و نماینده"
				description="ثبت همزمان اطلاعات مشتری و نماینده مربوطه"
				fullScreen
			>
				<CustomerAddWithRepresentativeForm
					onSuccess={() => {
						handleCloseAddWithRepModal();
						reloadGrid();
					}}
					onCancel={handleCloseAddWithRepModal}
				/>
			</Popup>

			<Popup
				show={isEditModalOpen}
				onClose={handleCloseEditModal}
				title="ویرایش اطلاعات مشتری"
				description="بروزرسانی اطلاعات و مشخصات مشتری"
				fullScreen
			>
				{selectedCustomerId && (
					<CustomerEdit
						id={selectedCustomerId}
						onClose={handleCloseEditModal}
						onSuccess={() => {
							handleCloseEditModal();
							reloadGrid();
						}}
					/>
				)}
			</Popup>

			<Popup show={isDetailsModalOpen} onClose={handleCloseDetailsModal} title="جزئیات مشتری" fullScreen>
				{selectedDetailId && <CustomerDetails id={selectedDetailId} />}
			</Popup>

			<Popup
				show={isAddToGuildModalOpen}
				onClose={handleCloseAddToGuildModal}
				title="اختصاص سامانه به مشتری"
				description="اتصال و تخصیص سامانه‌های فعال به مشتری"
				fullScreen
			>
				{selectedCustomerForGuildId && (
					<GuildGroupAddCustomerForm
						customerId={selectedCustomerForGuildId}
						onClose={() => {
							handleCloseAddToGuildModal();
							reloadGrid();
						}}
					/>
				)}
			</Popup>

			<Popup
				show={isAddCardModalOpen}
				onClose={handleCloseAddBankCardModal}
				title="افزودن کارت بانکی"
				description="ثبت کارت بانکی جدید"
			>
				{selectedCustomerId && (
					<CustomerAddCardForm
						customerId={selectedCustomerId}
						onClose={() => {
							handleCloseAddBankCardModal();
							reloadGrid();
						}}
					/>
				)}
			</Popup>
		</PageCard>
	);
}

interface CustomerInfoBadgeProps {
	icon: React.ReactNode;
	value?: string | null;
	emptyText: string;
}

function CustomerInfoBadge({ icon, value, emptyText }: CustomerInfoBadgeProps) {
	const normalizedValue = value?.trim();

	return (
		<div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm w-fit max-w-full">
			{icon}

			<span
				className={`dir-ltr tracking-wider truncate ${normalizedValue ? "text-slate-700" : "text-slate-400"}`}
			>
				{normalizedValue || emptyText}
			</span>

			{normalizedValue && <CopyToClipboard textToCopy={normalizedValue} size={12} />}
		</div>
	);
}
