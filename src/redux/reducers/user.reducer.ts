/* eslint-disable import/prefer-default-export */
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { AuthSubject } from '../../models/session.model';
import {
  RESTORE_TOKEN, SIGN_IN, SIGN_OUT, UPDATE_USER,
} from '../actionTypes';

export type StoreType = {
    userToken: string,
    user: AuthSubject
}

const initialState: StoreType = {
  userToken: null,
  user: null,
};

export const createAnonymousSession = (): AuthSubject => {
  const values = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let anonymousToken = '';

  // eslint-disable-next-line no-plusplus
  for (let i = 20; i > 0; --i) {
    anonymousToken += values[Math.round(Math.random() * (values.length - 1))];
  }

  const session: AuthSubject = {
    _id: `user-${anonymousToken}`,
    name: null,
    mail: null,
    settings: {
      theme: 'dark',
      picture: null,
      color: '#DF62A9',
      isColorblind: false,
    },
  };

  AsyncStorage.setItem('BBOX-user', JSON.stringify(session));

  return session;
};

export const userReducer = (state = initialState, action): StoreType => {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    case RESTORE_TOKEN:
      if (action.payload.userToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${action.payload.userToken}`;
      } else {
        delete axios.defaults.headers.common.Authorization;
      }

      return {
        ...state,
        userToken: action.payload.userToken ?? null,
        user: action.payload.user ?? createAnonymousSession(),
      };
    case SIGN_IN:
      axios.defaults.headers.common.Authorization = `Bearer ${action.payload.userToken}`;
      return {
        ...state,
        userToken: action.payload.userToken,
        user: action.payload.user,
      };
    case SIGN_OUT:
      delete axios.defaults.headers.common.Authorization;
      return {
        ...state,
        user: createAnonymousSession(),
        userToken: null,
      };
    default:
      return state;
  }
};
