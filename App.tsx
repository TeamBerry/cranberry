import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/home.screen';
import { BoxScreen } from './src/modules/box/box.screen';

const Stack = createStackNavigator();

export default class App extends React.Component {
    render() {
        return <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
                <Stack.Screen name="Box">
                    {props => <BoxScreen {...props}></BoxScreen>}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    }
}