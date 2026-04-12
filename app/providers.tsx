"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { validateAuth } from "@/features/auth/authThunk";
import { AppDispatch } from "@/redux/store";
import { persistor, store } from "@/redux/store";

type ProvidersProps = {
	children: React.ReactNode;
};

function AuthBootstrap({ children }: ProvidersProps) {
	const dispatch = useDispatch<AppDispatch>();
	const hasValidated = useRef(false);

	useEffect(() => {
		if (hasValidated.current) {
			return;
		}

		hasValidated.current = true;
		dispatch(validateAuth());
	}, [dispatch]);

	return <>{children}</>;
}

export default function Providers({ children }: ProvidersProps) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<AuthBootstrap>{children}</AuthBootstrap>
			</PersistGate>
		</Provider>
	);
}