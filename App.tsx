import React, {
  useReducer, useEffect, useMemo, useState,
} from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { HomeScreen } from './src/screens/home.screen';
import { BoxScreen } from './src/screens/box/box.screen';
import LoginScreen from './src/screens/login.screen';
import AuthContext from './src/shared/auth.context';
import { lightTheme } from './src/shared/themes';
import SignupScreen from './src/screens/signup.screen';
import CreateBoxScreen from './src/screens/create-box.screen';

const Stack = createStackNavigator();

export default function App({ navigation }) {
  // eslint-disable-next-line no-console
  console.disableYellowBox = true;
  const [isAppReady, setAppReadiness] = useState(false);

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          axios.defaults.headers.common.Authorization = `Bearer ${action.token}`;
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
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Restoring token failed.');
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
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
          const response = await axios.post('https://araza.berrybox.tv/auth/login',
            {
              mail: data.email,
              password: data.password,
            });
          await AsyncStorage.setItem('BBOX-token', response.data.bearer);
          await AsyncStorage.setItem('BBOX-expires_at', JSON.stringify(response.data.expiresIn));
          await AsyncStorage.setItem('BBOX-user', JSON.stringify(response.data.subject));
          dispatch({ type: 'SIGN_IN', token: response.data.bearer });
        } catch (error) {
          throw new Error(error.message);
        }
      },
      signUp: async (data) => {
        try {
          const response = await axios.post('https://araza.berrybox.tv/auth/signup',
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
          throw new Error(error.message);
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
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={LoginScreen}
        options={{
          animationTypeForReplace: 'pop',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={{
          animationTypeForReplace: 'pop',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );

  const MainFlow = () => (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: '#191919' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Box"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <BoxScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );

  const RootStack = createStackNavigator();

  const RootFlow = () => (
    <RootStack.Navigator mode="modal">
      <RootStack.Screen
        name="Main"
        component={MainFlow}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="CreateBox"
        component={CreateBoxScreen}
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
          {state.userToken === null ? (
            <AuthFlow />
          ) : (
            <RootFlow />
          )}
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}
