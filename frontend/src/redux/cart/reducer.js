import * as actionTypes from './types';

const INITIAL_KEY_STATE = {
  result: null,
  current: null,
  isLoading: false,
  isSuccess: false,
};

const INITIAL_CART_STATE = {
  products: [],
  open: false,
};

const INITIAL_FILTERS_STATE = {
  open: false,
  selectedTags: {}, // { category: [tagIds] }
};

const INITIAL_STATE = {
  current: {
    result: null,
  },
  cart: { ...INITIAL_CART_STATE },
  search: { ...INITIAL_KEY_STATE, result: [] },
  orderDialog: {
    open: false,
  },
  filters: { ...INITIAL_FILTERS_STATE },
};

// eslint-disable-next-line default-param-last
const cartReducer = (state = INITIAL_STATE, action) => {
  const { payload, keyState } = action;
  switch (action.type) {
    case actionTypes.RESET_STATE:
      return INITIAL_STATE;
    case actionTypes.CURRENT_ITEM:
      return {
        ...state,
        current: {
          result: payload,
        },
      };
    case actionTypes.REQUEST_LOADING:
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          isLoading: true,
        },
      };
    case actionTypes.REQUEST_FAILED:
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          isLoading: false,
          isSuccess: false,
        },
      };
    case actionTypes.REQUEST_SUCCESS:
      return {
        ...state,
        [keyState]: {
          result: payload,
          isLoading: false,
          isSuccess: true,
        },
      };
    case actionTypes.CURRENT_ACTION:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_KEY_STATE,
          current: payload,
        },
      };
    case actionTypes.RESET_ACTION:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_STATE[keyState],
        },
      };
    case actionTypes.ADD_TO_CART: {
      const productExists = state.cart.products.some(
        (product) => product.id === payload.id && product.color === payload.color
      );

      if (productExists) {
        return state;
      }
      return {
        ...state,
        cart: {
          ...state.cart,
          products: [...state.cart.products, payload],
        },
      };
    }
    case actionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        cart: {
          ...state.cart,
          products: state.cart.products.filter(
            (product) => !(product.id === payload.id && product.color === payload.color)
          ),
        },
      };
    case actionTypes.UPDATE_PRODUCT_IN_CART:
      return {
        ...state,
        cart: {
          ...state.cart,
          products: state.cart.products.map((product) => {
            if (product.id === payload.id && product.color === payload.color) {
              return {
                ...product,
                sizes: payload.sizes,
              };
            }
            return product;
          }),
        },
      };
    case actionTypes.RESET_CART:
      return {
        ...state,
        cart: {
          ...INITIAL_CART_STATE,
        },
      };
    case actionTypes.OPEN_CART:
      return {
        ...state,
        cart: {
          ...state.cart,
          open: !state.cart.open,
        },
      };
    case actionTypes.OPEN_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          open: !state.filters.open,
        },
      };
    case actionTypes.SELECT_TAG_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          selectedTags: {
            ...state.filters.selectedTags,
            [payload.category]: [
              ...(state.filters.selectedTags[payload.category] || []),
              payload.tagId,
            ],
          },
        },
      };
    case actionTypes.DESELECT_TAG_FILTER: {
      const updatedTagsForCategory = (
        state.filters.selectedTags[payload.category] || []
      ).filter((id) => id !== payload.tagId);

      const newSelectedTags = { ...state.filters.selectedTags };

      // Si la categoría queda vacía, eliminarla
      if (updatedTagsForCategory.length === 0) {
        delete newSelectedTags[payload.category];
      } else {
        newSelectedTags[payload.category] = updatedTagsForCategory;
      }

      return {
        ...state,
        filters: {
          ...state.filters,
          selectedTags: newSelectedTags,
        },
      };
    }
    case actionTypes.RESET_TAG_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          selectedTags: {},
        },
      };
    case actionTypes.OPEN_ORDER_DIALOG:
      return {
        ...state,
        orderDialog: {
          open: !state.orderDialog.open,
        },
      };
    default:
      return state;
  }
};
export default cartReducer;
