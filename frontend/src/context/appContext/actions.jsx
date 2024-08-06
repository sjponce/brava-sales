import * as actionTypes from './types';

const contextActions = (dispatch) => ({
  app: {
    open: (appName) => {
      dispatch({ type: actionTypes.CHANGE_APP, playload: appName });
    },
    default: () => {
      dispatch({ type: actionTypes.DEFAULT_APP });
    },
  },
});

export default contextActions;
