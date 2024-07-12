import stockRequest from '@/request/stockRequest';
import * as actionTypes from './types';

const stock = {
  resetState:
    () => async (dispatch) => {
      dispatch({
        type: actionTypes.RESET_STATE,
      });
    },
  resetAction:
    ({ actionType }) => async (dispatch) => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: actionType,
        payload: null,
      });
    },
  currentItem:
    ({ data }) => async (dispatch) => {
      dispatch({
        type: actionTypes.CURRENT_ITEM,
        payload: { ...data },
      });
    },
  currentAction:
    ({ actionType, data }) => async (dispatch) => {
      dispatch({
        type: actionTypes.CURRENT_ACTION,
        keyState: actionType,
        payload: { ...data },
      });
    },
  list:
    ({ entity, options = { page: 1, items: 10 } }) => async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'list',
        payload: null,
      });

      const data = await stockRequest.list({ entity, options });

      if (data.success === true) {
        const result = {
          items: data.result,
          pagination: {
            current: parseInt(data.pagination.page, 10),
            pageSize: options?.items,
            total: parseInt(data.pagination.count, 10),
          },
        };
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'list',
          payload: result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'list',
          payload: null,
        });
      }
    },
  listAll:
    ({ entity }) => async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'listAll',
        payload: null,
      });

      const data = await stockRequest.listAll({ entity });

      if (data.success === true) {
        const result = {
          items: data,
        };
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'listAll',
          payload: result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'listAll',
          payload: null,
        });
      }
    },
  read:
    ({ entity, id }) => async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'read',
        payload: null,
      });

      const data = await stockRequest.read({ entity, id });

      if (data.success === true) {
        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result,
        });
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'read',
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'read',
          payload: null,
        });
      }
    },
  update:
    ({
      entity, id, jsonData,
    }) => async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'update',
        payload: null,
      });

      const data = await stockRequest.update({ entity, id, jsonData });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'update',
          payload: data.result,
        });
        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'update',
          payload: null,
        });
      }
    },
  delete:
    ({ entity, id }) => async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'delete',
        payload: null,
      });

      const data = await stockRequest.delete({ entity, id });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'delete',
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'delete',
          payload: null,
        });
      }
    },
};

export default stock;
