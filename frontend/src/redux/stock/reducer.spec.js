import stockReducer from './reducer';
import * as actionTypes from './types';

describe('stockReducer', () => {
  const INITIAL_STATE = {
    current: {
      result: null,
    },
    list: {
      result: {
        items: [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 1,
          showSizeChanger: false,
        },
      },
      isLoading: false,
      isSuccess: false,
    },
    create: {
      result: null,
      current: null,
      isLoading: false,
      isSuccess: false,
    },
    update: {
      result: null,
      current: null,
      isLoading: false,
      isSuccess: false,
    },
    delete: {
      result: null,
      current: null,
      isLoading: false,
      isSuccess: false,
    },
    read: {
      result: null,
      current: null,
      isLoading: false,
      isSuccess: false,
    },
    search: {
      result: [],
      current: null,
      isLoading: false,
      isSuccess: false,
    },
  };

  it('should update the current state with the payload when the action type is CURRENT_ITEM', () => {
    const payload = { id: 1, name: 'Test Item' };
    const action = { type: actionTypes.CURRENT_ITEM, payload };
    const newState = stockReducer(INITIAL_STATE, action);
    expect(newState.current.result).toEqual(payload);
  });

  it('should set isLoading to true for the specified keyState when the action type is REQUEST_LOADING', () => {
    const keyState = 'list';
    const action = { type: actionTypes.REQUEST_LOADING, keyState };
    const newState = stockReducer(INITIAL_STATE, action);
    expect(newState[keyState].isLoading).toBe(true);
  });
});
