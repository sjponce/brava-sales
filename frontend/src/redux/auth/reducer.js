import * as actionTypes from './types';

const INITIAL_STATE = {
  result: null,
  current: {},
  isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
};

// eslint-disable-next-line default-param-last
const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.REQUEST_LOADING:
      return {
        ...state,
        isLoggedIn: false,
        isLoading: true,
      };
    case actionTypes.REQUEST_FAILED:
      return INITIAL_STATE;

    case actionTypes.REQUEST_SUCCESS:
      return {
        current: action.payload,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };

    case actionTypes.REGISTER_SUCCESS:
      return {
        current: null,
        isLoggedIn: false,
        isLoading: false,
        isSuccess: true,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return INITIAL_STATE;

    case actionTypes.LOGOUT_FAILED:
      return {
        current: action.payload,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };

    case actionTypes.LOADING_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
      };

    case actionTypes.FAILED_REQUEST:
      return {
        ...state,
        isLoading: false,
      };

    case actionTypes.SUCCESS_REQUEST:
      return {
        ...state,
        result: action.payload,
        isLoading: false,
        isSuccess: true,
      };

    default:
      return state;
  }
};

export default authReducer;
