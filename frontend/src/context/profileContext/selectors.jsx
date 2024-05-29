const contextSelectors = (state) => ({
  isModalOpen: () => state.isModalOpen,
  isPanelOpen: () => state.isPanelOpen,
});

export default contextSelectors;
