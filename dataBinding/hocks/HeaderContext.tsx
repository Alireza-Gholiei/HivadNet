"use client";

import React, { createContext, useCallback,useContext, useState } from "react";

interface HeaderData {
	title: string;
	description?: string;
	icon?: React.ReactNode;
	showBackButton?: boolean;
	backButtonText?: string;
}

interface HeaderContextType {
	headerData: HeaderData;
	setHeaderData: (data: Partial<HeaderData>) => void;
	resetHeader: () => void;
}

const initialData: HeaderData = {
	title: "",
	description: undefined,
	icon: undefined,
	showBackButton: true,
	backButtonText: "بازگشت",
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
	const [headerData, setHeaderState] = useState<HeaderData>(initialData);

	const setHeaderData = useCallback((data: Partial<HeaderData>) => {
		setHeaderState((prev) => ({ ...prev, ...data }));
	}, []);

	const resetHeader = useCallback(() => {
		setHeaderState(initialData);
	}, []);

	return (
		<HeaderContext.Provider value={{ headerData, setHeaderData, resetHeader }}>{children}</HeaderContext.Provider>
	);
}

export const useHeader = () => {
	const context = useContext(HeaderContext);
	if (!context) {
		throw new Error("useHeader must be used within a HeaderProvider");
	}
	return context;
};
