"use client";

import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";

interface PopupProps {
	show: boolean;
	onClose: () => void;
	title?: string;
	description?: string;
	children?: React.ReactNode;
	fullScreen?: boolean;
}

export default function Popup({ show, onClose, title, description, children, fullScreen = false }: PopupProps) {
	const [bottomOffset, setBottomOffset] = useState(0);
	const [isDesktop, setIsDesktop] = useState(false);
	const [mounted, setMounted] = useState(false);

	const y = useMotionValue(0);
	const backdropOpacity = useTransform(y, [0, 300], [0.8, 0]);

	useEffect(() => {
		setMounted(true);
		const handleResize = () => setIsDesktop(window.innerWidth >= 580);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (show) {
			const navbar = document.getElementById("bottom-navbar");
			if (navbar) setBottomOffset(navbar.offsetHeight);
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [show]);

	if (!mounted) return null;

	return createPortal(
		<AnimatePresence>
			{show && (
				<>
					<motion.div
						className="fixed inset-0 bg-black backdrop-blur-sm z-240"
						style={{ opacity: backdropOpacity }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.8 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					<motion.div
						drag={!isDesktop ? "y" : false}
						dragConstraints={{ top: 0, bottom: 0 }}
						dragElastic={{ top: 0, bottom: 0.8 }}
						style={{
							y,
							bottom: !isDesktop ? `${bottomOffset}px` : undefined,
							paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
							maxWidth: isDesktop ? (fullScreen ? "95vw" : "500px") : "100%",
							maxHeight: fullScreen ? "95vh" : isDesktop ? "85vh" : "90vh",
							height: fullScreen ? "95vh" : undefined,
						}}
						onDragEnd={(_, info) => {
							if (info.offset.y > 100) onClose();
						}}
						initial={isDesktop ? { x: "-50%", y: "-45%", opacity: 0, scale: 0.95 } : { y: "100%" }}
						animate={isDesktop ? { x: "-50%", y: "-50%", opacity: 1, scale: 1 } : { y: 0 }}
						exit={isDesktop ? { x: "-50%", y: "-45%", opacity: 0, scale: 0.95 } : { y: "100%" }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className={`flex flex-col fixed z-250 bg-white dark:bg-zinc-900 p-5 shadow-2xl overflow-hidden
    						${isDesktop ? "left-1/2 top-1/2 rounded-2xl w-full" : "left-0 right-0 w-full rounded-t-2xl"}`}
					>
						<div className="relative pb-4 mb-4 border-b border-slate-100 dark:border-zinc-800 select-none flex flex-col items-center">
							{!isDesktop && (
								<div className="w-12 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full mb-3" />
							)}

							{(title || description) && (
								<div className="flex flex-col items-center px-10 text-center w-full">
									{title && (
										<h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">{title}</h3>
									)}
									{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
								</div>
							)}

							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={(e) => {
									e.preventDefault();
									void onClose();
								}}
								className="absolute top-0 right-0 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-all duration-200 focus:outline-none"
							>
								<X className="w-5 h-5" />
							</Button>
						</div>

						<div className="flex-1 overflow-y-auto text-slate-700 dark:text-zinc-300 pr-1">{children}</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>,
		document.body,
	);
}
