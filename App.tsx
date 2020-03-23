import React, { useReducer, useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/home.screen';
import { BoxScreen } from './src/screens/box/box.screen';
import LoginScreen from './src/screens/login.screen';
import { AsyncStorage, View, Image } from "react-native";
import AuthContext from './src/shared/auth.context';
import axios from 'axios';
import * as Font from 'expo-font';
import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
// import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();

export default function App({ navigation }) {
    const [isSplashReady, setSplash] = useState(false)
    const [isAppReady, setApp] = useState(false)

    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        isLoading: false
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        userToken: action.token
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        userToken: null
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userToken: null
        }
    )

    useEffect(() => {
        SplashScreen.preventAutoHide();

        const bootstrapAsync = async () => {
            let userToken = null;

            try {
                userToken = await AsyncStorage.getItem('BBOX-token')
            } catch (e) {
                console.log('Restoring token failed.')
            }

            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        }

        bootstrapAsync();
    }, []);

    const authContext = useMemo(
        () => ({
            signIn: async data => {
                axios.post(`https://araza.berrybox.tv/auth/login`,
                    {
                        mail: data.email,
                        password: data.password
                    }
                ).then(async (response) => {
                    await AsyncStorage.setItem('BBOX-token', response.data.bearer)
                    await AsyncStorage.setItem('BBOX-expires_at', JSON.stringify(response.data.expiresIn))
                    await AsyncStorage.setItem('BBOX-user', JSON.stringify(response.data.subject))
                    dispatch({type: 'SIGN_IN', token: response.data.bearer})
                }).catch((error) => {
                    console.log(error)
                })
            },
            signOut: async () => {
                await AsyncStorage.removeItem('BBOX-token')
                await AsyncStorage.removeItem('BBOX-expires_at')
                await AsyncStorage.removeItem('BBOX-user')
                dispatch({ type: 'SIGN_OUT' })
            }
        }),
        []
    );


    const _cacheSplashResourcesAsync = async () => {
        const img = require('./assets/splash.png');

        return Asset.fromModule(img).downloadAsync();
    }

    const _cacheResourcesAsync = async () => {
        await Font.loadAsync({
            'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
            'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
            'Montserrat-ExtraBold': require('./assets/fonts/Montserrat-ExtraBold.ttf'),
            'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
            'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
            'Montserrat-Thin': require('./assets/fonts/Montserrat-Thin.ttf')
        });

        SplashScreen.hide();
        setApp(true);
      };

    if (!isSplashReady) {
        return (
            <AppLoading
                startAsync={_cacheSplashResourcesAsync}
                onFinish={() => setSplash(true)}
                onError={console.warn}
                autoHideSplash={false}
            />
        )
    }

    if (!isAppReady) {
        return (
            <View style={{flex: 1}}>
            <Image
                    source={require('./assets/splash.png')}
                    onLoadEnd={_cacheResourcesAsync}
                />
            </View>
        )
    } else {


    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                <Stack.Navigator>
                    {state.userToken === null ? (
                        <Stack.Screen
                            name="SignIn"
                            component={LoginScreen}
                            options={{
                                animationTypeForReplace: 'pop',
                                headerShown: false
                            }}
                        />
                    ) : (
                        <>
                            <Stack.Screen
                                name="Home"
                                component={HomeScreen}
                                options={{
                                    headerShown: false
                                }}
                            />
                            <Stack.Screen
                                name="Box"
                                options={{
                                    headerShown: false
                                }}
                            >{props => <BoxScreen {...props}></BoxScreen>}</Stack.Screen>
                        </>
                    )
                }
                </Stack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    )
    }

}