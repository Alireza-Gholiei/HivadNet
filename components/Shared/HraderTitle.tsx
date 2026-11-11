"use client";

import { useEffect } from "react";

import { useHeader } from "@/dataBinding/hocks/HeaderContext";

interface HraderTitleProps {
	title: string;
	description?: string;
	icon?: React.ReactNode;
	showBackButton?: boolean;
	backButtonText?: string;
}

export default function HraderTitle(props: HraderTitleProps) {
	const { setHeaderData, resetHeader } = useHeader();

	useEffect(() => {
		setHeaderData(props);

		return () => resetHeader();
	}, [setHeaderData, resetHeader, props]);

	return null;
}
