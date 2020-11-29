import React, { useState, useEffect } from 'react';
import {
  View, useWindowDimensions, BackHandler, Text,
} from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

import {
  SyncPacket, BerryCount, Permission, FeedbackMessage,
} from '@teamberry/muscadine';
import { Snackbar } from 'react-native-paper';
import Player from './components/player.component';
import Box from '../../models/box.model';
import BoxContext from './box.context';
import Queue from './components/queue.component';
import Panel from './components/panel.component';
import OfflineNotice from '../../components/offline-notice.component';
import BxLoadingIndicator from '../../components/bx-loading-indicator.component';
import { useTheme } from '../../shared/theme.context';

const BoxScreen = ({ route, navigation }) => {
  const { boxToken } = route.params;
  const window = useWindowDimensions();
  const playerHeight = window.width * (9 / 16) + 10;
  const remainingHeight = window.height - playerHeight;

  let socketConnection = null;

  const [box, setBox] = useState(null);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [boxKey, setBoxKey] = useState(null);
  const [currentQueueItem, setCurrentQueueItem] = useState(null);
  const [berryCount, setBerryCount] = useState(0);
  const [isConnected, setConnectionStatus] = useState(null);
  const [permissions, setPermissions] = useState([] as Array<Permission>);
  const [feedback, setFeedbackMessage] = useState(null as FeedbackMessage);
  const { colors } = useTheme();

  useEffect(() => {
    const bootstrap = async () => {
      const box = await axios.get(`${Config.API_URL}/boxes/${boxToken}`);
      setBox(box.data);

      const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));
      setUser(user);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Home');
      return true;
    });

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (user && boxToken) {
      socketConnection = io(Config.SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttemps: 10,
      })
        .on('connect', () => {
          socketConnection.emit('auth', {
            origin: 'Cranberry', type: 'sync', boxToken, userToken: user._id,
          });
        })
        .on('reconnect_attempt', () => {
          socketConnection.emit('auth', {
            origin: 'Cranberry', type: 'sync', boxToken, userToken: user._id,
          });
        })
        .on('confirm', () => {
          setSocket(socketConnection);
        })
        .on('bootstrap', (bootstrapMaterial) => {
          setBoxKey(bootstrapMaterial.boxKey);
          socketConnection.emit('start', {
            boxToken, userToken: user._id,
          });
          setConnectionStatus(true);
        })
        .on('sync', (syncPacket: SyncPacket) => {
          setCurrentQueueItem(syncPacket.item);
        })
        .on('box', (box: Box) => {
          setBox(box);
        })
        .on('chat', (message: FeedbackMessage) => {
          if (message.source === 'feedback') {
            setFeedbackMessage(message);
          }
        })
        .on('berries', (berryCount: BerryCount) => {
          setBerryCount(berryCount.berries);
        })
        .on('permissions', (permissions: Array<Permission>) => {
          setPermissions(permissions);
        })
        .on('denied', () => {
          console.log('DENIED');
        });
    }

    return (() => {
      if (socketConnection) {
        socketConnection.disconnect();
      }
    });
  }, [user, boxToken]);

  if (!isConnected) {
    return (
      <View style={{ backgroundColor: colors.backgroundSecondaryAlternateColor, height: '100%' }}>
        <BxLoadingIndicator />
      </View>
    );
  }

  const onEdit = () => {
    console.log('BOXTOKEN: ', boxToken);
    navigation.navigate('EditBox', { boxToken });
  };

  return (
    <BoxContext.Provider value={socket}>
      <OfflineNotice />
      <View style={{ height: playerHeight, backgroundColor: colors.backgroundInactiveColor }}>
        {socket && boxKey ? (
          <Player
            boxKey={boxKey}
            currentItem={currentQueueItem}
            height={playerHeight}
          />
        ) : (
          <BxLoadingIndicator />
        )}
      </View>
      {isConnected && box && berryCount !== null && permissions ? (
        <>
          <Queue
            box={box}
            currentVideo={currentQueueItem}
            height={remainingHeight}
            berryCount={berryCount}
            permissions={permissions}
            onEdit={onEdit}
          />
          <Panel box={box} socket={socket} berryCount={berryCount} permissions={permissions} />
        </>
      ) : (
        <BxLoadingIndicator />
      )}
      <Snackbar
        visible={feedback !== null && feedback.context === 'success'}
        onDismiss={() => setFeedbackMessage(null)}
        duration={3000}
        style={{
          backgroundColor: '#090909',
          borderLeftColor: '#0CEBC0',
          borderLeftWidth: 10,
        }}
      >
        <Text style={{ color: 'white' }}>{feedback?.contents}</Text>
      </Snackbar>
      <Snackbar
        visible={feedback !== null && feedback.context === 'error'}
        onDismiss={() => setFeedbackMessage(null)}
        duration={3000}
        style={{
          backgroundColor: '#090909',
          borderLeftColor: '#0CEBC0',
          borderLeftWidth: 10,
        }}
      >
        <Text style={{ color: 'white' }}>{feedback?.contents}</Text>
      </Snackbar>
    </BoxContext.Provider>
  );
};

export default BoxScreen;
