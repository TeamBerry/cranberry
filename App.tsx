import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import { HomeScreen } from './src/screens/home.screen';

const AppNavigator = createStackNavigator(
    {
        Home: HomeScreen
    },
    {
        initialRouteName: 'Home'
    }
)

const AppContainer = createAppContainer(AppNavigator)

export default class App extends React.Component {
    render() {
        return <AppContainer />
    }
}