import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, {
  useEffect, useMemo, useState,
} from 'react';
import { Linking, View, Image } from 'react-native';
import Config from 'react-native-config';
import { connect, useDispatch } from 'react-redux';
import axios from 'axios';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthSubject } from './models/session.model';
import { RESTORE_TOKEN, SIGN_IN, SIGN_OUT } from './redux/actionTypes';
import JoinBoxScreen from './screens/join-box.screen';
import LoginScreen from './screens/login.screen';
import ParseLinkScreen from './screens/parse-link.screen';
import SignupScreen from './screens/signup.screen';
import AuthContext from './shared/auth.context';
import { ThemeProvider } from './shared/theme.context';

import BoxScreen from './screens/box/box.screen';
import HomeScreen from './screens/home.screen';
import SettingsScreen from './screens/settings/settings.screen';
import ColorSelectScreen from './screens/settings/color-select.screen';
import ChangePasswordScreen from './screens/settings/change-password.screen';
import CreateBoxScreen from './screens/create-box.screen';
import { getToken } from './redux/selectors';
import picturePreviewScreen from './screens/settings/picture-preview.screen';
import pictureDeleteScreen from './screens/settings/picture-delete.screen';

const RootStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const useInitialUrl = () => {
  const [inviteLink, setInviteLink] = useState(null as string);

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();

      if (initialUrl && /(box)\/(\w{24})|(i|invite)\/(\w{8})/gmi.test(initialUrl)) {
        setInviteLink(initialUrl);
      }
    };

    getUrlAsync();
  }, []);

  return { inviteLink };
};

const Root = (props: { userToken: string }) => {
  const [isAppReady, setAppReadiness] = useState(false);
  const { inviteLink } = useInitialUrl();
  const dispatch = useDispatch();
  const { userToken } = props;

  useEffect(() => {
    const bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('BBOX-token') ?? null;
      const session: AuthSubject = JSON.parse(await AsyncStorage.getItem('BBOX-user')) ?? null;

      dispatch({
        type: RESTORE_TOKEN,
        payload: {
          user: session,
          userToken,
        },
      });

      setAppReadiness(true);
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
          dispatch({
            type: SIGN_IN,
            payload: {
              user: response.data.subject,
              userToken: response.data.bearer,
            },
          });
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
          dispatch({
            type: SIGN_IN,
            payload: {
              user: response.data.subject,
              userToken: response.data.bearer,
            },
          });
        } catch (error) {
          throw new Error(error.response.data);
        }
      },
      signOut: async () => {
        await AsyncStorage.removeItem('BBOX-token');
        await AsyncStorage.removeItem('BBOX-expires_at');
        await AsyncStorage.removeItem('BBOX-user');
        dispatch({ type: SIGN_OUT });
      },
    }),
    [],
  );

  const SettingsSpace = () => (
    <SettingsStack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: '#191919', opacity: 1 },
        headerShown: false,
      }}
      mode="card"
      initialRouteName="Settings"
    >
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          animationTypeForReplace: 'pop',
          headerShown: false,
        }}
      />
      <SettingsStack.Screen
        name="PicturePreview"
        component={picturePreviewScreen}
        options={{
          animationTypeForReplace: 'pop',
          headerShown: false,
        }}
      />
      <SettingsStack.Screen
        name="PictureDelete"
        component={pictureDeleteScreen}
        options={{
          animationTypeForReplace: 'pop',
          headerShown: false,
        }}
      />
      <SettingsStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          animationTypeForReplace: 'push',
          headerShown: false,
        }}
      />
      <SettingsStack.Screen
        name="ColorSelect"
        component={ColorSelectScreen}
        options={{
          animationTypeForReplace: 'push',
          headerShown: false,
        }}
      />
    </SettingsStack.Navigator>
  );

  const RootFlow = () => (
    <RootStack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: '#191919', opacity: 1 },
        headerShown: false,
      }}
      initialRouteName={inviteLink ? 'ParseLink' : 'Home'}
      mode="card"
      detachInactiveScreens
    >
      <RootStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="ParseLink"
        component={ParseLinkScreen}
        initialParams={{ initialUrl: inviteLink || null }}
        options={{
          headerShown: false,
        }}
      />
      { userToken === null ? (
        <>
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
        </>
      ) : (
        <RootStack.Screen
          name="Settings"
          component={SettingsSpace}
          options={{
            headerShown: false,
            animationTypeForReplace: 'push',
          }}
        />
      )}
      <RootStack.Screen
        name="Box"
        component={BoxScreen}
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
          source={require('../assets/splash.png')}
          style={{ height: '100%', width: '100%' }}
        />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <PaperProvider>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer>
            <RootFlow />
          </NavigationContainer>
        </AuthContext.Provider>
      </PaperProvider>
    </ThemeProvider>
  );
};

export default connect((state) => getToken(state))(Root);
