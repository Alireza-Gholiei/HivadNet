import type React from "react";

export type ToastType = "success" | "error" | "info";
export type ToastMessage = string | React.ReactNode;

interface QueuedToast {
    message: ToastMessage;
    type?: ToastType;
}

type ToastImpl = (msg: ToastMessage, type?: ToastType) => void;

declare global {
    interface Window {
        __TOAST_QUEUE__?: QueuedToast[];
        __TOAST_IMPL__?: ToastImpl;
    }
}

export function toast(message: ToastMessage, type: ToastType = "info") {
    if (typeof window === "undefined") {
        return;
    }

    if (window.__TOAST_IMPL__) {
        window.__TOAST_IMPL__(message, type);
    } else {
        window.__TOAST_QUEUE__ ??= [];
        window.__TOAST_QUEUE__.push({ message, type });
    }
}

export function registerToast(fn: ToastImpl) {
    if (typeof window === "undefined") return;

    window.__TOAST_IMPL__ = fn;

    if (window.__TOAST_QUEUE__?.length) {
        window.__TOAST_QUEUE__.forEach((t) => fn(t.message, t.type));
        window.__TOAST_QUEUE__ = [];
    }
}
