import { createSelector } from 'reselect';

const selectStock = (state) => state.stock;

export const selectCurrentItem = createSelector([selectStock], (stock) => stock.current);

export const selectListItems = createSelector([selectStock], (stock) => stock.list);

export const selectListAllItems = createSelector([selectStock], (stock) => stock.listAll);

export const selectItemById = (itemId) => createSelector(
  selectListItems,
  (list) => list.result.items.find((item) => item.id === itemId),
);

export const selectUpdatedItem = createSelector([selectStock], (stock) => stock.update);

export const selectReadItem = createSelector([selectStock], (stock) => stock.read);
