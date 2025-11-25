import * as actionTypes from './types';
import travelsRequest from '@/request/travelsRequest';

const travels = {
  resetState: () => async (dispatch) => {
    dispatch({ type: actionTypes.RESET_STATE });
  },
  create: (payload) => async (dispatch) => {
    dispatch({ type: actionTypes.REQUEST_LOADING, keyState: 'create' });
    const data = await travelsRequest.createTravel(payload);
    if (data.success === true) {
      dispatch({ type: actionTypes.REQUEST_SUCCESS, keyState: 'create', payload: data.result });
    } else {
      dispatch({ type: actionTypes.REQUEST_FAILED, keyState: 'create' });
    }
  },
  listAll: () => async (dispatch) => {
    dispatch({ type: actionTypes.REQUEST_LOADING, keyState: 'listAll' });
    const data = await travelsRequest.listTravels();
    if (data.success === true) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        keyState: 'listAll',
        payload: { items: data },
      });
    } else {
      dispatch({ type: actionTypes.REQUEST_FAILED, keyState: 'listAll' });
    }
  },
  delete: ({ id }) => async (dispatch) => {
    dispatch({ type: actionTypes.REQUEST_LOADING, keyState: 'delete' });
    const data = await travelsRequest.deleteTravel(id);
    if (data.success === true) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        keyState: 'delete',
        payload: data.result,
      });
    } else {
      dispatch({ type: actionTypes.REQUEST_FAILED, keyState: 'delete' });
    }
  },
  getDetails: ({ id }) => async (dispatch) => {
    dispatch({ type: actionTypes.REQUEST_LOADING, keyState: 'details' });
    const data = await travelsRequest.getDetails(id);
    if (data.success === true) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        keyState: 'details',
        payload: data.result,
      });
    } else {
      dispatch({ type: actionTypes.REQUEST_FAILED, keyState: 'details' });
    }
  },
};

export default travels;
