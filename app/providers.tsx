"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";

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
				<Toaster
					position="top-right"
					toastOptions={{
						style: {
							borderRadius: "12px",
							padding: "14px 16px",
							fontSize: "14px",
						},
						success: {
							style: {
								background: "#ecfeff",
								color: "#155e75",
								border: "1px solid #67e8f9",
							},
						},
						error: {
							style: {
								background: "#fef2f2",
								color: "#b91c1c",
								border: "1px solid #fecaca",
							},
						},
					}}
				/>
			</PersistGate>
		</Provider>
	);
}