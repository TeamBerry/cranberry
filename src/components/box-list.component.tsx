import React from "react";
import { Text, FlatList, View, ActivityIndicator, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import BoxCard from "./box-card.component";

export class BoxListComponent extends React.Component {
    state = {
        error: null,
        hasLoadedBoxes: false,
        boxes: []
    }

    async componentDidMount() {
        try {
            const boxes = await (await fetch('https://araza.berrybox.tv/boxes')).json()
            console.log('GOT BOXES')
            this.setState({ boxes, hasLoadedBoxes: true })
        } catch (error) {
            this.setState({ error, hasLoadedBoxes: true })
        }
    }

    render() {
        const { boxes, hasLoadedBoxes } = this.state

        if (hasLoadedBoxes) {
            return (
                <FlatList
                    data={boxes}
                    renderItem={({ item, index, separators }) => (
                        <View style={styles.card}>
                            <BoxCard {...item} ></BoxCard>
                        </View>
                    )}
                    keyExtractor={(item) => item.name}
                />
            )
        } else {
            return <ActivityIndicator />
        }
    }
}

const styles = StyleSheet.create({
    card: {
        paddingBottom: 10
    }
})