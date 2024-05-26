import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './rootReducer';
import { storePersist, localStorageHealthCheck } from './storePersist';

localStorageHealthCheck();
const AUTH_INITIAL_STATE = {
  current: {},
  isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
};

const authState = storePersist.get('auth') ? storePersist.get('auth') : AUTH_INITIAL_STATE;

const initialState = { auth: authState };

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  devTools: import.meta.env.PROD === false,
});

export default store;
