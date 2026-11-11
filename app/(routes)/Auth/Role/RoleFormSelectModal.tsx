import { CheckSquare, ChevronDown, ChevronLeft, Loader2, Square } from "lucide-react";
import { useEffect, useState } from "react";

import { FormGetChildDto, FormType } from "@/dataBinding/models/Form/FormGetChildDto";
import { FormService } from "@/dataBinding/services/Form/FormService";
import { Button } from "@/utilities/components/ui/button";
import { Messenger } from "@/utilities/Messenger";

interface RoleFormSelectModalProps {
	isOpen: boolean;
	initialSelected: number[];
	onClose: () => void;
	onSubmit: (selectedIds: number[]) => void;
}

export default function RoleFormSelectModal({ isOpen, initialSelected, onClose, onSubmit }: RoleFormSelectModalProps) {
	const [selectedIds, setSelectedIds] = useState<number[]>(initialSelected);
	const [nodesByParent, setNodesByParent] = useState<Record<number, FormGetChildDto[]>>({});
	const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
	const [loadingNodes, setLoadingNodes] = useState<Set<number>>(new Set());

	const fetchForms = async (parentId: number = 0) => {
		if (nodesByParent[parentId]) return;
		setLoadingNodes((prev) => new Set(prev).add(parentId));

		try {
			const data = await FormService.GetChild(parentId);

			setNodesByParent((prev) => ({ ...prev, [parentId]: data }));
		} finally {
			setLoadingNodes((prev) => {
				const next = new Set(prev);
				next.delete(parentId);
				return next;
			});
		}
	};

	useEffect(() => {
		if (isOpen && !nodesByParent[0]) void fetchForms(0);
		if (isOpen) setSelectedIds(initialSelected);
	}, [isOpen]);

	const handleToggleExpand = async (form: FormGetChildDto) => {
		const isExpanded = expandedNodes.has(form.Id);
		if (isExpanded) {
			setExpandedNodes((prev) => {
				const next = new Set(prev);
				next.delete(form.Id);
				return next;
			});
		} else {
			setExpandedNodes((prev) => new Set(prev).add(form.Id));
			await fetchForms(form.Id);
		}
	};

	const handleToggleSelect = (form: FormGetChildDto) => {
		if (form.FormType === FormType.Menu) {
			Messenger.errorMessage("امکان انتخاب منوها وجود ندارد، لطفا صفحات را انتخاب کنید");
			return;
		}

		setSelectedIds((prev) => (prev.includes(form.Id) ? prev.filter((id) => id !== form.Id) : [...prev, form.Id]));
	};

	const renderTree = (parentId: number = 0, level: number = 0) => {
		const nodes = nodesByParent[parentId];
		if (!nodes) return null;

		return (
			<ul className={level > 0 ? "pr-6 border-r border-gray-200 mr-2" : ""}>
				{nodes.map((form) => {
					const isExpanded = expandedNodes.has(form.Id);
					const isSelected = selectedIds.includes(form.Id);
					const isLoading = loadingNodes.has(form.Id);

					return (
						<li key={form.Id} className="mt-2">
							<div className="flex items-center gap-2 p-2 border rounded-md border-r-4 border-r-green-500 bg-white shadow-sm">
								<button
									type="button"
									onClick={() => void handleToggleExpand(form)}
									className="p-1 text-gray-500 hover:bg-gray-100 rounded"
								>
									{isLoading ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : isExpanded ? (
										<ChevronDown className="w-4 h-4" />
									) : (
										<ChevronLeft className="w-4 h-4" />
									)}
								</button>
								<button
									type="button"
									onClick={() => handleToggleSelect(form)}
									className="text-gray-600"
								>
									{isSelected ? (
										<CheckSquare className="w-5 h-5 text-blue-600" />
									) : (
										<Square className="w-5 h-5" />
									)}
								</button>
								<span
									className="text-sm cursor-pointer select-none"
									onClick={() => handleToggleSelect(form)}
								>
									{form.Name} -{" "}
									{form.FormType === FormType.Menu
										? "منو"
										: form.FormType === FormType.Page
											? "صفحه"
											: "عملیات"}
								</span>
							</div>
							{isExpanded && renderTree(form.Id, level + 1)}
						</li>
					);
				})}
			</ul>
		);
	};

	if (!isOpen) return null;

	return (
		<div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
			<div className="p-4 max-h-96 overflow-y-auto">
				{loadingNodes.has(0) ? (
					<Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
				) : (
					renderTree(0)
				)}
			</div>
			<div className="p-4 border-t flex justify-center gap-3 bg-gray-50">
				<Button type="button" onClick={() => onSubmit(selectedIds)} variant="submit">
					ثبت
				</Button>
				<Button type="button" onClick={() => onSubmit([])} variant="destructive">
					پاک کردن همه
				</Button>
				<Button type="button" onClick={onClose} variant="secondary">
					انصراف / خروج
				</Button>
			</div>
		</div>
	);
}
