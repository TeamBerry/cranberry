import React, { useState, useEffect } from 'react';
import {
  View, useWindowDimensions, BackHandler, Text, Pressable, StyleSheet, KeyboardAvoidingView, Share, ToastAndroid,
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
import BxActionComponent from '../../components/bx-action.component';
import { AuthSubject } from '../../models/session.model';
import Chat from './components/chat.component';
import ErrorIcon from '../../../assets/icons/error-icon.svg';
import BoxForm from '../../components/box-form.component';

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
  const [isSharing, setSharing] = useState(false);
  const [shareLink, setShareLink] = useState<string>(null);

  useEffect(() => {
    const bootstrap = async () => {
      const box = await axios.get(`${Config.API_URL}/boxes/${boxToken}`);
      setBox(box.data);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!isEditing && !isSharing) {
        navigation.navigate('Home');
        return true;
      }

      if (isEditing || isSharing) {
        setEditing(false);
        setSharing(false);
        return true;
      }

      return false;
    });

    return () => backHandler.remove();
  }, [isEditing, isSharing]);

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

  const generateInvite = async () => {
    const invite = await axios.post(`${Config.API_URL}/boxes/${box._id}/invite`, null);
    setShareLink(`https://berrybox.tv/i/${invite.data.link}`);
  };

  const shareInvite = async () => {
    try {
      await Share.share({
        title: 'Share an invite to this box (This invite will expire in 15 minutes)',
        message: shareLink,
      });
    } catch (error) {
      ToastAndroid.show('There was an unexpected error. Please try again', 5000);
    }
  };

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
            { permissions.includes('editBox') || permissions.includes('inviteUser') ? (
              <Collapsible
                collapsed={!isEditing && !isSharing}
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
                { isSharing ? (
                  <View>
                    <View style={[styles.headerContainer, { backgroundColor: colors.backgroundSecondaryAlternateColor }]}>
                      <Text style={[styles.titlePage, { color: colors.textColor }]}>Invite users</Text>
                      <Pressable onPress={() => setSharing(false)}>
                        <ErrorIcon width={20} height={20} fill={colors.textColor} style={{ marginRight: 10 }} />
                      </Pressable>
                    </View>
                    <View
                      style={[styles.container, { backgroundColor: colors.background, height: remainingHeight - 50, padding: 20 }]}
                    >
                      <Text style={{ color: colors.textColor, textAlign: 'center' }}>You can send this invite link to your friends</Text>
                      {shareLink ? (
                        <>
                          <View style={{ paddingVertical: 40 }}>
                            <View style={{
                              padding: 10, borderColor: colors.videoSeparator, borderWidth: 1, borderRadius: 5,
                            }}
                            >
                              <Text style={{ color: colors.textColor, fontWeight: '700', textAlign: 'center' }}>{shareLink}</Text>
                            </View>
                            <Text style={{ color: colors.textSystemColor, textAlign: 'center' }}>
                              This link will be valid for 15 minutes.
                            </Text>
                          </View>
                          <View>
                            <Pressable onPress={() => shareInvite()}>
                              <BxActionComponent options={{ text: 'Share the link' }} />
                            </Pressable>
                          </View>
                        </>
                      ) : (
                        <BxLoadingIndicator />
                      )}
                    </View>
                  </View>
                ) : null}
              </Collapsible>
            ) : null}
            <Queue
              box={box}
              user={user}
              queue={queue}
              currentVideo={currentQueueItem}
              height={remainingHeight}
              berryCount={berryCount}
              permissions={permissions}
              onEdit={() => setEditing(!isEditing)}
              onShare={() => { setSharing(true); generateInvite(); }}
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
