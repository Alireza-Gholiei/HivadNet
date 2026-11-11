import { cn } from "@/utilities/lib/utils";
import { Check } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from "react";
import { z, type ZodTypeAny } from "zod";

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

		if (current instanceof z.ZodObject) {
			const shape = current.shape;
			current = shape[part];

			if (!current) return null;

			continue;
		}

		if (current instanceof z.ZodArray) {
			current = unwrapSchema(current.element as any);
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

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	label?: ReactNode;
	description?: ReactNode;
	error?: ReactNode;
	schema?: ZodTypeAny;
	disableRequiredMark?: boolean;
	requiredMark?: boolean;
	containerClassName?: string;
	labelClassName?: string;
	descriptionClassName?: string;
	checkboxClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	(
		{
			label,
			description,
			error,
			id,
			name,
			className,
			containerClassName,
			labelClassName,
			descriptionClassName,
			checkboxClassName,
			schema,
			disableRequiredMark,
			requiredMark,
			disabled,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const checkboxId = id ?? generatedId;
		const hasError = Boolean(error);
		const shouldShowRequiredMark = requiredMark ?? (!disableRequiredMark && isRequiredBySchema(schema, name));

		return (
			<div className={cn("space-y-2", containerClassName, className)}>
				<label
					htmlFor={checkboxId}
					className={cn("group flex items-start gap-3", disabled ? "cursor-not-allowed" : "cursor-pointer")}
				>
					<span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
						<input
							id={checkboxId}
							ref={ref}
							name={name}
							type="checkbox"
							disabled={disabled}
							aria-invalid={hasError || undefined}
							aria-required={shouldShowRequiredMark || undefined}
							className="peer sr-only"
							{...props}
						/>

						<span
							className={cn(
								"flex h-5 w-5 items-center justify-center rounded-md border bg-white shadow-sm transition-all",
								"peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-500/10",
								"peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:[&>svg]:opacity-100",
								disabled && "bg-slate-100 opacity-60",
								hasError
									? "border-rose-300 peer-focus-visible:border-rose-500 peer-focus-visible:ring-rose-500/10"
									: "border-slate-300 peer-focus-visible:border-indigo-500",
								checkboxClassName,
							)}
						>
							<Check className="h-3.5 w-3.5 text-white opacity-0 transition" />
						</span>
					</span>

					{(label || description) && (
						<span className="min-w-0 flex-1">
							{label && (
								<span
									className={cn(
										"inline-flex items-center gap-1 text-sm font-bold text-slate-700",
										disabled && "text-slate-400",
										labelClassName,
									)}
								>
									<span>{label}</span>

									{shouldShowRequiredMark && <span className="text-rose-500">*</span>}
								</span>
							)}

							{description && (
								<span
									className={cn(
										"mt-1 block text-xs font-medium text-slate-400",
										descriptionClassName,
									)}
								>
									{description}
								</span>
							)}
						</span>
					)}
				</label>

				{hasError && <p className="text-sm font-medium text-rose-500">{error}</p>}
			</div>
		);
	},
);

Checkbox.displayName = "Checkbox";
