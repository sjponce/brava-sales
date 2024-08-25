import { selectItemById } from './selectors';
import * as actionTypes from './types';
import docs from './actions';

describe('docs actions', () => {
  test('test_reset_state', () => {
    const dispatch = jest.fn();
    docs.resetState()(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: actionTypes.RESET_STATE,
    });
  });

  test('test_reset_action', () => {
    const dispatch = jest.fn();
    const actionType = 'TEST_ACTION';
    docs.resetAction({ actionType })(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: actionTypes.RESET_ACTION,
      keyState: actionType,
      payload: null,
    });
  });

  test('test_current_item', () => {
    const dispatch = jest.fn();
    const data = { id: '1', name: 'Test Item' };
    docs.currentItem({ data })(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: actionTypes.CURRENT_ITEM,
      payload: { ...data },
    });
  });

  test('test_current_action', () => {
    const dispatch = jest.fn();
    const actionType = 'TEST_ACTION';
    const data = { id: '1', name: 'Test Item' };
    docs.currentAction({ actionType, data })(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: actionTypes.CURRENT_ACTION,
      keyState: actionType,
      payload: { ...data },
    });
  });
});
