import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { loginUser, logoutUser, validateAuth } from "./authThunk";
import { AuthRole, AuthState, AuthUser } from "./authTypes";

const initialState: AuthState = {
	user: null,
	role: null,
	isAuthenticated: false,
	status: "idle",
	error: null,
	message: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout(state) {
			state.user = null;
			state.role = null;
			state.isAuthenticated = false;
			state.status = "idle";
			state.error = null;
			state.message = null;
		},
		clearAuthError(state) {
			state.error = null;
		},
		setAuthFromSession(
			state,
			action: PayloadAction<{ user: AuthUser; role: AuthRole }>,
		) {
			state.user = action.payload.user;
			state.role = action.payload.role;
			state.isAuthenticated = true;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(validateAuth.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(validateAuth.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.user = action.payload.user ?? null;
				state.role = action.payload.user?.role ?? null;
				state.isAuthenticated = Boolean(action.payload.user);
				state.error = null;
				state.message = action.payload.message;
			})
			.addCase(validateAuth.rejected, (state, action) => {
				state.status = "failed";
				state.user = null;
				state.role = null;
				state.isAuthenticated = false;
				state.error = null;
				state.message = action.payload ?? "Unauthorized";
			})
			.addCase(loginUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.user = action.payload.user;
				state.role = action.payload.role || action.payload.user.role;
				state.isAuthenticated = true;
				state.error = null;
				state.message = action.payload.message;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = "failed";
				state.user = null;
				state.role = null;
				state.isAuthenticated = false;
				state.error = action.payload ?? "Login failed. Please try again.";
			})
			.addCase(logoutUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(logoutUser.fulfilled, (state, action) => {
				state.status = "idle";
				state.user = null;
				state.role = null;
				state.isAuthenticated = false;
				state.error = null;
				state.message = action.payload.message;
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.status = "idle";
				state.user = null;
				state.role = null;
				state.isAuthenticated = false;
				state.error = null;
				state.message = action.payload ?? "Logged out";
			});
	},
});

export const { logout, clearAuthError, setAuthFromSession } = authSlice.actions;
export default authSlice.reducer;