/* eslint-disable import/prefer-default-export */
import { AuthSubject } from '../../models/session.model';
import { UPDATE_USER } from '../actionTypes';

export type StoreType = {
    userToken: string,
    user: AuthSubject
}

const initialState: StoreType = {
  userToken: null,
  user: null,
};

export const userReducer = (state = initialState, action): StoreType => {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};
