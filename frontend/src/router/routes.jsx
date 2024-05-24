import { lazy } from "react";

import { Navigate } from "react-router-dom";

const Logout = lazy(() => import("@/pages/Logout.jsx"));
const NotFound = lazy(() => import("@/pages/NotFound.jsx"));

const Dashboard = lazy(() => import("@/pages/Dashboard"));

const routes = {
	expense: [],
	default: [
		{
			path: "/login",
			element: <Navigate to="/" />,
		},
		{
			path: "/verify/*",
			element: <Navigate to="/" />,
		},
		{
			path: "/resetpassword/*",
			element: <Navigate to="/" />,
		},
		{
			path: "/logout",
			element: <Logout />,
		},
		{
			path: "/",
			element: <Dashboard />,
		},
		{
			path: "*",
			element: <NotFound />,
		},
	],
};

export default routes;
