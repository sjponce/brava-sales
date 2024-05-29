const contextSelectors = (state) => ({
  isModalOpen: () => state.isModalOpen,
  isPanelOpen: () => state.isPanelOpen,
  isBoxOpen: () => state.isBoxOpen,
});

export default contextSelectors;
