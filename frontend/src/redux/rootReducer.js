import { combineReducers } from 'redux';
import authReducer from './auth';
import themeReducer from './themeReducer';
import { reducer as crudReducer } from './crud';

// Combine all reducers.

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  erp: crudReducer,
});

export default rootReducer;
