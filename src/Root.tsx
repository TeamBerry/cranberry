import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, {
  useEffect, useMemo, useState,
} from 'react';
import {
  Linking, View, Image, Animated,
} from 'react-native';
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
import { useTheme } from './shared/theme.context';

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
  const { colors } = useTheme();

  useEffect(() => {
    const bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('BBOX-token') ?? null;
      const user: AuthSubject = JSON.parse(await AsyncStorage.getItem('BBOX-user')) ?? null;

      dispatch({
        type: RESTORE_TOKEN,
        payload: {
          user,
          userToken,
        },
      });

      setTimeout(() => {
        setAppReadiness(true);
      }, 1000);
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
        cardStyle: { backgroundColor: colors.deepBackground, opacity: 1 },
        headerShown: false,
        cardStyleInterpolator: ({
          current, next, inverted, layouts: { screen },
        }) => ({
          cardStyle: {
            transform: [
              {
                translateX: Animated.multiply(
                  Animated
                    .add(
                      current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                      }),
                      next ? next.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                      }) : 0,
                    ).interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [
                        screen.width,
                        0,
                        screen.width * -0.3,
                      ],
                      extrapolate: 'clamp',
                    }),
                  inverted,
                ),
              },
            ],
          },
        }),
      }}
      mode="modal"
      initialRouteName="Settings"
    >
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
      />
      <SettingsStack.Screen
        name="PicturePreview"
        component={picturePreviewScreen}
      />
      <SettingsStack.Screen
        name="PictureDelete"
        component={pictureDeleteScreen}
      />
      <SettingsStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />
      <SettingsStack.Screen
        name="ColorSelect"
        component={ColorSelectScreen}
      />
    </SettingsStack.Navigator>
  );

  const RootFlow = () => (
    <RootStack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: colors.deepBackground, opacity: 1 },
        headerShown: false,
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
          overlayStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
              extrapolate: 'clamp',
            }),
          },
        }),
      }}
      initialRouteName={inviteLink ? 'ParseLink' : 'Home'}
      mode="modal"
    >
      <RootStack.Screen
        name="Home"
        component={HomeScreen}
      />
      <RootStack.Screen
        name="ParseLink"
        component={ParseLinkScreen}
        initialParams={{ initialUrl: inviteLink || null }}
      />
      { userToken === null ? (
        <>
          <RootStack.Screen
            name="SignIn"
            component={LoginScreen}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
          <RootStack.Screen
            name="SignUp"
            component={SignupScreen}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
        </>
      ) : (
        <RootStack.Screen
          name="Settings"
          component={SettingsSpace}
        />
      )}
      <RootStack.Screen
        name="Box"
        component={BoxScreen}
      />
      <RootStack.Screen
        name="CreateBox"
        component={CreateBoxScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
        }}
      />
      <RootStack.Screen
        name="JoinBox"
        component={JoinBoxScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
        }}
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
    <PaperProvider>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <RootFlow />
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
};

export default connect((state) => getToken(state))(Root);
