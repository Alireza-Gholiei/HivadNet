import { cn } from "@/utilities/lib/utils";
import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from "react";
import { z, ZodTypeAny } from "zod";

const formatNumberWithCommas = (value: string | number) => {
	const rawValue = String(value ?? "")
		.replace(/,/g, "")
		.replace(/[^\d]/g, "");
	if (!rawValue) return "";
	return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseCurrencyValue = (value: string) => {
	return value.replace(/,/g, "").replace(/[^\d]/g, "");
};

const unwrapSchema = (schema: ZodTypeAny): ZodTypeAny => {
	let current: any = schema;

	while (current instanceof z.ZodOptional || current instanceof z.ZodNullable || current instanceof z.ZodDefault) {
		current = current._def.innerType;
	}

	return current;
};

const getSchemaField = (schema: ZodTypeAny, path?: string): ZodTypeAny | null => {
	if (!path) return null;

	const parts = path
		.split(".")
		.filter(Boolean)
		.filter((part) => Number.isNaN(Number(part)));

	let current: ZodTypeAny = unwrapSchema(schema);

	for (const part of parts) {
		current = unwrapSchema(current);

		while (current instanceof z.ZodArray) {
			current = unwrapSchema((current as z.ZodArray<any>).element);
		}

		if (current instanceof z.ZodObject) {
			const shape = current.shape;
			current = shape[part];

			if (!current) return null;
			continue;
		}

		return null;
	}

	return current;
};

const isRequiredBySchema = (schema?: ZodTypeAny, name?: string) => {
	if (!schema || !name) return false;

	const fieldSchema = getSchemaField(schema, name);

	if (!fieldSchema) return false;

	const unwrapped = unwrapSchema(fieldSchema);

	return !(fieldSchema instanceof z.ZodOptional) && !(fieldSchema instanceof z.ZodNullable) && !!unwrapped;
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: ReactNode;
	hint?: ReactNode;
	icon?: ReactNode;
	schema?: z.ZodObject<z.ZodRawShape>;
	requiredMark?: boolean;
	containerClassName?: string;
	inputClassName?: string;
	isCurrency?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			error,
			hint,
			icon,
			id,
			name,
			className,
			containerClassName,
			inputClassName,
			schema,
			requiredMark,
			disabled,
			isCurrency,
			value,
			onChange,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const inputId = id ?? generatedId;
		const hasError = Boolean(error);
		const shouldShowRequiredMark = requiredMark ?? isRequiredBySchema(schema, name);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (!onChange) return;

			if (isCurrency) {
				const rawValue = parseCurrencyValue(e.target.value);
				e.target.value = rawValue;
			}
			onChange(e);
		};

		const displayValue =
			isCurrency && value !== undefined && value !== null
				? formatNumberWithCommas(value as string | number)
				: value;

		return (
			<div className={cn("space-y-2", containerClassName, className)}>
				{(label || hint) && (
					<div className="flex items-center justify-between gap-3">
						{label && (
							<label
								htmlFor={inputId}
								className={cn(
									"flex items-center gap-1 text-sm font-bold text-slate-700",
									disabled && "text-slate-400",
								)}
							>
								<span>{label}</span>
								{shouldShowRequiredMark && <span className="text-rose-500">*</span>}
							</label>
						)}
						{hint && <span className="text-xs font-medium text-slate-400">{hint}</span>}
					</div>
				)}

				<div className="relative">
					{icon && (
						<div
							className={cn(
								"pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4",
								hasError ? "text-rose-400" : "text-slate-400",
								disabled && "opacity-50",
							)}
						>
							{icon}
						</div>
					)}

					<input
						id={inputId}
						ref={ref}
						name={name}
						disabled={disabled}
						aria-invalid={hasError || undefined}
						aria-required={shouldShowRequiredMark || undefined}
						value={displayValue}
						onChange={handleChange}
						className={cn(
							"block w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4",
							!disabled && "hover:border-slate-300",
							icon && "pr-11",
							hasError
								? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
								: "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10",
							disabled && "bg-slate-100/80 text-slate-400 border-slate-200 cursor-not-allowed opacity-70",
							inputClassName,
						)}
						{...props}
					/>
				</div>

				{hasError && <p className="text-sm font-medium text-rose-500">{error}</p>}
			</div>
		);
	},
);

Input.displayName = "Input";
