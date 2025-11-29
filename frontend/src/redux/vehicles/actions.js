import * as actionTypes from './types';
import vehiclesRequest from '@/request/vehiclesRequest';

const vehicles = {
  resetState: () => async (dispatch) => {
    dispatch({ type: actionTypes.RESET_STATE });
  },
  listAll: () => async (dispatch) => {
    dispatch({ type: actionTypes.REQUEST_LOADING, keyState: 'listAll' });
    const data = await vehiclesRequest.listVehicles();
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
};

export default vehicles;
