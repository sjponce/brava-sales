import {
  createContext, useContext, useMemo, useReducer,
} from 'react';
import PropTypes from 'prop-types';
import contextActions from './actions';
import { contextReducer, initialState } from './reducer';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contextReducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  const [state, dispatch] = context;
  const appContextAction = contextActions(dispatch);
  return { state, appContextAction };
}

export { AppContextProvider, useAppContext };
