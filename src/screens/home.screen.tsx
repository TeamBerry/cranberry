import React from "react"
import { StyleSheet, Text, View, ActivityIndicator, FlatList, RefreshControl, Platform, StatusBar } from 'react-native';
import { Box } from "../models/box.model";
import BoxCard from "./../components/box-card.component";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomMenu from "../components/custom-menu.component";
import SideMenu from 'react-native-side-menu';
import CustomHeader from "../components/custom-header.component";

export class HomeScreen extends React.Component<{navigation}> {
    static navigationOptions = {
        title: 'Home'
    }

    state: {
        error: any,
        hasLoadedBoxes: boolean,
        boxes: Array<Box>,
    } = {
        error: null,
        hasLoadedBoxes: false,
        boxes: [],
    }

    componentDidMount() {
        this.getBoxes();
    }

    async getBoxes() {
        try {
            const boxes: Array<Box> = await (await fetch('https://araza.berrybox.tv/boxes')).json()
            this.setState({ boxes, hasLoadedBoxes: true })
        } catch (error) {
            this.setState({ error, hasLoadedBoxes: true })
        }
    }

    onRefresh() {
        this.setState({ hasLoadedBoxes: false, boxes: [] })
        this.getBoxes();
    }


    render() {
        const { boxes, hasLoadedBoxes } = this.state

        return (
            <SideMenu menu={<CustomMenu/>}>
            <View style={{height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight, backgroundColor: '#262626'}}>
                <StatusBar barStyle='dark-content' />
            </View>
            <CustomHeader style={styles.headerStyle}></CustomHeader>
            <View style={styles.container}>
                <Text style={styles.titlePage}>Boxes</Text>
                {hasLoadedBoxes ? (
                    <FlatList
                        data={boxes}
                        refreshControl={<RefreshControl refreshing={!hasLoadedBoxes} onRefresh={this.onRefresh.bind(this)}/>}
                        renderItem={({ item, index, separators }) => (
                            <TouchableOpacity style={styles.card}
                                onPress={() => this.props.navigation.navigate('Box', {boxToken: item._id})}>
                                <BoxCard {...item}
                                ></BoxCard>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.name}
                    />
                ) : (
                        <ActivityIndicator />
                    )}
                </View>
            </SideMenu>
        )
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: '#262626',
        height: 40,
        elevation: 0,
        shadowOpacity: 0
    },
    container: {
        flex: 1,
        backgroundColor: '#262626',
        paddingLeft: 10,
        paddingRight: 10
    },
    titlePage: {
        // fontFamily: 'Montserrat',
        fontSize: 30,
        marginTop: '1%',
        marginBottom: 10,
        color: 'white'
    },
    card: {
        paddingBottom: 10
    }
});