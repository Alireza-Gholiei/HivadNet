import { toast } from "./components/toast/toast.api";

export class Messenger {
	static successAlert(message = "عملیات با موفقیت انجام شد.") {
		toast(message, "success");
	}

	static infoAlert(message: string) {
		toast(message, "info");
	}

	static errorMessage(message = "خطای ناشناخته در سیستم رخ داد") {
		toast(message, "error");
	}
}
