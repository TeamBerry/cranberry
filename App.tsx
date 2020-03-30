import React, { useReducer, useEffect, useMemo, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/home.screen';
import { BoxScreen } from './src/screens/box/box.screen';
import LoginScreen from './src/screens/login.screen';
import { View, Image } from "react-native";
import AuthContext from './src/shared/auth.context';
import axios from 'axios';
import { darkTheme, lightTheme } from './src/shared/themes';
import AsyncStorage from '@react-native-community/async-storage';
import SignupScreen from './src/screens/signup.screen';

const Stack = createStackNavigator();

export default function App({ navigation }) {
    console.disableYellowBox = true;
    const [isAppReady, setAppReadiness] = useState(false)

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
        const bootstrapAsync = async () => {
            let userToken = null;

            try {
                userToken = await AsyncStorage.getItem('BBOX-token')
                axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
            } catch (e) {
                console.log('Restoring token failed.')
            }

            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
            setTimeout(() => {
                setAppReadiness(true);
            }, 2000);
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
            signUp: async data => {
                axios.post(`https://araza.berrybox.tv/auth/signup`,
                    {
                        mail: data.email,
                        password: data.password
                    }
                ).then(async (response) => {
                    await AsyncStorage.setItem('BBOX-token', response.data.bearer)
                    await AsyncStorage.setItem('BBOX-expires_at', JSON.stringify(response.data.expiresIn))
                    await AsyncStorage.setItem('BBOX-user', JSON.stringify(response.data.subject))
                    dispatch({ type: 'SIGN_IN', token: response.data.bearer })
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


    const _cacheResourcesAsync = async () => {
        // await Font.loadAsync({
        //     'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
        //     'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
        //     'Montserrat-ExtraBold': require('./assets/fonts/Montserrat-ExtraBold.ttf'),
        //     'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
        //     'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
        //     'Montserrat-Thin': require('./assets/fonts/Montserrat-Thin.ttf')
        // });
    };

    const ActiveTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            ...lightTheme.colors
        }
    }

    if (!isAppReady) {
        return (
            <View style={{flex: 1}}>
            <Image
                    source={require('./assets/splash.png')}
                    onLoadEnd={_cacheResourcesAsync}
                    style={{height: '100%', width: '100%'}}
                />
            </View>
        )
    }

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer theme={ActiveTheme}>
                <Stack.Navigator>
                    {state.userToken === null ? (
                        <>
                        <Stack.Screen
                            name="SignIn"
                            component={LoginScreen}
                            options={{
                                animationTypeForReplace: 'pop',
                                headerShown: false
                            }}
                        />
                        <Stack.Screen
                            name="SignUp"
                            component={SignupScreen}
                            options={{
                                animationTypeForReplace: 'pop',
                                headerShown: false
                            }}
                        />
                        </>
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