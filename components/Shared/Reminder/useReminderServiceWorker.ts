"use client";

import { useCallback, useEffect, useState } from "react";

export function useReminderServiceWorker() {
	const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
	const [isSupported, setIsSupported] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const supported = "serviceWorker" in navigator && "Notification" in window;
		setIsSupported(supported);

		if (!supported) return;

		navigator.serviceWorker
			.register("/reminder-sw.js")
			.then((reg) => {
				setRegistration(reg);
			})
			.catch((error) => {
				console.error("Reminder service worker registration failed:", error);
			});
	}, []);

	const requestPermission = useCallback(async () => {
		if (typeof window === "undefined") return false;

		if (!("Notification" in window)) return false;

		try {
			if (Notification.permission === "granted") return true;

			if (Notification.permission === "default") {
				const permission = await Notification.requestPermission();
				return permission === "granted";
			}

			return false;
		} catch (error) {
			console.error("Reminder notification permission error:", error);
			return false;
		}
	}, []);

	const showNotification = useCallback(
		async (title: string, options?: NotificationOptions) => {
			if (typeof window === "undefined") return false;

			if (!isSupported) return false;

			if (Notification.permission !== "granted") return false;

			try {
				const reg = registration ?? (await navigator.serviceWorker.ready);

				await reg.showNotification(title, {
					icon: "/favicon.ico",
					badge: "/favicon.ico",
					requireInteraction: true,
					...options,
				});

				return true;
			} catch (error) {
				console.error("Reminder show notification error:", error);
				return false;
			}
		},
		[registration, isSupported],
	);

	return {
		isSupported,
		registration,
		requestPermission,
		showNotification,
	};
}
