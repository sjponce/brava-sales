import { createSelector } from 'reselect';

const selectSales = (state) => state.sales;

export const selectCurrentItem = createSelector([selectSales], (sales) => sales.current);

export const selectListItems = createSelector([selectSales], (sales) => sales.list);

export const selectListAllItems = createSelector([selectSales], (sales) => sales.listAll);

export const selectItemById = (itemId) => createSelector(
  selectListItems,
  (list) => list.result.items.find((item) => item.id === itemId),
);

export const selectUpdatedItem = createSelector([selectSales], (sales) => sales.update);

export const selectReadItem = createSelector([selectSales], (sales) => sales.read);
