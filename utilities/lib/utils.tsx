import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatCardNumber = (cardNumber?: string | null) => {
	if (!cardNumber) return "";
	const clean = cardNumber.replace(/\D/g, "");
	const chunks = clean.match(/.{1,4}/g);
	if (!chunks) return "";
	return `\u200e${chunks.join(" - ")}`;
};
