import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/home.screen';
import { BoxScreen } from './src/screens/box/box.screen';
import { LoginScreen } from './src/screens/login.screen';
import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();

export default class App extends React.Component {
    state : {
        isLoading: boolean
        userToken: string
    } = {
        isLoading: true,
        userToken: null
        }

    async getSession() {
        const session = await AsyncStorage.getItem('BBOX-token')

        if (session) {
            this.state.userToken = session
        }
    }

    render() {
        return <NavigationContainer>
            <Stack.Navigator>
                {this.state.userToken === null ? (
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                            animationTypeForReplace: 'pop',
                            headerShown: false
                        }}
                    />
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Box">{props => <BoxScreen {...props}></BoxScreen>}</Stack.Screen>
                    </>
                )
                }
            </Stack.Navigator>
        </NavigationContainer>
    }
}