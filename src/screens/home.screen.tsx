import React from "react"
import { StyleSheet, Text, View, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { Box } from "../models/box.model";
import BoxCard from "./../components/box-card.component";
import { TouchableOpacity } from "react-native-gesture-handler";

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
    },
    card: {
        paddingBottom: 10
    }
});