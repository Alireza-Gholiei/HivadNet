"use client";

import { ArchiveFolderTreeDto } from "@/dataBinding/models/Archive/ArchiveFolder/ArchiveFolderTreeDto";
import { ArchiveFolderService } from "@/dataBinding/services/Archive/ArchiveFolderService";
import React, { useEffect, useState } from "react";

interface FolderTreeSelectorProps {
	selectedFolderId: number | null;
	onSelect: (folderId: number | null) => void;
	disabledFolderId?: number;
}

export const FolderTreeSelector: React.FC<FolderTreeSelectorProps> = ({
	selectedFolderId,
	onSelect,
	disabledFolderId,
}) => {
	const [treeData, setTreeData] = useState<ArchiveFolderTreeDto[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchTree = async () => {
			try {
				const data = await ArchiveFolderService.GetTree();
				setTreeData(data);
			} catch (error) {
				console.error("Error fetching folder tree:", error);
			} finally {
				setIsLoading(false);
			}
		};
		void fetchTree();
	}, []);

	const renderTree = (parentId: number | null) => {
		const childNodes = treeData.filter((node) => node.ParentFolderId === parentId);

		if (childNodes.length === 0) return null;

		return (
			<ul className="pr-4 border-r border-gray-200 mt-1">
				{childNodes.map((node) => {
					const isDisabled = node.Id === disabledFolderId;
					const isSelected = node.Id === selectedFolderId;

					return (
						<li key={node.Id} className="mt-1">
							<div
								className={`flex items-center px-2 py-1 rounded cursor-pointer text-sm transition-colors ${
									isDisabled
										? "opacity-50 cursor-not-allowed bg-gray-100"
										: isSelected
											? "bg-blue-100 text-blue-700 font-medium"
											: "hover:bg-gray-100"
								}`}
								onClick={() => !isDisabled && onSelect(node.Id)}
							>
								<span className="ml-2 text-gray-400 shrink-0">📁</span>
								<span className="truncate">{node.Name}</span>
							</div>

							{renderTree(node.Id)}
						</li>
					);
				})}
			</ul>
		);
	};

	if (isLoading) return <div className="text-sm text-gray-500">در حال بارگذاری پوشه‌ها...</div>;

	return (
		<div className="border border-gray-200 rounded-md p-2 max-h-60 overflow-y-auto bg-white">
			<div
				className={`flex items-center px-2 py-1 rounded cursor-pointer text-sm transition-colors hover:bg-gray-100 ${
					selectedFolderId === null ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-100"
				}`}
				onClick={() => onSelect(null)}
			>
				<span className="ml-2 text-gray-400 shrink-0">📁</span>
				<span className="truncate">پوشه اصلی (ریشه)</span>
			</div>
			{renderTree(null)}
		</div>
	);
};
