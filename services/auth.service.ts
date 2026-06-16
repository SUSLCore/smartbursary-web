import { isAxiosError } from "axios";
import axiosInstance from "@/lib/axios";

export type RegisterStudentPayload = {
	registerId: string;
	name: string;
	email: string;
	password: string;
	facultyId: number;
	departmentId: number;
	phone: string;
};

export type LoginPayload = {
	email: string;
	password: string;
};

export type UserRecord = {
	id: number;
	registerId: string;
	name: string;
	email: string;
	role: string;
	phone: string;
	isActive?: boolean;
	FacultyId?: number;
	DepartmentId?: number;
	createdAt?: string;
	updatedAt?: string;
};

export type ApiResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

export type LoginResponse = {
	success: boolean;
	message: string;
	role: string;
	user: UserRecord;
};

export type MeResponse = {
	success: boolean;
	message: string;
	user?: UserRecord;
};

export type LogoutResponse = {
	success: boolean;
	message: string;
};

export const authService = {
	async registerStudent(payload: RegisterStudentPayload) {
		const response = await axiosInstance.post<ApiResponse<UserRecord>>(
			"/api/auth/register-student",
			payload,
		);

		return response.data;
	},

	async login(payload: LoginPayload) {
		const response = await axiosInstance.post<LoginResponse>("/api/auth/login", payload);

		return response.data;
	},

	async me() {
		const response = await axiosInstance.get<MeResponse>("/api/auth/me");

		return response.data;
	},

	async meWithCookie(cookieHeader: string) {
		try {
			// Ensure base URL points to the API server root (no duplicate /api)
			const apiServerBaseUrl = process.env.API_SERVER_BASE_URL ?? "http://localhost:5000";

			const response = await axiosInstance.get<MeResponse>("/api/auth/me", {
				baseURL: apiServerBaseUrl,
				headers: {
					Cookie: cookieHeader,
				},
			});

			return response.data;
		} catch (error) {
			if (isAxiosError<MeResponse>(error)) {
				return (
					error.response?.data ?? {
						success: false,
						message: "Unauthorized",
					}
				);
			}

			return {
				success: false,
				message: "Unauthorized",
			};
		}
	},

	async logout() {
		const response = await axiosInstance.post<LogoutResponse>("/api/auth/logout", {});

		return response.data;
	},
};

export default authService;
