import React, {
  useReducer, useEffect, useMemo, useState,
} from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  View, Image, Linking, LogBox,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Config from 'react-native-config';

import BoxScreen from './src/screens/box/box.screen';
import LoginScreen from './src/screens/login.screen';
import AuthContext from './src/shared/auth.context';
import { lightTheme } from './src/shared/themes';
import HomeScreen from './src/screens/home.screen';
import SignupScreen from './src/screens/signup.screen';
import CreateBoxScreen from './src/screens/create-box.screen';
import JoinBoxScreen from './src/screens/join-box.screen';

const AuthStack = createStackNavigator();
const RootStack = createStackNavigator();

const useInitialUrl = () => {
  const [initialBoxToken, setInitialBoxToken] = useState(null);

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();

      if (initialUrl) {
        if (/box\/(\w{24})/gmi.test(initialUrl)) {
          const boxToken = /box\/(\w{24})/gmi.exec(initialUrl)[1];
          setInitialBoxToken(boxToken);
        }
      }
    };

    getUrlAsync();
  }, []);

  return { initialBoxToken };
};

export default function App() {
  LogBox.ignoreAllLogs();
  const [isAppReady, setAppReadiness] = useState(false);

  const { initialBoxToken } = useInitialUrl();

  const createAnonymousToken = async () => {
    let session = {};
    const values = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let anonymousToken = '';

    // eslint-disable-next-line no-plusplus
    for (let i = 20; i > 0; --i) {
      anonymousToken += values[Math.round(Math.random() * (values.length - 1))];
    }

    session = {
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

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          console.log('RESTORING TOKEN: ', action);

          if (action.token) {
            axios.defaults.headers.common.Authorization = `Bearer ${action.token}`;
          } else {
            delete axios.defaults.headers.common.Authorization;
            createAnonymousToken();
          }

          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          axios.defaults.headers.common.Authorization = `Bearer ${action.token}`;
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          delete axios.defaults.headers.common.Authorization;
          createAnonymousToken();
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        default:
          return {};
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken = null;

      try {
        userToken = await AsyncStorage.getItem('BBOX-token');
        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Restoring token failed.');
      }

      setTimeout(() => {
        setAppReadiness(true);
      }, 2000);
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (data: { email: string; password: string; }) => {
        try {
          const response = await axios.post(`${Config.API_URL}/auth/login`,
            {
              mail: data.email,
              password: data.password,
            });
          await AsyncStorage.setItem('BBOX-token', response.data.bearer);
          await AsyncStorage.setItem('BBOX-expires_at', JSON.stringify(response.data.expiresIn));
          await AsyncStorage.setItem('BBOX-user', JSON.stringify(response.data.subject));
          dispatch({ type: 'SIGN_IN', token: response.data.bearer });
        } catch (error) {
          throw new Error(error.response.data);
        }
      },
      signUp: async (data) => {
        try {
          const response = await axios.post(`${Config.API_URL}/auth/signup`,
            {
              name: data.username,
              mail: data.email,
              password: data.password,
            });
          await AsyncStorage.setItem('BBOX-token', response.data.bearer);
          await AsyncStorage.setItem('BBOX-expires_at', JSON.stringify(response.data.expiresIn));
          await AsyncStorage.setItem('BBOX-user', JSON.stringify(response.data.subject));
          dispatch({ type: 'SIGN_IN', token: response.data.bearer });
        } catch (error) {
          throw new Error(error.response.data);
        }
      },
      signOut: async () => {
        await AsyncStorage.removeItem('BBOX-token');
        await AsyncStorage.removeItem('BBOX-expires_at');
        await AsyncStorage.removeItem('BBOX-user');
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    [],
  );

  const ActiveTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...lightTheme.colors,
    },
  };

  const AuthFlow = () => (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="SignIn"
        component={LoginScreen}
        options={{
          animationTypeForReplace: 'pop',
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{
          animationTypeForReplace: 'pop',
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );

  const RootFlow = () => (
    <RootStack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: '#191919' },
      }}
      initialRouteName={initialBoxToken ? 'Box' : 'Home'}
      mode="modal"
    >
      <RootStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="SignIn"
        component={LoginScreen}
        options={{
          animationTypeForReplace: 'pop',
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{
          animationTypeForReplace: 'pop',
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="Box"
        component={BoxScreen}
        initialParams={{ boxToken: initialBoxToken || null }}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="CreateBox"
        component={CreateBoxScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="JoinBox"
        component={JoinBoxScreen}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );

  if (!isAppReady) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={require('./assets/splash.png')}
          style={{ height: '100%', width: '100%' }}
        />
      </View>
    );
  }

  return (
    <PaperProvider>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer theme={ActiveTheme}>
          <RootFlow />
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}
