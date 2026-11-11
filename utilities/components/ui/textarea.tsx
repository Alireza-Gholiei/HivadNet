import { cn } from "@/utilities/lib/utils";
import { forwardRef, type ReactNode, type TextareaHTMLAttributes, useId } from "react";
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

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: ReactNode;
	hint?: ReactNode;
	icon?: ReactNode;
	schema?: ZodTypeAny;
	disableRequiredMark?: boolean;
	requiredMark?: boolean;
	containerClassName?: string;
	labelClassName?: string;
	textareaClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
			labelClassName,
			textareaClassName,
			schema,
			disableRequiredMark,
			requiredMark,
			rows = 4,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const textareaId = id ?? generatedId;
		const hasError = Boolean(error);
		const shouldShowRequiredMark = requiredMark ?? (!disableRequiredMark && isRequiredBySchema(schema, name));

		return (
			<div className={cn("space-y-2", containerClassName, className)}>
				{(label || hint) && (
					<div className="flex items-center justify-between gap-3">
						{label && (
							<label
								htmlFor={textareaId}
								className={cn(
									"flex items-center gap-1 text-sm font-bold text-slate-700",
									labelClassName,
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
								"pointer-events-none absolute right-0 top-3 flex pr-4",
								hasError ? "text-rose-400" : "text-slate-400",
							)}
						>
							{icon}
						</div>
					)}

					<textarea
						id={textareaId}
						ref={ref}
						name={name}
						rows={rows}
						aria-invalid={hasError || undefined}
						aria-required={shouldShowRequiredMark || undefined}
						className={cn(
							"block w-full resize-y rounded-2xl border px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:ring-4",
							icon && "pr-11",
							hasError
								? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
								: "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10",
							textareaClassName,
						)}
						{...props}
					/>
				</div>

				{hasError && <p className="text-sm font-medium text-rose-500">{error}</p>}
			</div>
		);
	},
);

Textarea.displayName = "Textarea";
