import React, { useState, useEffect } from 'react';
import {
  View, useWindowDimensions, BackHandler, Text, Pressable, StyleSheet, KeyboardAvoidingView, ToastAndroid,
} from 'react-native';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import Config from 'react-native-config';
import { connect } from 'react-redux';

import {
  SyncPacket, BerryCount, Permission, FeedbackMessage, PlayingItem, QueueItem,
} from '@teamberry/muscadine';
import { Snackbar } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import { getUser } from '../../redux/selectors';
import Player from './components/player.component';
import Box from '../../models/box.model';
import BoxContext from './box.context';
import Queue from './components/queue.component';
import OfflineNotice from '../../components/offline-notice.component';
import BxLoadingIndicator from '../../components/bx-loading-indicator.component';
import { useTheme } from '../../shared/theme.context';
import { AuthSubject } from '../../models/session.model';
import Chat from './components/chat.component';
import ErrorIcon from '../../../assets/icons/error-icon.svg';
import BoxForm from '../../components/box-form.component';
import UserList from './components/user-list.component';

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  titlePage: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    paddingLeft: 5,
  },
  container: {
    flex: 0,
  },
  form: {
    paddingBottom: 50,
    paddingHorizontal: 15,
  },
  modeContainer: {
    marginVertical: 20,
  },
  modeSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeDefinition: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  sectionTitle: {
    fontSize: 20,
    paddingTop: 10,
    fontFamily: 'Montserrat-SemiBold',
    color: '#009AEB',
  },
});

const BoxScreen = (props: { route, navigation, user: AuthSubject }) => {
  const { route, navigation, user } = props;
  const { boxToken } = route.params;
  const window = useWindowDimensions();
  const playerHeight = window.width * (9 / 16) + 10;
  const remainingHeight = window.height - playerHeight;

  const socketConnection: Socket = io(Config.SOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
  });

  const [box, setBox] = useState<Box>(null);
  const [queue, setQueue] = useState<Array<QueueItem | PlayingItem>>([]);
  const [socket, setSocket] = useState<Socket>(null);
  const [boxKey, setBoxKey] = useState<string>(null);
  const [currentQueueItem, setCurrentQueueItem] = useState<PlayingItem>(null);
  const [berryCount, setBerryCount] = useState(0);
  const [isConnected, setConnectionStatus] = useState(null);
  const [permissions, setPermissions] = useState<Array<Permission>>([]);
  const [feedback, setFeedbackMessage] = useState<FeedbackMessage>(null);
  const { colors } = useTheme();

  // Editing
  const [isEditing, setEditing] = useState(false);
  const [isUpdated, setUpdated] = useState(false);

  // Sharing
  const [isUserlistVisible, setUserlistVisibility] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const box = await axios.get(`${Config.API_URL}/boxes/${boxToken}`);
      setBox(box.data);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!isEditing && !isUserlistVisible) {
        navigation.navigate('Home');
        return true;
      }

      if (isEditing || isUserlistVisible) {
        setEditing(false);
        setUserlistVisibility(false);
        return true;
      }

      return false;
    });

    return () => backHandler.remove();
  }, [isEditing, isUserlistVisible]);

  useEffect(() => {
    if (user && boxToken) {
      socketConnection
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
        .on('queue', (queue: Array<QueueItem | PlayingItem>) => {
          setQueue(queue);
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
          ToastAndroid.show('Connection to the box has been denied.', 3000);
          navigation.navigate('Home');
        })
        .on('connect_error', () => {
          ToastAndroid.show('Could not connect to the server. Please try again.', 3000);
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
      <View style={{ flex: 1, alignContent: 'flex-end' }}>
        {box && berryCount !== null && permissions ? (
          <>
            <Collapsible
              collapsed={!isEditing && !isUserlistVisible}
              style={{ height: remainingHeight + 50 }}
            >
              { isEditing ? (
                <View>
                  <View style={[styles.headerContainer, { backgroundColor: colors.backgroundSecondaryAlternateColor }]}>
                    <Text style={[styles.titlePage, { color: colors.textColor }]}>Box Settings</Text>
                    <Pressable onPress={() => setEditing(false)}>
                      <ErrorIcon width={20} height={20} fill={colors.textColor} style={{ marginRight: 10 }} />
                    </Pressable>
                  </View>
                  <KeyboardAvoidingView
                    style={[styles.container, { backgroundColor: colors.background, height: remainingHeight - 50 }]}
                    behavior="height"
                  >
                    <BoxForm
                      box={box}
                      user={user}
                      onSuccess={() => { setEditing(false); setUpdated(true); }}
                      onError={() => { console.log('Error updating box'); }}
                    />
                  </KeyboardAvoidingView>
                </View>
              ) : null}
              { isUserlistVisible ? (
                <View>
                  <View style={[styles.headerContainer, { backgroundColor: colors.backgroundSecondaryAlternateColor }]}>
                    <Text style={[styles.titlePage, { color: colors.textColor }]}>Users</Text>
                    <Pressable onPress={() => setUserlistVisibility(false)}>
                      <ErrorIcon width={20} height={20} fill={colors.textColor} style={{ marginRight: 10 }} />
                    </Pressable>
                  </View>
                  <UserList
                    box={box}
                    user={user}
                    permissions={permissions}
                    socket={socket}
                    height={remainingHeight}
                  />
                </View>
              ) : null}
            </Collapsible>
            <Queue
              box={box}
              user={user}
              queue={queue}
              currentVideo={currentQueueItem}
              height={remainingHeight}
              berryCount={berryCount}
              permissions={permissions}
              onEdit={() => setEditing(!isEditing)}
              onShare={() => { setUserlistVisibility(true); }}
            />
            <Chat
              box={box}
              user={user}
              socket={socket}
              berryCount={berryCount}
              permissions={permissions}
            />
          </>
        ) : (
          <BxLoadingIndicator />
        )}
      </View>
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
      <Snackbar
        visible={isUpdated}
        onDismiss={() => setUpdated(false)}
        duration={2000}
        style={{
          backgroundColor: '#090909',
          borderLeftColor: '#0CEBC0',
          borderLeftWidth: 10,
        }}
      >
        <Text style={{ color: 'white' }}>Your box has been updated.</Text>
      </Snackbar>
    </BoxContext.Provider>
  );
};

export default connect((state) => getUser(state))(BoxScreen);
