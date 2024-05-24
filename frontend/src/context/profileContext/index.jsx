import { createContext, useContext, useMemo, useReducer } from "react";
import contextActions from "./actions";
import { contextReducer, initialState } from "./reducer";
import contextSelectors from "./selectors";

const ProfileContext = createContext();

function ProfileContextProvider({ children }) {
	const [state, dispatch] = useReducer(contextReducer, initialState);
	const value = useMemo(() => [state, dispatch], [state]);

	return (
		<ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
	);
}

function useProfileContext() {
	const context = useContext(ProfileContext);
	if (context === undefined) {
		throw new Error(
			"useProfileContext must be used within a ProfileContextProvider",
		);
	}
	const [state, dispatch] = context;
	const profileContextAction = contextActions(dispatch);
	const profileContextSelector = contextSelectors(state);
	return { state, profileContextAction, profileContextSelector };
}

export { ProfileContextProvider, useProfileContext };
