"use client";

import { AccountTreeDto } from "@/dataBinding/models/Accounting/Account/AccountTreeDto";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useState } from "react";

interface Props {
	node: AccountTreeDto;
	onSelect: (account: AccountTreeDto) => void;
	forceExpanded?: boolean;
}

export function AccountNode({ node, onSelect, forceExpanded }: Props) {
	const [expanded, setExpanded] = useState(false);

	const isExpanded = forceExpanded || expanded;

	return (
		<div>
			<div
				className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-100"
				style={{
					paddingRight: `${node.Level * 20}px`,
				}}
			>
				{node.Children?.length ? (
					<button type="button" onClick={() => setExpanded(!expanded)}>
						{expanded ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}
					</button>
				) : (
					<div className="w-4" />
				)}

				<button
					type="button"
					className={`flex-1 text-right rounded-md px-2 py-1 transition ${
						node.IsSelectable ? "cursor-pointer hover:bg-slate-100" : "cursor-not-allowed opacity-50"
					}`}
					disabled={!node.IsSelectable}
					onClick={() => {
						if (!node.IsSelectable) return;

						onSelect(node);
					}}
				>
					<div className="flex flex-col">
						<span>
							{node.Code} - {node.Title}
						</span>

						<span className="text-xs text-slate-400">{node.Level}</span>
					</div>
				</button>
			</div>

			{isExpanded &&
				node.Children?.map((child) => (
					<AccountNode key={child.Id} node={child} onSelect={onSelect} forceExpanded={forceExpanded} />
				))}
		</div>
	);
}
