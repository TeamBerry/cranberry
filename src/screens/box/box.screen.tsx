import React, { useState } from "react";
import { StyleSheet, View, ActivityIndicator, StatusBar, Platform } from 'react-native';
import io from "socket.io-client";

import Player from './components/player.component';
import PanelComponent from './components/panel.component';
import { Box } from '../../models/box.model';
import BoxContext from "./box.context";

export class BoxScreen extends React.Component<{ route, navigation }> {
    boxToken: string = this.props.route.params.boxToken
    socketConnection = null

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
            this.socketConnection = io('https://boquila.berrybox.tv', {
                transports: ['websocket'],
                reconnection: true,
                reconnectionDelay: 500,
                reconnectionAttempts: 10
            });
            this.socketConnection.on('connect', () => {
                if (!this.state.socket) {
                    console.log('Connection attempt')
                    this.socketConnection.emit('auth', {
                        origin: 'Cranberry',
                        type: 'sync',
                        boxToken: box._id,
                        userToken: '5e715f673640b31cb895238f'
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
            <>
            {/* <View style={{height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight, backgroundColor: 'black'}}>
                <StatusBar barStyle='dark-content' />
            </View> */}
            <BoxContext.Provider value={this.state.socket}>
                <View style={styles.playerSpace}>
                    {this.state.socket ? (
                        <BoxContext.Consumer>
                            {socket => <Player {...this.props} socket={socket} boxToken={this.boxToken}></Player>}
                        </BoxContext.Consumer>
                    ) : (
                            <ActivityIndicator></ActivityIndicator>
                    )}
                </View>
                <View style={styles.panelSpace}>
                    {this.state.socket ? (
                        <PanelComponent boxToken={this.boxToken}></PanelComponent>
                    ) : (
                            <ActivityIndicator></ActivityIndicator>
                        )}
                </View>
                </BoxContext.Provider>
            </>
        )
    }
}

const styles = StyleSheet.create({
    panelSpace: {
        backgroundColor: '#404040',
        height: '88%'
    },
    playerSpace: {
        height: 200,
        backgroundColor: '#262626'
    }
});