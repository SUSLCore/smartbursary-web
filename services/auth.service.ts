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

export type LoginResponseData = {
	token: string;
	user: UserRecord;
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
		const response = await axiosInstance.post<
			ApiResponse<LoginResponseData | UserRecord>
		>("/auth/login", payload);

		return response.data;
	},
};

export default authService;
