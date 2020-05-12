/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';

import { SyncPacket } from '@teamberry/muscadine';
import Player from './components/player.component';
import Box from '../../models/box.model';
import BoxContext from './box.context';
import Queue from './components/queue.component';
import SocketContext from '../box/box.context';
import Panel from './components/panel.component';
import OfflineNotice from '../../components/offline-notice.component';

const styles = StyleSheet.create({
  playerSpace: {
    height: 204,
    backgroundColor: '#262626',
  },
});

// eslint-disable-next-line import/prefer-default-export
export class BoxScreen extends React.Component<{ route }> {
    boxToken: string = this.props.route.params.boxToken

    socketConnection = null

    // eslint-disable-next-line react/state-in-constructor
    state: {
        hasLoadedBox: boolean,
        box: Box,
        socket: any,
        boxKey: string,
        currentQueueItem: SyncPacket['item']
    } = {
      hasLoadedBox: false,
      box: null,
      socket: null,
      boxKey: null,
      currentQueueItem: null,
    }

    async componentDidMount() {
      const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));

      try {
        const box: Box = await (await fetch(`https://araza.berrybox.tv/boxes/${this.boxToken}`)).json();
        this.setState({ box, hasLoadedBox: true });
        this.socketConnection = io('https://boquila.berrybox.tv', {
          transports: ['websocket'],
          reconnection: true,
          reconnectionDelay: 500,
        }).on('connect', () => {
          if (!this.state.socket) {
            console.log('Connection attempt');
            this.socketConnection.emit('auth', {
              origin: 'Cranberry',
              type: 'sync',
              boxToken: box._id,
              userToken: user._id,
            });
          }
        })
          .on('reconnecting', () => {
            console.log('Reconnection attempt');
            this.socketConnection.emit('auth', {
              origin: 'Cranberry',
              type: 'sync',
              boxToken: box._id,
              userToken: user._id,
            });
          })
          .on('confirm', () => {
            this.setState({ socket: this.socketConnection });
            console.log('CONNECTED');
          })
          .on('bootstrap', (bootstrapMaterial) => {
            this.setState({ boxKey: bootstrapMaterial.boxKey });
            this.socketConnection.emit('start', {
              boxToken: box._id,
              userToken: user._id,
            });
          })
          .on('sync', (syncPacket: SyncPacket) => {
            this.setState({ currentQueueItem: syncPacket.item });
          })
          .on('box', (box: Box) => {
            this.setState({ box });
          })
          .on('denied', () => {
            this.setState({ hasLoadedBox: true });
            console.log('DENIED');
          })
          .on('disconnect', () => {
            console.log('DISCONNECTED');
          });
      } catch (error) {
        this.setState({ hasLoadedBox: true });
      }
    }

    async componentWillUnmount() {
      if (this.socketConnection) {
        this.socketConnection.disconnect();
      }
    }

    render() {
      return (
        <>
          { this.state.hasLoadedBox ? (
            <BoxContext.Provider value={this.state.socket}>
              <OfflineNotice />
              <View style={styles.playerSpace}>
                {this.state.socket && this.state.boxKey ? (
                  <Player
                    boxKey={this.state.boxKey}
                    currentItem={this.state.currentQueueItem}
                  />
                ) : (
                  <ActivityIndicator />
                )}
              </View>
              <Queue box={this.state.box} currentVideo={this.state.currentQueueItem} />
              {this.state.socket ? (
                <SocketContext.Consumer>
                  { (socket) => <Panel boxToken={this.state.box._id} socket={socket} /> }
                </SocketContext.Consumer>
              ) : (<ActivityIndicator />)}
            </BoxContext.Provider>
          ) : (
            <View style={{ backgroundColor: '#191919', height: '100%' }}>
              <ActivityIndicator />
            </View>
          )}
        </>
      );
    }
}
