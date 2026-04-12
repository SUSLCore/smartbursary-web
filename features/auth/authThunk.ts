import { isAxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import authService from "@/services/auth.service";
import {
	LoginRequest,
	LoginResponse,
	LogoutResponse,
	MeResponse,
} from "./authTypes";

export const loginUser = createAsyncThunk<
	LoginResponse,
	LoginRequest,
	{ rejectValue: string }
>("auth/loginUser", async (payload, { rejectWithValue }) => {
	try {
		const response = await authService.login(payload);
		if (!response.success) {
			return rejectWithValue(response.message || "Login failed. Please try again.");
		}

		return response;
	} catch (error) {
		if (isAxiosError<{ message?: string }>(error)) {
			return rejectWithValue(
				error.response?.data?.message ?? "Login failed. Please try again.",
			);
		}

		return rejectWithValue("Login failed. Please try again.");
	}
});

export const validateAuth = createAsyncThunk<
	MeResponse,
	void,
	{ rejectValue: string }
>("auth/validateAuth", async (_, { rejectWithValue }) => {
	try {
		const response = await authService.me();
		if (!response.success || !response.user) {
			return rejectWithValue(response.message || "Unauthorized");
		}

		return response;
	} catch (error) {
		if (isAxiosError<{ message?: string }>(error)) {
			return rejectWithValue(error.response?.data?.message ?? "Unauthorized");
		}

		return rejectWithValue("Unauthorized");
	}
});

export const logoutUser = createAsyncThunk<
	LogoutResponse,
	void,
	{ rejectValue: string }
>("auth/logoutUser", async (_, { rejectWithValue }) => {
	try {
		const response = await authService.logout();
		if (!response.success) {
			return rejectWithValue(response.message || "Logout failed");
		}

		return response;
	} catch (error) {
		if (isAxiosError<{ message?: string }>(error)) {
			return rejectWithValue(error.response?.data?.message ?? "Logout failed");
		}

		return rejectWithValue("Logout failed");
	}
});