import { isAxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import authService from "./authService";
import { LoginRequest, LoginResponse } from "./authTypes";

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