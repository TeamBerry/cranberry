import React from "react"
import { StyleSheet, Text, View, ActivityIndicator, FlatList, RefreshControl, Image, Platform, StatusBar } from 'react-native';
import { Box } from "../models/box.model";
import BoxCard from "./../components/box-card.component";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomMenu from "../components/custom-menu.component";
import SideMenu from 'react-native-side-menu';
import AsyncStorage from '@react-native-community/async-storage';

export class HomeScreen extends React.Component<{navigation}> {
    static navigationOptions = {
        title: 'Home'
    }

    state: {
        error: any,
        hasLoadedBoxes: boolean,
        boxes: Array<Box>,
        isMenuOpen: boolean,
        user: any
    } = {
        error: null,
        hasLoadedBoxes: false,
        boxes: [],
        isMenuOpen: false,
        user: null
    }

    async componentDidMount() {
        const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));
        this.setState({user})
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

    toggleMenu() {
        const newValue = !this.state.isMenuOpen;
        this.setState({ isMenuOpen: newValue });
    }

    render() {
        const { boxes, hasLoadedBoxes } = this.state
        const user = this.state.user

        return (
            <SideMenu
                menu={<CustomMenu />}
                isOpen={this.state.isMenuOpen}
                bounceBackOnOverdraw={false}
                onChange={(isOpen: boolean) => this.setState({ isMenuOpen: isOpen })}
                autoClosing={true}
            >
            {/* <View style={{height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight, backgroundColor: '#262626'}}>
                <StatusBar barStyle='dark-content' />
            </View> */}

            <View style={styles.headerContainer}>
                <View style={styles.headerStyle}>
                    <TouchableOpacity
                        onPress={() => this.toggleMenu()}
                    >
                        <Image
                            style={styles.userImage}
                            source={{
                                uri: `https://berrybox-user-pictures.s3.eu-west-1.amazonaws.com/profile-pictures/${user?.settings.picture}`
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.container}>
                <Text style={styles.titlePage}>Boxes</Text>
                {hasLoadedBoxes ? (
                    <FlatList
                        data={boxes}
                        refreshControl={<RefreshControl refreshing={!hasLoadedBoxes} onRefresh={this.onRefresh.bind(this)}/>}
                        renderItem={({ item, index, separators }) => (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => this.props.navigation.navigate('Box', { boxToken: item._id })}
                            >
                                <BoxCard {...item} />
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
    headerContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        backgroundColor: '#262626',
        borderColor: '#191919',
        borderStyle: 'solid',
        borderBottomWidth: 1
    },
    headerStyle: {
        height: 30,
        elevation: 0,
        shadowOpacity: 0
    },
    userImage: {
        height: 30,
        width: 30,
        borderRadius: 15
    },
    container: {
        flex: 1,
        backgroundColor: '#262626',
    },
    titlePage: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 30,
        marginTop: '1%',
        marginBottom: 10,
        color: 'white',
        paddingLeft: 10
    },
    card: {
        borderBottomWidth: 1,
        borderColor: '#404040',
        borderStyle: 'solid',
        paddingVertical: 10
    }
});