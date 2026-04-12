import axiosInstance from "@/lib/axios";

import { LoginRequest, LoginResponse, MeResponse } from "./authTypes";

const authService = {
	async login(payload: LoginRequest) {
		const response = await axiosInstance.post<LoginResponse>(
			"/auth/login",
			payload,
		);

		return response.data;
	},

	async me() {
		const response = await axiosInstance.get<MeResponse>("/auth/me");

		return response.data;
	},
};

export default authService;