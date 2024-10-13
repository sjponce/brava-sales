import ecommerceRequest from '@/request/ecommerceRequest';
import * as actionTypes from './types';

const cart = {
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
  addToCart: (data) => ({
    type: actionTypes.ADD_TO_CART,
    payload: data,
  }),
  removeFromCart: (data) => ({
    type: actionTypes.REMOVE_FROM_CART,
    payload: data,
  }),
  updateProductInCart: (data) => ({
    type: actionTypes.UPDATE_PRODUCT_IN_CART,
    payload: data,
  }),
  saveCart:
    ({ jsonData }) => async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'saveCart',
        payload: null,
      });

      const savedCart = await ecommerceRequest.saveCart({ jsonData });

      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        keyState: 'saveCart',
        payload: savedCart,
      });
    },
  openCart: () => ({
    type: actionTypes.OPEN_CART,
  }),
  openFilters: () => ({
    type: actionTypes.OPEN_FILTERS,
  }),
  openOrderDialog: () => ({
    type: actionTypes.OPEN_ORDER_DIALOG,
  }),
};

export default cart;
