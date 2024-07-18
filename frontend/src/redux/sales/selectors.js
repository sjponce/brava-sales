import { createSelector } from 'reselect';

const selectSales = (state) => state.sales;

export const selectCurrentItem = createSelector([selectSales], (sales) => sales.current);

export const selectListItems = createSelector([selectSales], (sales) => sales.list);

export const selectListAllItems = createSelector([selectSales], (sales) => sales.listAll);

export const selectItemById = (itemId) => createSelector(
  selectListItems,
  (list) => list.result.items.find(
    // eslint-disable-next-line no-underscore-dangle
    (item) => item._id === itemId,
  ),
);

export const selectCreatedItem = createSelector([selectSales], (sales) => sales.create);

export const selectUpdatedItem = createSelector([selectSales], (sales) => sales.update);

export const selectReadItem = createSelector([selectSales], (sales) => sales.read);

export const selectDeletedItem = createSelector([selectSales], (sales) => sales.delete);

export const selectSearchedItems = createSelector([selectSales], (sales) => sales.search);