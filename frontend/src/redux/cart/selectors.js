import { createSelector } from 'reselect';

const selectCart = (state) => state.cart;

export const selectCurrentItem = createSelector([selectCart], (cart) => cart.current);

export const selectOpenCart = (state) => state.cart.cart.open;

export const selectCartProducts = (state) => state.cart.cart.products;

export const selectOpenFilters = (state) => state.cart.filters.open;

export const selectSelectedTags = (state) => state.cart.filters.selectedTags;

export const selectSelectedTagsFlat = (state) => {
  const selectedTags = state.cart.filters.selectedTags;
  return Object.values(selectedTags).flat();
};

export const selectOpenOrderDialog = (state) => state.cart.orderDialog.open;
