import React from "react";
import { Text, FlatList, View, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import BoxListItem from "./box-list-item.component";

export class BoxListComponent extends React.Component {
    state = {
        error: null,
        hasLoadedBoxes: false,
        boxes: []
    }

    async componentDidMount() {
        try {
            // const boxes = await (await fetch('https://araza.berrybox.tv/boxes')).json()
            const boxes = [{ name: 'Box 1', _id: '5cd35f7dsf' }, { name: 'Box 2', _id: '53cds3f9' }, { name: 'Box 3', _id: '5cd687df3f' }]
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
                        <BoxListItem {...item}></BoxListItem>
                    )}
                    keyExtractor={(item) => item.name}
                />
            )
        } else {
            return <ActivityIndicator />
        }
    }
}