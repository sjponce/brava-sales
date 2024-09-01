import { createSelector } from 'reselect';

const selectDocs = (state) => state.docs;

export const selectCurrentItem = createSelector([selectDocs], (docs) => docs.current);

export const selectGeneratedItems = createSelector(
  [selectDocs],
  (docs) => docs.generate,
);
