import { selectItemById } from './selectors';

describe('selectItemById', () => {
  const state = {
    stock: {
      list: {
        result: {
          items: [
            { _id: '1', name: 'Item 1' },
            { _id: '2', name: 'Item 2' },
          ],
        },
      },
    },
  };

  test('test_select_item_by_invalid_id', () => {
    const itemId = '3';
    const selectedItem = selectItemById(itemId)(state);
    expect(selectedItem).toBeUndefined();
  });

  test('test_select_item_from_empty_list', () => {
    const emptyState = {
      stock: {
        list: {
          result: {
            items: [],
          },
        },
      },
    };
    const itemId = '1';
    const selectedItem = selectItemById(itemId)(emptyState);
    expect(selectedItem).toBeUndefined();
  });
});
