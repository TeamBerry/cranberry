/* eslint-disable import/prefer-default-export */
import { AuthSubject } from '../../models/session.model';

const initialState: AuthSubject = null;

export const userReducer = (
  state = initialState,
  action: { type: string, payload: AuthSubject },
): AuthSubject => {
  switch (action.type) {
    case 'UPDATE_USER': {
      return action.payload;
    }
    default:
      return state;
  }
};
