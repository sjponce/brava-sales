import docsReducer from './reducer';
import * as actionTypes from './types';

describe('docsReducer', () => {
  const initialState = {
    current: {
      result: null,
    },
    docs: {
      result: null,
      current: null,
      isLoading: false,
      isSuccess: false,
    },
  };

  test('test_initial_state', () => {
    expect(docsReducer(undefined, {})).toEqual(initialState);
  });

  test('test_reset_state', () => {
    const action = { type: actionTypes.RESET_STATE };
    expect(docsReducer({}, action)).toEqual(initialState);
  });

  test('test_current_item', () => {
    const payload = { id: '1', name: 'Test Item' };
    const action = { type: actionTypes.CURRENT_ITEM, payload };
    const expectedState = {
      ...initialState,
      current: { result: payload },
    };
    expect(docsReducer(initialState, action)).toEqual(expectedState);
  });

  test('test_request_loading', () => {
    const keyState = 'docs';
    const action = { type: actionTypes.REQUEST_LOADING, keyState };
    const expectedState = {
      ...initialState,
      [keyState]: { ...initialState[keyState], isLoading: true },
    };
    expect(docsReducer(initialState, action)).toEqual(expectedState);
  });

  test('test_request_failed', () => {
    const keyState = 'docs';
    const action = { type: actionTypes.REQUEST_FAILED, keyState };
    const expectedState = {
      ...initialState,
      [keyState]: { ...initialState[keyState], isLoading: false, isSuccess: false },
    };
    expect(docsReducer(initialState, action)).toEqual(expectedState);
  });

  test('test_request_success', () => {
    const keyState = 'docs';
    const payload = { id: '1', name: 'Test Item' };
    const action = { type: actionTypes.REQUEST_SUCCESS, keyState, payload };
    const expectedState = {
      ...initialState,
      [keyState]: { result: payload, isLoading: false, isSuccess: true },
    };
    expect(docsReducer(initialState, action)).toEqual(expectedState);
  });
});
