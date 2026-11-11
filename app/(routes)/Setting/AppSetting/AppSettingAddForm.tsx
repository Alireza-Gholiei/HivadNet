import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/utilities/components/ui/button";
import { Input } from "@/utilities/components/ui/input";
import { SettingAddDto, SettingAddSchema } from "@/dataBinding/models/Setting/AppSetting/SettingDtos";
import { SettingService } from "@/dataBinding/services/Setting/AppSetting/SettingService";

type AppSettingAddFormProps = {
	onSuccess: () => void;
	onClose: () => void;
};

export default function AppSettingAddForm({ onSuccess, onClose }: AppSettingAddFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<SettingAddDto>({
		resolver: zodResolver(SettingAddSchema),
		defaultValues: {
			Name: "",
			Phone: "",
		},
	});

	const onSubmit = async (data: SettingAddDto) => {
		try {
			const result = await SettingService.Add(data);

			if (result) {
				reset();
				if (onSuccess) onSuccess();
				onClose();
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
			<form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="p-6">
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
					<Input
						label="نام"
						type="text"
						schema={SettingAddSchema}
						error={errors.Name?.message}
						placeholder="مثلاً پنل اصلی پیامک"
						disabled={isSubmitting}
						{...register("Name")}
					/>

					<Input
						label="شماره تماس"
						type="text"
						schema={SettingAddSchema}
						error={errors.Phone?.message}
						placeholder="02123456789"
						disabled={isSubmitting}
						{...register("Phone")}
					/>

					<Input
						label="شماره کارت مجموعه"
						type="text"
						schema={SettingAddSchema}
						error={errors.CardNumber?.message}
						placeholder="6037123456781234"
						disabled={isSubmitting}
						{...register("CardNumber")}
					/>
				</div>

				<div className="mt-8 flex justify-end">
					<Button type="submit" disabled={isSubmitting} variant="submit">
						<Save className="h-4 w-4" />
						{isSubmitting ? "در حال ذخیره..." : "ذخیره"}
					</Button>
				</div>
			</form>
		</div>
	);
}
