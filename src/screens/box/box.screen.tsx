import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import Player from './components/player.component';
import PanelComponent from './components/panel.component';
import { Box } from '../../models/box.model';

export class BoxScreen extends React.Component<{ route, navigation }> {
    boxToken: string = this.props.route.params.boxToken

    state: {
        error: any,
        hasLoadedBox: boolean,
        box: Box
    } = {
            error: null,
            hasLoadedBox: false,
            box: null
        }

    async componentDidMount() {
        try {
            const box: Box = await (await fetch(`https://araza.berrybox.tv/boxes/${this.boxToken}`)).json()
            this.setState({ box, hasLoadedBox: true })
        } catch (error) {
            this.setState({ error, hasLoadedBox: true })
        }
    }

    render() {
        const { box, hasLoadedBox } = this.state

        return (
            <View>
                <Player></Player>
                <PanelComponent></PanelComponent>
            </View>
        )
    }
}