import { LoginDto } from "@/dataBinding/models/Auth/LoginDto";
import { LoginResultDto } from "@/dataBinding/models/Auth/LoginResultDto";
import { http } from "@/utilities/services/http.service";
import { TokenService } from "@/utilities/services/token.service";
import { StaticsUrl } from "@/utilities/StaticsUrl";

export const AuthService = {
	async Login(data: LoginDto): Promise<LoginResultDto> {
		const result = await http.post<LoginDto, LoginResultDto>(`${StaticsUrl.SSOUrl}Login`, data);

		if (result?.IsExistUser) {
			await TokenService.setTokens(result.AccessToken, result.RefreshToken);
		}

		return result;
	},
};
