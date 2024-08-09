import { selectCurrentItem, selectGeneratedItems } from './selectors';

describe('docs selectors', () => {
  const mockState = {
    docs: {
      current: {
        result: { id: '1', name: 'Current Item' },
      },
      generate: {
        result: [
          { id: '2', name: 'Generated Item 1' },
          { id: '3', name: 'Generated Item 2' },
        ],
      },
    },
  };

  test('test_select_current_item', () => {
    const selectedItem = selectCurrentItem(mockState);
    expect(selectedItem).toEqual({ result: { id: '1', name: 'Current Item' } });
  });

  test('test_select_generated_items', () => {
    const selectedItems = selectGeneratedItems(mockState);
    expect(selectedItems).toEqual({
      result: [
        { id: '2', name: 'Generated Item 1' },
        { id: '3', name: 'Generated Item 2' },
      ],
    });
  });

  test('test_select_current_item_empty_state', () => {
    const emptyState = { docs: { current: { result: null } } };
    const selectedItem = selectCurrentItem(emptyState);
    expect(selectedItem).toEqual({ result: null });
  });

  test('test_select_generated_items_empty_state', () => {
    const emptyState = { docs: { generate: null } };
    const selectedItems = selectGeneratedItems(emptyState);
    expect(selectedItems).toBeNull();
  });
});
