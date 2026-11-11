import * as React from "react";

import { cn } from "@/utilities/lib/utils";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "submit";

type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

const baseClasses =
	"inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variantClasses: Record<ButtonVariant, string> = {
	default: "bg-slate-800 text-white shadow-md hover:bg-slate-700 hover:shadow-lg",
	submit: "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg focus-visible:ring-blue-500 w-full",
	destructive: "bg-red-500 text-white shadow-md hover:bg-red-600 hover:shadow-lg",
	outline: "border-2 border-slate-200 bg-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-50",
	secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
	ghost: "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
	link: "text-slate-600 underline-offset-4 hover:underline hover:text-slate-900",
};

const sizeClasses: Record<ButtonSize, string> = {
	default: "h-11 px-5 py-2",
	sm: "h-9 rounded-lg px-4 text-xs",
	lg: "h-14 rounded-2xl px-8 text-base",
	icon: "h-11 w-11",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "default", size = "default", type = "button", ...props }, ref) => {
		return (
			<button
				ref={ref}
				type={type}
				className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";

export { Button };
