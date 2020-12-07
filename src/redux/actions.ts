/* eslint-disable import/prefer-default-export */
import { AuthSubject } from '../models/session.model';
import { UPDATE_USER } from './actionTypes';

export const updateUser = (user: AuthSubject) => ({
  type: UPDATE_USER,
  payload: user,
});
