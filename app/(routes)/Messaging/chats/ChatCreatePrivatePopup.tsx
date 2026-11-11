"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import UserSelector from "@/components/user/UserSelector";
import {
	ChatCreatePrivateDto,
	ChatCreatePrivateSchema,
} from "@/dataBinding/models/Messaging/Chat/ChatCreatePrivateDto";
import { ChatService } from "@/dataBinding/services/Messaging/Chat/ChatService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";

type ChatCreatePrivateFormProps = {
	onClose: () => void;
	onSuccess: (chatId: number) => void;
};

export default function ChatCreatePrivateForm({ onClose, onSuccess }: ChatCreatePrivateFormProps) {
	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<ChatCreatePrivateDto>({
		resolver: zodResolver(ChatCreatePrivateSchema),
		defaultValues: {
			TargetUserId: 0,
		},
	});

	const onSubmit = async (data: ChatCreatePrivateDto) => {
		const chatId = await ChatService.CreatePrivate(data);

		if (chatId) {
			onSuccess(chatId);
			Messenger.successAlert("گفتگو با موفقیت ایجاد شد");
			return;
		}
		onClose();
	};

	return (
		<PageCard>
			<form
				onSubmit={(e) => void handleSubmit(onSubmit)(e)}
				className="p-6 bg-white rounded-2xl flex flex-col gap-4 max-h-[80vh]"
			>
				<PageCardContent>
					<Controller
						name="TargetUserId"
						control={control}
						render={({ field }) => (
							<UserSelector
								valueId={field.value}
								onChangeId={field.onChange}
								label="انتخاب کاربر"
								required
							/>
						)}
					/>

					{errors.TargetUserId && <p className="text-sm text-red-500">{errors.TargetUserId.message}</p>}
				</PageCardContent>

				<Button type="submit" disabled={isSubmitting} variant="submit">
					{isSubmitting ? "در حال ایجاد گفتگو..." : "شروع گفتگو"}
				</Button>
			</form>
		</PageCard>
	);
}
