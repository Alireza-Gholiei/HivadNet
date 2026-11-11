"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ReminderAddDto } from "@/dataBinding/models/Reminder/ReminderAddDto";
import { ReminderGetByUserDto } from "@/dataBinding/models/Reminder/ReminderGetByUserDto";
import { ReminderTypeDto } from "@/dataBinding/models/Reminder/ReminderTypeDto";
import { ReminderService } from "@/dataBinding/services/Reminder/ReminderService";
import { Messenger } from "@/utilities/Messenger";

type ReminderWidgetView = "list" | "add";

export function useReminderWidget() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [view, setView] = useState<ReminderWidgetView>("list");

	const [reminders, setReminders] = useState<ReminderGetByUserDto[]>([]);
	const [reminderTypes, setReminderTypes] = useState<ReminderTypeDto[]>([]);

	const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
	const [listError, setListError] = useState<string | null>(null);
	const [completingId, setCompletingId] = useState<number | null>(null);

	const widgetRef = useRef<HTMLDivElement>(null);

	const fetchReminders = useCallback(async () => {
		setIsLoadingList(true);
		setListError(null);

		try {
			const result = await ReminderService.GetByUser();
			if (result) {
				setReminders(result);
			}
		} catch {
			Messenger.errorMessage("خطا در دریافت لیست یادآورها.");
			setListError("خطا در دریافت لیست یادآورها.");
		} finally {
			setIsLoadingList(false);
		}
	}, []);

	const fetchTypes = useCallback(async () => {
		try {
			const result = await ReminderService.Types();
			if (result) {
				setReminderTypes(result);
			}
		} catch (error) {
			console.error(error);
		}
	}, []);

	const openWidget = () => {
		setIsOpen(true);
	};

	const closeWidget = () => {
		setIsOpen(false);
	};

	const toggleWidget = () => {
		setIsOpen((prev) => !prev);
	};

	const goToList = () => {
		setView("list");
	};

	const goToAdd = () => {
		setView("add");
	};

	const addReminder = async (data: ReminderAddDto) => {
		const payload = { ...data };

		if (payload.Type === 1) {
			payload.EndTime = null;
		}

		const result = await ReminderService.ReminderAdd(payload);

		if (result) {
			Messenger.successAlert("یادآور با موفقیت ثبت شد!");
			await fetchReminders();
			setView("list");
		}

		return result;
	};

	const completeReminder = async (id: number) => {
		setCompletingId(id);

		try {
			const result = await ReminderService.Complete(id);

			if (result) {
				Messenger.successAlert("یادآور با موفقیت انجام شد.");
				await fetchReminders();
			}
		} catch {
			Messenger.errorMessage("خطا در انجام یادآور. لطفاً مجدداً تلاش کنید.");
		} finally {
			setCompletingId(null);
		}
	};

	useEffect(() => {
		void fetchReminders();
		void fetchTypes();
		setView("list");
	}, [isOpen, fetchReminders, fetchTypes]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return {
		isOpen,
		view,
		reminders,
		reminderTypes,
		isLoadingList,
		listError,
		completingId,
		widgetRef,
		openWidget,
		closeWidget,
		toggleWidget,
		goToList,
		goToAdd,
		addReminder,
		completeReminder,
	};
}
