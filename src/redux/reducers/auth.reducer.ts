import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { AuthSubject } from '../../models/session.model';

export const createAnonymousToken = async () => {
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

  await AsyncStorage.setItem('BBOX-user', JSON.stringify(session));

  return session;
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':

      if (action.token) {
        axios.defaults.headers.common.Authorization = `Bearer ${action.token}`;
      } else {
        delete axios.defaults.headers.common.Authorization;
        createAnonymousToken();
      }

      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      axios.defaults.headers.common.Authorization = `Bearer ${action.token}`;
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      delete axios.defaults.headers.common.Authorization;
      createAnonymousToken();
      return {
        ...state,
        isSignout: true,
        userToken: null,
        authSubject: null,
      };
    case 'REFRESH_SETTINGS':
      return {
        ...state,
        isSignout: false,
        authSubject: action.authSubject,
      };
    default:
      throw new Error();
  }
};
