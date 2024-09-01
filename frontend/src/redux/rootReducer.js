import { combineReducers } from 'redux';
import authReducer from './auth';
import themeReducer from './themeReducer';
import crudReducer from './crud';
import stockReducer from './stock';
import salesReducer from './sales';
import docsReducer from './docs';

// Combine all reducers.

const rootReducer = combineReducers({
  auth: authReducer,
  crud: crudReducer,
  theme: themeReducer,
  stock: stockReducer,
  sales: salesReducer,
  docs: docsReducer,
});

export default rootReducer;
