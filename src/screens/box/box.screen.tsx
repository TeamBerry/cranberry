import React, { useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import io from "socket.io-client";

import Player from './components/player.component';
import PanelComponent from './components/panel.component';
import { Box } from '../../models/box.model';
import BoxContext from "./box.context";

export class BoxScreen extends React.Component<{ route, navigation }> {
    boxToken: string = this.props.route.params.boxToken
    socketConnection

    state: {
        error: any,
        hasLoadedBox: boolean,
        box: Box,
        socket: any
    } = {
            error: null,
            hasLoadedBox: false,
            box: null,
            socket: null
        }

    async componentDidMount() {
        try {
            const box: Box = await (await fetch(`https://araza.berrybox.tv/boxes/${this.boxToken}`)).json()
            this.setState({ box, hasLoadedBox: true })
            console.log('Box loaded. Connecting.')
            this.socketConnection = io('https://boquila.berrybox.tv', { transports: ['websocket'] });
            this.socketConnection.on('connect', () => {
                if (!this.state.socket) {
                    console.log('Connection attempt')
                    this.socketConnection.emit('auth', {
                        origin: 'BERRYBOX MOBILE',
                        type: 'sync',
                        boxToken: box._id,
                        userToken: 'user-35743736d7sq63f83cx4'
                    })
                }
            })
            this.socketConnection
                .on('confirm', (feedback) => {
                    console.log('Connected', feedback)
                    this.setState({ socket: this.socketConnection })
                })
            this.socketConnection
                .on('denied', () => {
                    console.log('DENIED')
                })
        } catch (error) {
            this.setState({ error, hasLoadedBox: true })
        }
    }

    async componentWillUnmount() {
        this.socketConnection.disconnect()
    }

    render() {
        const { box, hasLoadedBox } = this.state

        return (
            <BoxContext.Provider value={this.state.socket}>
                <View>
                    {this.state.socket ? (
                        <BoxContext.Consumer>
                            {socket => <Player {...this.props} socket={socket}></Player>}
                        </BoxContext.Consumer>
                    ) : (
                            <ActivityIndicator></ActivityIndicator>
                    )
                    }
                    {this.state.socket ? (
                        <BoxContext.Consumer>
                            {socket => <PanelComponent {...this.props} socket={socket}></PanelComponent>}
                        </BoxContext.Consumer>
                    ) : (
                            <ActivityIndicator></ActivityIndicator>
                        )}
                </View>
            </BoxContext.Provider>
        )
    }
}