import { Suspense, lazy } from "react";

import PageLoader from "@/components/PageLoader";
import { AppContextProvider } from "@/context/appContext";
import { selectAuth } from "@/redux/auth/selectors";
import AuthRouter from "@/router/AuthRouter";
import { useSelector } from "react-redux";

const ErpApp = lazy(() => import("./ErpApp"));

const DefaultApp = () => (
	<AppContextProvider>
		<Suspense fallback={<PageLoader />}>
			<ErpApp />
		</Suspense>
	</AppContextProvider>
);

export default function BravaSalesOs() {
	const { isLoggedIn } = useSelector(selectAuth);

	if (!isLoggedIn) return <AuthRouter />;
	else {
		return <DefaultApp />;
	}
}
