import * as actionTypes from './types';

export const initialState = {
  currentApp: 'default',
};

export function contextReducer(state, action) {
  switch (action.type) {
    case actionTypes.CHANGE_APP:
      return {
        ...state,
        currentApp: action.playload,
      };
    case actionTypes.DEFAULT_APP:
      return {
        ...state,
        currentApp: 'default',
      };

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
