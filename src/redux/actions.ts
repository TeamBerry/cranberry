/* eslint-disable import/prefer-default-export */
import { AuthSubject } from '../models/session.model';

export const updateUser = (settings: AuthSubject['settings']) => ({
  type: 'UPDATE_USER',
  payload: settings,
});
