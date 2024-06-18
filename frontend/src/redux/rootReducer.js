import { combineReducers } from 'redux';
import authReducer from './auth';
import themeReducer from './themeReducer';
import crudReducer from './crud';

// Combine all reducers.

const rootReducer = combineReducers({
  auth: authReducer,
  crud: crudReducer,
  theme: themeReducer,
});

export default rootReducer;
