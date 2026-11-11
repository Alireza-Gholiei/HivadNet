"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CopyToClipboardProps = {
	textToCopy?: string | number | null;
	className?: string;
	tooltip?: string;
	copiedTooltip?: string;
	size?: number;
	copiedDuration?: number;
	stopPropagation?: boolean;
	disabled?: boolean;
	onCopied?: (value: string) => void;
	onError?: (error: unknown) => void;
};

export default function CopyToClipboard({
	textToCopy,
	className = "",
	tooltip = "کپی کردن",
	copiedTooltip = "کپی شد!",
	size = 16,
	copiedDuration = 4000,
	stopPropagation = true,
	disabled = false,
	onCopied,
	onError,
}: CopyToClipboardProps) {
	const [isCopied, setIsCopied] = useState(false);

	const normalizedText = useMemo(() => {
		if (textToCopy === null || textToCopy === undefined) return "";
		return String(textToCopy).trim();
	}, [textToCopy]);

	const isDisabled = disabled || !normalizedText;

	useEffect(() => {
		if (!isCopied) return;

		const timer = setTimeout(() => {
			setIsCopied(false);
		}, copiedDuration);

		return () => clearTimeout(timer);
	}, [isCopied, copiedDuration]);

	const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
		if (stopPropagation) {
			e.stopPropagation();
		}

		if (isDisabled) return;

		try {
			await navigator.clipboard.writeText(normalizedText);
			setIsCopied(true);
			onCopied?.(normalizedText);
		} catch (error) {
			console.error("خطا در کپی کردن متن:", error);
			onError?.(error);
		}
	};

	return (
		<button
			type="button"
			onClick={(e) => void handleCopy(e)}
			title={isCopied ? copiedTooltip : tooltip}
			disabled={isDisabled}
			aria-label={isCopied ? "محتوا کپی شد" : "کپی کردن محتوا"}
			className={[
				"inline-flex items-center justify-center rounded-md p-1 transition-colors duration-200",
				"focus:outline-none focus:ring-2 focus:ring-offset-2",
				isDisabled
					? "cursor-not-allowed text-slate-300"
					: isCopied
						? "text-green-600 bg-green-100 hover:bg-green-200 focus:ring-green-500"
						: "text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:ring-indigo-500",
				className,
			].join(" ")}
		>
			{isCopied ? <Check size={size} /> : <Copy size={size} />}
		</button>
	);
}
