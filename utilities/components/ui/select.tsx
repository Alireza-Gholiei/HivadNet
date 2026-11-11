"use client";

import { cn } from "@/utilities/lib/utils";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { forwardRef, ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import { z, ZodTypeAny } from "zod";

export type SelectOptionValue = string | number;

export type SelectOption<TValue extends SelectOptionValue = SelectOptionValue> = {
	label: string;
	value: TValue;
	disabled?: boolean;
	description?: string;
};

type SelectProps<TValue extends SelectOptionValue = SelectOptionValue> = {
	name?: string;
	id?: string;
	label?: string;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyText?: string;
	options: SelectOption<TValue>[];
	value?: TValue | null;
	defaultValue?: TValue | null;
	onValueChange?: (value: TValue | null, option?: SelectOption<TValue>) => void;
	onBlur?: () => void;
	error?: string;
	schema?: ZodTypeAny;
	requiredMark?: boolean;
	disabled?: boolean;
	clearable?: boolean;
	searchable?: boolean;
	icon?: ReactNode;
	containerClassName?: string;
	labelClassName?: string;
	triggerClassName?: string;
	dropdownClassName?: string;
	optionClassName?: string;
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

type SelectComponent = <TValue extends SelectOptionValue = SelectOptionValue>(
	props: SelectProps<TValue> & React.RefAttributes<HTMLButtonElement>,
) => React.ReactElement | null;

const SelectBase = <TValue extends SelectOptionValue = SelectOptionValue>(
	props: SelectProps<TValue>,
	ref: React.ForwardedRef<HTMLButtonElement>,
) => {
	const {
		name,
		id,
		label,
		placeholder = "انتخاب کنید",
		searchPlaceholder = "جستجو...",
		emptyText = "موردی یافت نشد",
		options,
		value,
		defaultValue = null,
		onValueChange,
		onBlur,
		error,
		schema,
		requiredMark,
		disabled = false,
		clearable = false,
		searchable = true,
		icon,
		containerClassName,
		labelClassName,
		triggerClassName,
		dropdownClassName,
		optionClassName,
	} = props;

	const generatedId = useId();
	const selectId = id ?? generatedId;
	const wrapperRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const [internalValue, setInternalValue] = useState<TValue | null>(defaultValue);
	const selectedValue = value !== undefined ? value : internalValue;

	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);

	const selectedOption = useMemo(
		() => options.find((option) => option.value === selectedValue),
		[options, selectedValue],
	);

	const filteredOptions = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();

		if (!normalizedSearch) return options;

		return options.filter((option) => {
			const label = option.label.toLowerCase();
			const valueText = String(option.value).toLowerCase();
			const description = option.description?.toLowerCase() ?? "";

			return (
				label.includes(normalizedSearch) ||
				valueText.includes(normalizedSearch) ||
				description.includes(normalizedSearch)
			);
		});
	}, [options, searchTerm]);

	const shouldShowRequiredMark = requiredMark ?? isRequiredBySchema(schema, name);

	useEffect(() => {
		if (!isOpen) return;

		const timeoutId = window.setTimeout(() => {
			searchInputRef.current?.focus();
		}, 0);

		return () => window.clearTimeout(timeoutId);
	}, [isOpen]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!wrapperRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
				onBlur?.();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onBlur]);

	useEffect(() => {
		setActiveIndex(0);
	}, [searchTerm]);

	const updateValue = (nextValue: TValue | null, option?: SelectOption<TValue>) => {
		if (value === undefined) {
			setInternalValue(nextValue);
		}

		onValueChange?.(nextValue, option);
	};

	const handleSelect = (option: SelectOption<TValue>) => {
		if (option.disabled) return;

		updateValue(option.value, option);
		setIsOpen(false);
		setSearchTerm("");
		onBlur?.();
	};

	const handleClear = () => {
		updateValue(null);
		setSearchTerm("");
		onBlur?.();
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		if (disabled) return;

		if (event.key === "ArrowDown") {
			event.preventDefault();

			if (!isOpen) {
				setIsOpen(true);
				return;
			}

			setActiveIndex((current) => Math.min(current + 1, filteredOptions.length - 1));
		}

		if (event.key === "ArrowUp") {
			event.preventDefault();
			setActiveIndex((current) => Math.max(current - 1, 0));
		}

		if (event.key === "Enter") {
			event.preventDefault();

			if (!isOpen) {
				setIsOpen(true);
				return;
			}

			const activeOption = filteredOptions[activeIndex];

			if (activeOption) {
				handleSelect(activeOption);
			}
		}

		if (event.key === "Escape") {
			setIsOpen(false);
			onBlur?.();
		}
	};

	return (
		<div ref={wrapperRef} className={cn("relative w-full", containerClassName)}>
			{label && (
				<label
					htmlFor={selectId}
					className={cn("mb-2 block text-sm font-semibold text-slate-700", labelClassName)}
				>
					{label}
					{shouldShowRequiredMark && <span className="mr-1 text-rose-500">*</span>}
				</label>
			)}

			<button
				ref={ref}
				id={selectId}
				type="button"
				disabled={disabled}
				onClick={() => !disabled && setIsOpen((current) => !current)}
				onKeyDown={handleKeyDown}
				onBlur={onBlur}
				className={cn(
					"flex w-full items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition",
					"focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50",
					disabled && "cursor-not-allowed bg-slate-100 text-slate-400",
					error ? "border-rose-400 focus:border-rose-400 focus:ring-rose-50" : "border-slate-200",
					triggerClassName,
				)}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
			>
				{icon && <span className="shrink-0 text-slate-400">{icon}</span>}

				<span className={cn("flex-1 truncate text-right", !selectedOption && "text-slate-400")}>
					{selectedOption?.label ?? placeholder}
				</span>

				{clearable && selectedOption && !disabled && (
					<span
						role="button"
						tabIndex={-1}
						onClick={(event) => {
							event.stopPropagation();
							handleClear();
						}}
						className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-rose-500"
					>
						<X size={16} />
					</span>
				)}

				<ChevronDown size={18} className={cn("shrink-0 text-slate-400 transition", isOpen && "rotate-180")} />
			</button>

			{name && <input type="hidden" name={name} value={selectedValue ?? ""} readOnly />}

			{isOpen && (
				<div
					className={cn(
						"absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl",
						dropdownClassName,
					)}
				>
					{searchable && (
						<div className="border-b border-slate-100 p-2">
							<div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
								<Search size={16} className="text-slate-400" />
								<input
									ref={searchInputRef}
									type="text"
									value={searchTerm}
									onChange={(event) => setSearchTerm(event.target.value)}
									placeholder={searchPlaceholder}
									className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
								/>
							</div>
						</div>
					)}

					<div role="listbox" aria-label="انتخاب گزینه" className="max-h-64 overflow-y-auto p-1">
						{filteredOptions.length === 0 && (
							<div className="px-3 py-6 text-center text-sm text-slate-400">{emptyText}</div>
						)}

						{filteredOptions.map((option, index) => {
							const isSelected = option.value === selectedValue;
							const isActive = index === activeIndex;

							return (
								<button
									key={String(option.value)}
									type="button"
									role="option"
									aria-selected={isSelected}
									disabled={option.disabled}
									onMouseEnter={() => setActiveIndex(index)}
									onClick={() => handleSelect(option)}
									className={cn(
										"flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-sm transition",
										isSelected && "bg-indigo-50 text-indigo-700",
										isActive && !isSelected && "bg-slate-50",
										option.disabled && "cursor-not-allowed opacity-50",
										optionClassName,
									)}
								>
									<span className="flex-1">
										<span className="block font-medium">{option.label}</span>
										{option.description && (
											<span className="mt-0.5 block text-xs text-slate-400">
												{option.description}
											</span>
										)}
									</span>

									{isSelected && <Check size={16} className="text-indigo-600" />}
								</button>
							);
						})}
					</div>
				</div>
			)}

			{error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
		</div>
	);
};

const ForwardedSelect = forwardRef(SelectBase);

ForwardedSelect.displayName = "Select";

export const Select = ForwardedSelect as SelectComponent;
