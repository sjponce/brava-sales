import { createSelector } from 'reselect';

const selectCrud = (state) => state.crud;

export const selectCurrentItem = createSelector([selectCrud], (crud) => crud.current);

export const selectListItems = createSelector([selectCrud], (crud) => crud.list);

export const selectListAllItems = createSelector([selectCrud], (crud) => crud.listAll);

export const selectItemById = (itemId) => createSelector(
  selectListItems,
  (list) => list.result.items.find(
    // eslint-disable-next-line no-underscore-dangle
    (item) => item._id === itemId,
  ),
);

export const selectCreatedItem = createSelector([selectCrud], (crud) => crud.create);

export const selectUpdatedItem = createSelector([selectCrud], (crud) => crud.update);

export const selectReadItem = createSelector([selectCrud], (crud) => crud.read);

export const selectDeletedItem = createSelector([selectCrud], (crud) => crud.delete);

export const selectSearchedItems = createSelector([selectCrud], (crud) => crud.search);
