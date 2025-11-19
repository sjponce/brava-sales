export const selectTravelsList = (state) =>
  state.travels?.listAll?.result?.items?.result || [];
export const selectTravelsLoading = (state) =>
  !!state.travels?.listAll?.isLoading;


