export const selectVehiclesList = (state) => state.vehicles?.listAll?.result?.items?.result || [];
export const selectVehiclesLoading = (state) => !!state.vehicles?.listAll?.isLoading;
