import axiosInstance from "@/lib/axios";

import { LoginRequest, LoginResponse } from "./authTypes";

const authService = {
	async login(payload: LoginRequest) {
		const response = await axiosInstance.post<LoginResponse>(
			"/auth/login",
			payload,
		);

		return response.data;
	},
};

export default authService;