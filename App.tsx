import React, { useReducer, useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/home.screen';
import { BoxScreen } from './src/screens/box/box.screen';
import LoginScreen from './src/screens/login.screen';
import { AsyncStorage, StyleSheet } from "react-native";
import AuthContext from './src/shared/auth.context';
import axios from 'axios';
// import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();

export default function App({navigation}) {
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
            let userToken;

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
            signOut: () => dispatch({ type: 'SIGN_OUT' })
        }),
        []
    );

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

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: '#262626',
        elevation: 0,
        shadowOpacity: 0
    }
})