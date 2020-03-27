import React, { useState, useContext } from "react";
import { StyleSheet, View, ActivityIndicator, StatusBar, Platform, Text } from 'react-native';
import io from "socket.io-client";
import AsyncStorage from '@react-native-community/async-storage';

import Player from './components/player.component';
import PanelComponent from './components/panel.component';
import { Box } from '../../models/box.model';
import BoxContext from "./box.context";
import { SyncPacket } from "@teamberry/muscadine";
import Queue from "./components/queue.component";

export class BoxScreen extends React.Component<{ route, navigation }> {
    boxToken: string = this.props.route.params.boxToken
    socketConnection = null

    state: {
        error: any,
        hasLoadedBox: boolean,
        box: Box,
        socket: any,
        boxKey: string,
        currentQueueItem: SyncPacket['item']
    } = {
            error: null,
            hasLoadedBox: false,
            box: null,
            socket: null,
            boxKey: null,
            currentQueueItem: null
        }

    async componentDidMount() {
        const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));

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
            this.socketConnection.
                on('connect', () => {
                    if (!this.state.socket) {
                        console.log('Connection attempt')
                        this.socketConnection.emit('auth', {
                            origin: 'Cranberry',
                            type: 'sync',
                            boxToken: box._id,
                            userToken: user._id
                        })
                    }
                })
                .on('confirm', () => {
                    this.setState({ socket: this.socketConnection });
                })
                .on('bootstrap', (bootstrapMaterial) => {
                    this.setState({ boxKey: bootstrapMaterial.boxKey });
                    this.socketConnection.emit('start', {
                        boxToken: box._id,
                        userToken: user._id
                    });
                })
                .on('sync', (syncPacket: SyncPacket) => {
                    this.setState({ currentQueueItem: syncPacket.item });
                })
                .on('box', (box: Box) => {
                    this.setState({ box });
                })
                .on('denied', () => {
                    this.setState({ error: 'Connection denied', hasLoadedBox: true });
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
        return (
            <>
            {/* <View style={{height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight, backgroundColor: 'black'}}>
                <StatusBar barStyle='dark-content' />
            </View> */}
            <BoxContext.Provider value={this.state.socket}>
                <View style={styles.playerSpace}>
                    {this.state.socket && this.state.boxKey ? (
                    <Player
                        boxKey={this.state.boxKey}
                        currentItem={this.state.currentQueueItem}
                    />
                    ) : (
                        <ActivityIndicator></ActivityIndicator>
                    )}
                </View>
                <Queue box={this.state.box} currentVideo={this.state.currentQueueItem}></Queue>
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
        height: 546
    },
    playerSpace: {
        height: 204,
        backgroundColor: '#262626'
    }
});