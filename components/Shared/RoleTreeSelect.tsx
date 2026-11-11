import { Check, ChevronDown, ChevronLeft, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { RoleGetChildDto } from "@/dataBinding/models/Role/RoleGetChildDto";
import { RoleService } from "@/dataBinding/services/Role/RoleService";
import { Button } from "@/utilities/components/ui/button";

interface RoleTreeSelectProps {
	value?: number;
	onChange: (value: number) => void;
	error?: string;
	placeholder?: string;
}

export const RoleTreeSelect: React.FC<RoleTreeSelectProps> = ({
	value,
	onChange,
	error,
	placeholder = "انتخاب نقش...",
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedRoleName, setSelectedRoleName] = useState<string>("");

	const [nodesByParent, setNodesByParent] = useState<Record<number, RoleGetChildDto[]>>({});
	const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
	const [loadingNodes, setLoadingNodes] = useState<Set<number>>(new Set());

	const dropdownRef = useRef<HTMLDivElement>(null);

	const fetchChildren = async (parentId: number) => {
		if (nodesByParent[parentId]) return;

		setLoadingNodes((prev) => new Set(prev).add(parentId));

		try {
			const mockData: RoleGetChildDto[] = await RoleService.GetChild(parentId);

			setNodesByParent((prev) => ({ ...prev, [parentId]: mockData }));
		} finally {
			setLoadingNodes((prev) => {
				const next = new Set(prev);
				next.delete(parentId);
				return next;
			});
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (isOpen && !nodesByParent[0]) {
			void fetchChildren(0);
		}
	}, [isOpen]);

	const handleToggleNode = async (e: React.MouseEvent, role: RoleGetChildDto) => {
		e.stopPropagation();

		const isExpanded = expandedNodes.has(role.Id);

		if (isExpanded) {
			setExpandedNodes((prev) => {
				const next = new Set(prev);
				next.delete(role.Id);
				return next;
			});
		} else {
			setExpandedNodes((prev) => new Set(prev).add(role.Id));
			await fetchChildren(role.Id);
		}
	};

	const handleSelectNode = (role: RoleGetChildDto) => {
		onChange(role.Id);
		setSelectedRoleName(role.Name);
		setIsOpen(false);
	};

	const renderTreeNodes = (parentId: number, level: number = 0) => {
		const nodes = nodesByParent[parentId];
		if (!nodes) return null;

		return (
			<ul className={`${level > 0 ? "pr-4 border-r border-gray-200 mr-2 mt-1" : "space-y-1"}`}>
				{nodes.map((role) => {
					const isExpanded = expandedNodes.has(role.Id);
					const isLoading = loadingNodes.has(role.Id);
					const isSelected = value === role.Id;

					const hasLoadedChildren = nodesByParent[role.Id] !== undefined;
					const childrenCount = hasLoadedChildren ? nodesByParent[role.Id].length : null;

					return (
						<li key={role.Id} className="mt-1">
							<div
								className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
									isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
								}`}
								onClick={() => handleSelectNode(role)}
							>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										type="button"
										onClick={(e) => void handleToggleNode(e, role)}
										className="p-1 rounded hover:bg-gray-200 text-gray-500"
										disabled={isLoading || childrenCount === 0}
									>
										{isLoading ? (
											<Loader2 className="w-4 h-4 animate-spin text-blue-500" />
										) : childrenCount === 0 ? (
											<div className="w-4 h-4" />
										) : isExpanded ? (
											<ChevronDown className="w-4 h-4" />
										) : (
											<ChevronLeft className="w-4 h-4" />
										)}
									</Button>
									<span className={`text-sm ${isSelected ? "font-medium" : ""}`}>{role.Name}</span>
								</div>
								{isSelected && <Check className="w-4 h-4 text-blue-600" />}
							</div>

							{isExpanded && renderTreeNodes(role.Id, level + 1)}
						</li>
					);
				})}
			</ul>
		);
	};

	return (
		<div className="relative w-full" ref={dropdownRef}>
			<div
				className={`w-full flex items-center justify-between px-3 py-2 border rounded-md cursor-pointer bg-white transition-all ${
					error ? "border-red-500" : "border-gray-300 hover:border-blue-400"
				} ${isOpen ? "ring-2 ring-blue-100 border-blue-400" : ""}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className={`text-sm ${selectedRoleName ? "text-gray-800" : "text-gray-400"}`}>
					{selectedRoleName || placeholder}
				</span>
				<ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
			</div>

			{error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}

			{isOpen && (
				<div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto p-2">
					{loadingNodes.has(0) ? (
						<div className="flex items-center justify-center p-4 text-gray-500 gap-2">
							<Loader2 className="w-5 h-5 animate-spin" />
							<span className="text-sm">در حال بارگذاری...</span>
						</div>
					) : (
						renderTreeNodes(0)
					)}
				</div>
			)}
		</div>
	);
};
