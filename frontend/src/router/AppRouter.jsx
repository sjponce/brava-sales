import { useEffect } from "react";

import { useAppContext } from "@/context/appContext";
import {} from "react-router-dom";
import {} from "react-router-dom";
import { useLocation, useRoutes } from "react-router-dom";

import routes from "./routes";

export default function AppRouter() {
	const location = useLocation();
	const { state: stateApp, appContextAction } = useAppContext();
	const { app } = appContextAction;

	const routesList = [];

	Object.entries(routes).forEach(([key, value]) => {
		routesList.push(...value);
	});

	function getAppNameByPath(path) {
		for (const key in routes) {
			for (let i = 0; i < routes[key].length; i++) {
				if (routes[key][i].path === path) {
					return key;
				}
			}
		}
		// Return 'default' app  if the path is not found
		return "default";
	}
	useEffect(() => {
		if (location.pathname === "/") {
			app.default();
		} else {
			const path = getAppNameByPath(location.pathname);
			app.open(path);
		}
	}, [location]);

	const element = useRoutes(routesList);

	return element;
}
