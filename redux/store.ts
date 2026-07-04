import { configureStore } from "@reduxjs/toolkit";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistReducer,
	persistStore,
} from "redux-persist";

import authReducer from "@/features/auth/authSlice";

const createNoopStorage = () => ({
	getItem: async () => null,
	setItem: async (_key: string, value: string) => value,
	removeItem: async () => null,
});

const createBrowserStorage = () => {
	if (typeof window === "undefined") {
		return createNoopStorage();
	}

	try {
		const testKey = "redux-persist test";
		window.localStorage.setItem(testKey, "test");
		window.localStorage.removeItem(testKey);

		return {
			getItem: async (key: string) => window.localStorage.getItem(key),
			setItem: async (_key: string, value: string) => {
				window.localStorage.setItem(_key, value);
				return value;
			},
			removeItem: async (_key: string) => {
				window.localStorage.removeItem(_key);
				return null;
			},
		};
	} catch {
		return createNoopStorage();
	}
};

const storage = createBrowserStorage();

const authPersistConfig = {
	key: "auth",
	storage,
	whitelist: ["user", "role", "isAuthenticated"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
	reducer: {
		auth: persistedAuthReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
