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
			"/auth/register-student",
			payload,
		);

		return response.data;
	},

	async login(payload: LoginPayload) {
		const response = await axiosInstance.post<LoginResponse>("/auth/login", payload);

		return response.data;
	},

	async me() {
		const response = await axiosInstance.get<MeResponse>("/auth/me");

		return response.data;
	},

	async logout() {
		const response = await axiosInstance.post<LogoutResponse>("/auth/logout", {});

		return response.data;
	},
};

export default authService;
