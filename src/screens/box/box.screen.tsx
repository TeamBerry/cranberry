import React from "react";
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import io from "socket.io-client";
import AsyncStorage from '@react-native-community/async-storage';
import { Snackbar } from 'react-native-paper';

import Player from './components/player.component';
import { Box } from '../../models/box.model';
import BoxContext from "./box.context";
import { SyncPacket, Message, FeedbackMessage } from "@teamberry/muscadine";
import Queue from "./components/queue.component";
import SocketContext from './../box/box.context';
import Panel from "./components/panel.component";
import OfflineNotice from "../../components/offline-notice.component";

export class BoxScreen extends React.Component<{ route, navigation }> {
    boxToken: string = this.props.route.params.boxToken
    socketConnection = null

    state: {
        error: any,
        hasLoadedBox: boolean,
        box: Box,
        socket: any,
        boxKey: string,
        currentQueueItem: SyncPacket['item'],
        isFeedbackVisible: boolean,
        feedbackMessage: FeedbackMessage
    } = {
            error: null,
            hasLoadedBox: false,
            box: null,
            socket: null,
            boxKey: null,
            currentQueueItem: null,
            isFeedbackVisible: false,
            feedbackMessage: null
        }

    async componentDidMount() {
        const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));

        try {
            const box: Box = await (await fetch(`https://araza.berrybox.tv/boxes/${this.boxToken}`)).json()
            this.setState({ box, hasLoadedBox: true })
            this.socketConnection = io('https://boquila.berrybox.tv', {
                transports: ['websocket'],
                reconnection: true,
                reconnectionDelay: 500
            }).on('connect', () => {
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
            .on('reconnecting', () => {
                console.log('Reconnection attempt')
                this.socketConnection.emit('auth', {
                    origin: 'Cranberry',
                    type: 'sync',
                    boxToken: box._id,
                    userToken: user._id
                })
            })
            .on('confirm', () => {
                this.setState({ socket: this.socketConnection });
                console.log('CONNECTED')
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
            .on('chat', (message: Message | FeedbackMessage) => {
                if ('feedbackType' in message) {
                    console.log('MESSAGE: ', message)
                    this.setState(
                        {
                            isFeedbackVisible: true,
                            feedbackMessage: message
                        }
                    )
                }
            })
            .on('denied', () => {
                this.setState({ error: 'Connection denied', hasLoadedBox: true });
                console.log('DENIED')
            })
            .on('disconnect', () => {
                console.log('DISCONNECTED')
            })
        } catch (error) {
            this.setState({ error, hasLoadedBox: true })
        }
    }

    async componentWillUnmount() {
        if (this.socketConnection) {
            this.socketConnection.disconnect()
        }
    }

    render() {
        return (
            <>
                <BoxContext.Provider value={this.state.socket}>
                <OfflineNotice />
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
                    {this.state.socket ? (
                        <>
                            <SocketContext.Consumer>
                                { socket => <Queue box={this.state.box} currentVideo={this.state.currentQueueItem} socket={socket} />}
                            </SocketContext.Consumer>
                            <SocketContext.Consumer>
                                { socket => <Panel boxToken={this.state.box._id} socket={socket}/> }
                            </SocketContext.Consumer>
                        </>
                    ) : (<ActivityIndicator />)}
                    <Snackbar
                        visible={this.state.isFeedbackVisible}
                        duration={1000}
                        onDismiss={() => { this.setState({ isFeedbackVisible: false, feedbackMessage: null }) }}
                    >
                        {this.state.feedbackMessage?.contents}
                    </Snackbar>
                </BoxContext.Provider>
            </>
        )
    }
}

const styles = StyleSheet.create({
    playerSpace: {
        height: 204,
        backgroundColor: '#262626'
    },
    snackbar: {
        backgroundColor: '#090909',
        borderLeftWidth: 10,
    },
    successSnackBar: {
        borderLeftColor: '#B30F4F',
    },
    errorSnackBar: {
        borderLeftColor: '#B30F4F'
    },
    infoSnackBar: {
        borderLeftColor: '#009AEB'
    }
});