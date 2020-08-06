import React, { useState, useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import { SyncPacket } from '@teamberry/muscadine';
import Player from './components/player.component';
import Box from '../../models/box.model';
import BoxContext from './box.context';
import Queue from './components/queue.component';
import SocketContext from './box.context';
import Panel from './components/panel.component';
import OfflineNotice from '../../components/offline-notice.component';
import BxLoadingIndicator from '../../components/bx-loading-indicator.component';

const styles = StyleSheet.create({
  playerSpace: {
    backgroundColor: '#262626',
  },
});

const BoxScreen = ({ route }) => {
  const { boxToken } = route.params;
  const window = useWindowDimensions();
  const playerHeight = window.width * (9 / 16);
  const remainingHeight = window.height - playerHeight;

  let socketConnection = null;

  const [box, setBox] = useState(null);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [boxKey, setBoxKey] = useState(null);
  const [currentQueueItem, setCurrentQueueItem] = useState(null);
  const [isConnected, setConnectionStatus] = useState(null);

  useEffect(() => {
    const bootstrap = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));
      setUser(user);

      const box = await axios.get(`https://araza.berrybox.tv/boxes/${boxToken}`);
      setBox(box.data);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (user && box) {
      console.log('READY TO CONNECT');
      socketConnection = io('https://boquila.berrybox.tv', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttemps: 10,
      })
        .on('connect', () => {
          if (socket) {
            setSocket(null);
          }

          console.log('Connection attempt');
          socketConnection.emit('auth', {
            origin: 'Cranberry', type: 'sync', boxToken: box._id, userToken: user._id,
          });
        })
        .on('reconnect_attempt', () => {
          console.log('Reconnection attempt');
          socketConnection.emit('auth', {
            origin: 'Cranberry', type: 'sync', boxToken: box._id, userToken: user._id,
          });
        })
        .on('confirm', () => {
          setSocket(socketConnection);
          setConnectionStatus(true);
        })
        .on('bootstrap', (bootstrapMaterial) => {
          setBoxKey(bootstrapMaterial.boxKey);
          socketConnection.emit('start', {
            boxToken: box._id, userToken: user._id,
          });
        })
        .on('sync', (syncPacket: SyncPacket) => {
          setCurrentQueueItem(syncPacket.item);
        })
        .on('box', (box: Box) => {
          setBox(box);
        })
        .on('denied', () => {
          console.log('DENIED');
        });
    }

    return (() => {
      if (socketConnection) {
        console.log('DISCONNECTION');
        socketConnection.disconnect();
      }
    });
  }, [user, box]);

  if (!isConnected) {
    return (
      <View style={{ backgroundColor: '#191919', height: '100%' }}>
        <BxLoadingIndicator />
      </View>
    );
  }

  return (
    <BoxContext.Provider value={socket}>
      <OfflineNotice />
      <View style={[styles.playerSpace, { height: playerHeight }]}>
        {socket && boxKey ? (
          <Player
            boxKey={boxKey}
            currentItem={currentQueueItem}
          />
        ) : (
          <BxLoadingIndicator />
        )}
      </View>
      <Queue box={box} currentVideo={currentQueueItem} height={remainingHeight} />
      {socket ? (
        <SocketContext.Consumer>
          { (socket) => <Panel box={box} socket={socket} />}
        </SocketContext.Consumer>
      ) : (
        <BxLoadingIndicator />
      )}
    </BoxContext.Provider>
  );
};

export default BoxScreen;
