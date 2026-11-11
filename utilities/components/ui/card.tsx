import * as React from "react";

function joinClasses(...classes: Array<string | undefined | null | false>) {
	return classes.filter(Boolean).join(" ");
}

const CardTable = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={joinClasses(
				"rounded-xl border border-slate-100 bg-white text-slate-800 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-200",
				className,
			)}
			{...props}
		/>
	),
);
CardTable.displayName = "CardTable";

const PageCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={joinClasses(
				"rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden m-1",
				className,
			)}
			{...props}
		/>
	),
);
PageCard.displayName = "PageCard";

const PageCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={joinClasses(
				"flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-100",
				className,
			)}
			{...props}
		/>
	),
);
PageCardHeader.displayName = "PageCardHeader";

const PageCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => (
		<h3
			ref={ref}
			className={joinClasses("text-lg sm:text-xl font-bold leading-none text-slate-800", className)}
			{...props}
		/>
	),
);
PageCardTitle.displayName = "PageCardTitle";

const PageCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
	({ className, ...props }, ref) => (
		<p ref={ref} className={joinClasses("text-sm text-slate-500 mt-2", className)} {...props} />
	),
);
PageCardDescription.displayName = "PageCardDescription";

const PageCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={joinClasses("p-6", className)} {...props} />,
);
PageCardContent.displayName = "PageCardContent";

const PageCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={joinClasses("flex items-center justify-end gap-3 p-6 pt-0 mt-2", className)}
			{...props}
		/>
	),
);
PageCardFooter.displayName = "PageCardFooter";

export { CardTable, PageCard, PageCardContent, PageCardDescription, PageCardFooter,PageCardHeader, PageCardTitle };
