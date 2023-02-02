import { types } from '../Action/actionTypes';
import { logfunction } from '../../helpers/FunctionHelper';

const initialState = {
  USER_AUTH: false,
  USER_DATA: {},
  PROFILE_BUTTON_IMAGES: [],
  PROFILE_SPECIAL_ITEMS: [],
};

export default (state = initialState, action) => {
  const { payload } = action;
  logfunction('PAYLOAD IN REDUCER AUTH', payload);
  logfunction('PAYLOAD IN TYPE AUTH', action.type);

  switch (action.type) {
    case types.AUTH_STATUS:
      return {
        ...state,
        USER_AUTH: payload.status,
      };
    case types.AUTH_DATA:
      return {
        ...state,
        USER_DATA: payload.customerData,
      };
    case types.PROFILE_BUTTON_IMAGE:
      return {
        ...state,
        PROFILE_BUTTON_IMAGES: payload,
      };
    case types.PROFILE_SPECIAL_ITEMS:
      return {
        ...state,
        PROFILE_SPECIAL_ITEMS: payload,
      };
    default:
      return state;
  }
};
