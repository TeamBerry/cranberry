import React from "react"
import { StyleSheet, Text, View } from 'react-native';
import { BoxListComponent } from "../components/box-list.component";
import { Box } from "../models/box.model";

export class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home'
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titlePage}>Boxes</Text>
                <BoxListComponent></BoxListComponent>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: '2%',
        paddingRight: '2%'
    },
    titlePage: {
        // fontFamily: 'Montserrat',
        fontSize: 30,
        marginTop: '1%',
        marginBottom: 10
    }
});