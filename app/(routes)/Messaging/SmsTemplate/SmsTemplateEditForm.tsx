"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Activity } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
	SmsTemplateEditDto,
	SmsTemplateEditSchema,
	SmsTemplateVariableDto,
} from "@/dataBinding/models/Messaging/SmsTemplate/SmsTemplateDtos";
import { SmsTemplateService } from "@/dataBinding/services/Messaging/SmsTemplate/SmsTemplateService";
import { Button } from "@/utilities/components/ui/button";
import { PageCard, PageCardContent, PageCardFooter } from "@/utilities/components/ui/card";
import { Messenger } from "@/utilities/Messenger";
import { Input } from "@/utilities/components/ui/input";
import { Textarea } from "@/utilities/components/ui/textarea";
import { Checkbox } from "@/utilities/components/ui/checkbox";

export default function SmsTemplateEditForm({ id, onClose }: { id: number; onClose: () => void }) {
	const [variables, setVariables] = useState<SmsTemplateVariableDto[]>([]);
	const [isLoadingVars, setIsLoadingVars] = useState<boolean>(true);

	const [manualInputName, setManualInputName] = useState<string>("");
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<SmsTemplateEditDto>({
		resolver: zodResolver(SmsTemplateEditSchema),
		defaultValues: { Title: "", Content: "" },
	});

	useEffect(() => {
		void fetchData();
		void fetchVariables();
	}, []);

	const fetchData = async () => {
		try {
			const data = await SmsTemplateService.GetById(id);
			if (data) {
				reset({
					Id: data.Id,
					Title: data.Title,
					Content: data.Content,
					IsActive: data.IsActive,
				});
			}
		} finally {
			setIsLoadingVars(false);
		}
	};

	const fetchVariables = async () => {
		try {
			const data = await SmsTemplateService.GetVariables();
			if (data) {
				setVariables(data);
			}
		} finally {
			setIsLoadingVars(false);
		}
	};

	const insertVariable = (placeholder: string) => {
		const currentContent = getValues("Content") || "";
		const cursorPosition = textAreaRef.current?.selectionStart || currentContent.length;

		const newContent = currentContent.slice(0, cursorPosition) + placeholder + currentContent.slice(cursorPosition);

		setValue("Content", newContent, { shouldValidate: true });

		setTimeout(() => {
			if (textAreaRef.current) {
				textAreaRef.current.focus();
				textAreaRef.current.setSelectionRange(
					cursorPosition + placeholder.length,
					cursorPosition + placeholder.length,
				);
			}
		}, 0);
	};

	const handleAddManualInput = () => {
		const trimmedName = manualInputName.replaceAll(" ", "_");
		if (!trimmedName) return;

		const placeholder = `{Input:${trimmedName}}`;
		insertVariable(placeholder);
		setManualInputName("");
	};

	const onSubmit = async (data: SmsTemplateEditDto) => {
		const result = await SmsTemplateService.Edit(data);

		if (result) {
			Messenger.successAlert("قالب با موفقیت ذخیره شد!");
			onClose();
		}
	};

	const { ref: hookFormRef, ...rest } = register("Content");

	return (
		<PageCard>
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
				<PageCardContent>
					<Input
						label="عنوان قالب"
						schema={SmsTemplateEditSchema}
						error={errors.Title?.message}
						placeholder="مثال: یادآوری بدهی"
						{...register("Title")}
					/>

					<div className="bg-gray-50 p-3 rounded border space-y-4 my-2">
						<div>
							<label className="block text-sm font-medium mb-2">
								متغیرهای سیستمی (برای درج کلیک کنید):
							</label>
							{isLoadingVars ? (
								<span className="text-sm text-gray-500">در حال بارگذاری متغیرها...</span>
							) : (
								<div className="flex flex-wrap gap-2">
									{variables.map((v) => (
										<Button
											key={v.Placeholder}
											type="button"
											onClick={() => insertVariable(v.Placeholder)}
											className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-full text-sm font-medium transition-colors"
											title={v.Title}
										>
											{v.Title}{" "}
											<span dir="ltr" className="text-xs opacity-70 ml-1">
												({v.Placeholder})
											</span>
										</Button>
									))}
								</div>
							)}
						</div>

						<hr className="border-gray-200" />

						<div>
							<label className="block text-sm font-medium mb-2">
								ایجاد متغیر دستی (هنگام ارسال مقداردهی می‌شود):
							</label>
							<div className="flex gap-2">
								<Input
									type="text"
									value={manualInputName}
									onChange={(e) => setManualInputName(e.target.value)}
									placeholder="نام متغیر... (مثال: مبلغ)"
									containerClassName="flex-1"
									inputClassName="text-sm"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddManualInput();
										}
									}}
								/>

								<Button
									type="button"
									onClick={handleAddManualInput}
									disabled={!manualInputName.trim()}
									className="bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap"
								>
									درج در متن
								</Button>
							</div>
						</div>
					</div>

					<Textarea
						label="متن پیامک"
						schema={SmsTemplateEditSchema}
						error={errors.Content?.message}
						placeholder="متن پیامک خود را اینجا بنویسید..."
						rows={5}
						dir="rtl"
						textareaClassName="resize-none"
						{...rest}
						ref={(e) => {
							hookFormRef(e);
							textAreaRef.current = e;
						}}
					/>

					<div className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50/50">
						<Activity className="w-5 h-5 text-indigo-600" />
						<span className="text-sm font-semibold text-slate-700 ml-auto">وضعیت قالب پیامکی</span>

						<Checkbox
							label="فعال باشد"
							schema={SmsTemplateEditSchema}
							error={errors.IsActive?.message}
							checkboxClassName="border-slate-300 peer-checked:border-indigo-600 peer-checked:bg-indigo-600"
							{...register("IsActive")}
						/>
					</div>
				</PageCardContent>

				<PageCardFooter>
					<Button type="submit" disabled={isSubmitting} variant="submit">
						{isSubmitting ? "در حال ذخیره..." : "ذخیره قالب"}
					</Button>
				</PageCardFooter>
			</form>
		</PageCard>
	);
}
