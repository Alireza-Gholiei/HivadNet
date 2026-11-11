export function formatPrice(value?: number | null) {
	return `${Number(value || 0).toLocaleString("fa-IR")} تومان`;
}

export function formatNumber(value?: number | null) {
	return Number(value || 0).toLocaleString("fa-IR");
}

export function formatPercent(value?: number | null) {
	return `${Number(value || 0).toLocaleString("fa-IR", {
		maximumFractionDigits: 2,
	})}٪`;
}

export function formatCompactPrice(value?: number | null) {
	const amount = Number(value || 0);

	if (amount >= 1_000_000_000) {
		return `${(amount / 1_000_000_000).toLocaleString("fa-IR", {
			maximumFractionDigits: 1,
		})}B`;
	}

	if (amount >= 1_000_000) {
		return `${(amount / 1_000_000).toLocaleString("fa-IR", {
			maximumFractionDigits: 1,
		})}M`;
	}

	if (amount >= 1_000) {
		return `${(amount / 1_000).toLocaleString("fa-IR", {
			maximumFractionDigits: 1,
		})}K`;
	}

	return amount.toLocaleString("fa-IR");
}
