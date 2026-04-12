export type AuthRole =
	| "ADMIN"
	| "STUDENT"
	| "SAR"
	| "MA"
	| "FAC_AR"
	| "FAC_MA"
	| string;

export type AuthUser = {
	id: number;
	registerId: string;
	name: string;
	email: string;
	role: AuthRole;
	phone: string;
	isActive?: boolean;
	createdAt?: string;
	updatedAt?: string;
	FacultyId?: number;
	DepartmentId?: number;
};

export type LoginRequest = {
	email: string;
	password: string;
};

export type LoginResponse = {
	success: boolean;
	message: string;
	role: AuthRole;
	user: AuthUser;
};

export type MeResponse = {
	success: boolean;
	message: string;
	user?: AuthUser;
};

export type LogoutResponse = {
	success: boolean;
	message: string;
};

export type AuthState = {
	user: AuthUser | null;
	role: AuthRole | null;
	isAuthenticated: boolean;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
	message: string | null;
};