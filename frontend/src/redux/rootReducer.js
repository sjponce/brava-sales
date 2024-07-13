import { combineReducers } from 'redux';
import authReducer from './auth';
import themeReducer from './themeReducer';
import crudReducer from './crud';
import stockReducer from './stock';

// Combine all reducers.

const rootReducer = combineReducers({
  auth: authReducer,
  crud: crudReducer,
  theme: themeReducer,
  stock: stockReducer,
});

export default rootReducer;
