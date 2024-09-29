import { createSelector } from 'reselect';

const selectCart = (state) => state.cart;

export const selectCurrentItem = createSelector([selectCart], (cart) => cart.current);

export const selectOpenCart = (state) => state.cart.cart.open;

export const selectCartProducts = (state) => state.cart.cart.products;
