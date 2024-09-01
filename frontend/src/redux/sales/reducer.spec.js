import salesReducer from './reducer';
import * as actionTypes from './types';

describe('salesReducer', () => {
  const INITIAL_KEY_STATE = {
    result: null,
    current: null,
    isLoading: false,
    isSuccess: false,
  };

  const INITIAL_STEP_STATE = {
    currentStep: 0,
    options: {
      orderOptions: {},
      paymentOptions: { discountType: 'discount' },
    },
  };

  const INITIAL_STATE = {
    current: {
      result: null,
    },
    createPayment: {
      current: null,
      isLoading: false,
      isSuccess: false,
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
    stepper: INITIAL_STEP_STATE,
    create: INITIAL_KEY_STATE,
    update: INITIAL_KEY_STATE,
    delete: INITIAL_KEY_STATE,
    read: INITIAL_KEY_STATE,
    search: { ...INITIAL_KEY_STATE, result: [] },
  };

  it('should return the initial state when the action type is RESET_STATE', () => {
    const action = { type: actionTypes.RESET_STATE };
    const newState = salesReducer(undefined, action);
    expect(newState).toEqual(INITIAL_STATE);
  });

  it('should update the current state with the payload when the action type is CURRENT_ITEM', () => {
    const payload = { id: 1, name: 'Test Item' };
    const action = { type: actionTypes.CURRENT_ITEM, payload };
    const newState = salesReducer(INITIAL_STATE, action);
    expect(newState.current.result).toEqual(payload);
  });

  it('should set isLoading to true for the specified keyState when the action type is REQUEST_LOADING', () => {
    const keyState = 'list';
    const action = { type: actionTypes.REQUEST_LOADING, keyState };
    const newState = salesReducer(INITIAL_STATE, action);
    expect(newState[keyState].isLoading).toBe(true);
  });
});
