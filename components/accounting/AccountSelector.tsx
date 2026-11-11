"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/utilities/components/ui/input";
import Popup from "@/utilities/components/popup";
import { AccountNode } from "./AccountNode";
import { AccountTreeDto } from "@/dataBinding/models/Accounting/Account/AccountTreeDto";
import { AccountService } from "@/dataBinding/services/Accounting/AccountService";

interface Props {
	valueId?: number;
	onChange: (account: AccountTreeDto | null) => void;
	required?: boolean;
}

export default function AccountSelector({ valueId, onChange }: Props) {
	const [open, setOpen] = useState(false);
	const [accounts, setAccounts] = useState<AccountTreeDto[]>([]);
	const [selected, setSelected] = useState<AccountTreeDto | null>(null);
	const [search, setSearch] = useState("");

	useEffect(() => {
		void loadTree();
	}, []);

	const loadTree = async () => {
		const result = await AccountService.GetAccountTree();

		if (result) {
			setAccounts(result);
		}
	};

	useEffect(() => {
		if (!valueId) {
			setSelected(null);
			return;
		}

		const findNode = (nodes: AccountTreeDto[], id: number): AccountTreeDto | null => {
			for (const node of nodes) {
				if (node.Id === id) return node;

				if (node.Children?.length) {
					const child = findNode(node.Children, id);

					if (child) return child;
				}
			}

			return null;
		};

		setSelected(findNode(accounts, valueId));
	}, [valueId, accounts]);

	const normalize = (value: string) => value.toLowerCase().replaceAll("ي", "ی").replaceAll("ك", "ک").trim();

	const filtered = useMemo(() => {
		if (!search.trim()) return accounts;

		const filterNodes = (nodes: AccountTreeDto[]): AccountTreeDto[] => {
			return nodes
				.map((node) => {
					const children = node.Children ? filterNodes(node.Children) : [];

					const term = normalize(search);

					const matched = normalize(node.Title).includes(term) || normalize(node.Code).includes(term);

					if (matched || children.length > 0) {
						return {
							...node,
							Children: children,
						};
					}

					return null;
				})
				.filter(Boolean) as AccountTreeDto[];
		};

		return filterNodes(accounts);
	}, [accounts, search]);
	const isSearching = search.trim().length > 0;
	return (
		<>
			<div onClick={() => setOpen(true)} className="flex h-12 cursor-pointer items-center rounded-xl border px-4">
				{selected ? (
					<div className="flex flex-col">
						<span className="font-medium">{selected.Code}</span>

						<span className="text-xs text-slate-500">{selected.Title}</span>
					</div>
				) : (
					<span className="text-slate-400">حساب مورد نظر را انتخاب کنید</span>
				)}
			</div>

			<Popup show={open} onClose={() => setOpen(false)} title="انتخاب حساب">
				<div className="space-y-4">
					<Input
						placeholder="جستجوی حساب..."
						icon={<Search size={18} />}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>

					<div className="max-h-125 overflow-auto">
						{filtered.map((item) => (
							<AccountNode
								key={item.Id}
								node={item}
								forceExpanded={isSearching}
								onSelect={(account) => {
									setSelected(account);
									onChange(account);
									setOpen(false);
								}}
							/>
						))}
					</div>
				</div>
			</Popup>
		</>
	);
}
