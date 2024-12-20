import * as actionTypes from './types';
import { salesRequest } from '@/request/salesRequest';

const sales = {
  resetState: () => async (dispatch) => {
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

      const data = await salesRequest.list({ entity, options });

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

      const data = await salesRequest.listAll({ entity });

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
  listAllStockReservations:
    ({ entity }) => async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'listAllStockReservations',
        payload: null,
      });

      const data = await salesRequest.listAllStockReservations({ entity });

      if (data.success === true) {
        const result = {
          items: data,
        };
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'listAllStockReservations',
          payload: result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'listAllStockReservations',
          payload: null,
        });
      }
    },
  updateStockReservationStatus:
    ({ jsonData }) => async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'updateStockReservationStatus',
        payload: null,
      });

      const data = await salesRequest.updateStockReservationStatus({ jsonData });

      if (data.success === true) {
        const result = {
          items: data,
        };
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'updateStockReservationStatus',
          payload: result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'updateStockReservationStatus',
          payload: null,
        });
      }
    },
  create:
    ({ entity, jsonData, withUpload = false }) => async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'create',
        payload: null,
      });
      let data = null;
      if (withUpload) {
        data = await salesRequest.createAndUpload({ entity, jsonData });
      } else {
        data = await salesRequest.create({ entity, jsonData });
      }

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'create',
          payload: data.result,
        });

        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'create',
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

      const data = await salesRequest.read({ entity, id });

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
    ({ entity, id, jsonData, withUpload = false }) => async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'update',
        payload: null,
      });

      let data = null;

      if (withUpload) {
        data = await salesRequest.updateAndUpload({ entity, id, jsonData });
      } else {
        data = await salesRequest.update({ entity, id, jsonData });
      }

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
        type: actionTypes.RESET_ACTION,
        keyState: 'delete',
      });
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'delete',
        payload: null,
      });

      const data = await salesRequest.delete({ entity, id });

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

  createPayment:
    ({ entity, body }) => async (dispatch) => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: 'createPayment',
      });
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'createPayment',
        payload: null,
      });

      const data = await salesRequest.createPayment({ entity, body });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'createPayment',
          payload: data.installment,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'createPayment',
          payload: null,
        });
      }
    },
  updatePayment:
    ({ entity, body }) => async (dispatch) => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: 'updatePayment',
      });
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'updatePayment',
        payload: null,
      });

      const data = await salesRequest.updatePayment({ entity, body });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'updatePayment',
          payload: data.installment,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'updatePayment',
          payload: null,
        });
      }
    },
  createMPLink:
    ({ entity, body }) => async (dispatch) => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: 'createMPLink',
      });
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'createMPLink',
        payload: null,
      });

      const data = await salesRequest.createMPLink({ entity, body });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'createMPLink',
          payload: data.redirectUrl,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'createMPLink',
          payload: null,
        });
      }
    },
  search:
    ({ entity, options = {} }) => async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'search',
        payload: null,
      });

      const data = await salesRequest.search({ entity, options });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'search',
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'search',
          payload: null,
        });
      }
    },
  updateOrderOptions: (data) => ({
    type: actionTypes.UPDATE_ORDER_OPTIONS,
    payload: data,
  }),
  updatePaymentOptions: (data) => ({
    type: actionTypes.UPDATE_PAYMENT_OPTIONS,
    payload: data,
  }),
  setCurrentStep: (step) => ({
    type: actionTypes.SET_CURRENT_STEP,
    payload: step,
  }),
  reserveStock:
    ({ jsonData }) => async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'reserveStock',
        payload: null,
      });

      const data = await salesRequest.reserveStock({ jsonData });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'reserveStock',
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'reserveStock',
          payload: null,
        });
      }
    },
};

export default sales;
