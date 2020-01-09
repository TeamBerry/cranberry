import React from "react"
import { StyleSheet, Text, View } from 'react-native';

export class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome'
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Welcome to Cranberry, the mobile Berrybox app!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});