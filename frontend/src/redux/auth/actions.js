import * as authService from '@/auth';
import * as actionTypes from './types';

export const login = ({ loginData }) => async (dispatch) => {
  dispatch({
    type: actionTypes.REQUEST_LOADING,
  });
  const data = await authService.login({ loginData });

  if (data.success === true) {
    const authState = {
      current: data.result,
      isLoggedIn: true,
      isLoading: false,
      isSuccess: true,
    };
    window.localStorage.setItem('auth', JSON.stringify(authState));
    window.localStorage.removeItem('isLogout');
    dispatch({
      type: actionTypes.REQUEST_SUCCESS,
      payload: data.result,
    });
  } else {
    dispatch({
      type: actionTypes.REQUEST_FAILED,
    });
  }
};

export const registerUser = ({ registerData }) => async (dispatch) => {
  dispatch({
    type: actionTypes.LOADING_REQUEST,
  });
  const data = await authService.register({ registerData });

  if (data.success === true) {
    dispatch({
      type: actionTypes.SUCCESS_REQUEST,
      payload: data.result,
    });
  } else {
    dispatch({
      type: actionTypes.FAILED_REQUEST,
    });
  }
};

export const updateUser = ({ userId, updateData }) => async (dispatch) => {
  dispatch({
    type: actionTypes.LOADING_REQUEST,
  });
  const data = await authService.update({ userId, updateData });

  if (data.success === true) {
    dispatch({
      type: actionTypes.SUCCESS_REQUEST,
      payload: data.result,
    });
  } else {
    dispatch({
      type: actionTypes.FAILED_REQUEST,
    });
  }
};
export const updatePassword = ({ userId, passwordData }) => async (dispatch) => {
  dispatch({
    type: actionTypes.LOADING_REQUEST,
  });
  const data = await authService.updatePassword({ userId, passwordData });

  if (data.success === true) {
    dispatch({
      type: actionTypes.SUCCESS_REQUEST,
    });
  } else {
    dispatch({
      type: actionTypes.FAILED_REQUEST,
    });
  }
};

export const verify = ({ userId, emailToken }) => async (dispatch) => {
  dispatch({
    type: actionTypes.REQUEST_LOADING,
  });
  const data = await authService.verify({ userId, emailToken });

  if (data.success === true) {
    const authState = {
      current: data.result,
      isLoggedIn: true,
      isLoading: false,
      isSuccess: true,
    };
    window.localStorage.setItem('auth', JSON.stringify(authState));
    window.localStorage.removeItem('isLogout');
    dispatch({
      type: actionTypes.REQUEST_SUCCESS,
      payload: data.result,
    });
  } else {
    dispatch({
      type: actionTypes.REQUEST_FAILED,
    });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({
    type: actionTypes.LOGOUT_SUCCESS,
  });
  window.localStorage.removeItem('auth');
  window.localStorage.removeItem('settings');
  window.localStorage.setItem('isLogout', JSON.stringify({ isLogout: true }));
  await authService.logout();
};
