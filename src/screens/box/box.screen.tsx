import React, { useState, useEffect } from 'react';
import {
  View, useWindowDimensions, BackHandler, Text, Pressable, StyleSheet, KeyboardAvoidingView, ScrollView, Share, ToastAndroid,
} from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import Config from 'react-native-config';
import { connect } from 'react-redux';

import {
  SyncPacket, BerryCount, Permission, FeedbackMessage, PlayingItem, QueueItem,
} from '@teamberry/muscadine';
import { Snackbar, Switch } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import { Formik } from 'formik';
import * as yup from 'yup';
import { getUser } from '../../redux/selectors';
import Player from './components/player.component';
import Box from '../../models/box.model';
import BoxContext from './box.context';
import Queue from './components/queue.component';
import OfflineNotice from '../../components/offline-notice.component';
import BxLoadingIndicator from '../../components/bx-loading-indicator.component';
import { useTheme } from '../../shared/theme.context';
import BxActionComponent from '../../components/bx-action.component';
import FormTextInput from '../../components/form-text-input.component';
import { BoxOptions } from '../create-box.screen';
import RandomIcon from '../../../assets/icons/random-icon.svg';
import ReplayIcon from '../../../assets/icons/replay-icon.svg';
import BerriesIcon from '../../../assets/icons/coin-enabled-icon.svg';
import LockIcon from '../../../assets/icons/lock-icon.svg';
import DurationRestrictionIcon from '../../../assets/icons/duration-limit-icon.svg';
import { AuthSubject } from '../../models/session.model';
import Chat from './components/chat.component';
import ErrorIcon from '../../../assets/icons/error-icon.svg';

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

  let socketConnection = null;

  const [box, setBox] = useState<Box>(null);
  const [queue, setQueue] = useState<Array<QueueItem | PlayingItem>>([]);
  const [socket, setSocket] = useState(null);
  const [boxKey, setBoxKey] = useState<string>(null);
  const [currentQueueItem, setCurrentQueueItem] = useState<PlayingItem>(null);
  const [berryCount, setBerryCount] = useState(0);
  const [isConnected, setConnectionStatus] = useState(null);
  const [permissions, setPermissions] = useState<Array<Permission>>([]);
  const [feedback, setFeedbackMessage] = useState<FeedbackMessage>(null);
  const { colors } = useTheme();

  // Editing
  const [isEditing, setEditing] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
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

  const updateBox = async (boxInputData: { name: string, private: boolean, options: BoxOptions }) => {
    setUpdating(true);
    try {
      const updatedBox = await axios.put(`${Config.API_URL}/boxes/${boxToken}`, {
        _id: boxToken, ...boxInputData, acl: box.acl, description: box.description, lang: box.lang,
      });
      setEditing(false);
      setUpdated(true);
      setUpdating(false);
      setBox(updatedBox.data);
    } catch (error) {
      setUpdating(false);
    }
  };

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
        {isConnected && box && berryCount !== null && permissions ? (
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
                      <ScrollView>
                        <Formik
                          initialValues={{
                            name: box.name,
                            private: box.private,
                            random: box.options.random,
                            loop: box.options.loop,
                            berries: box.options.berries,
                            videoMaxDurationLimit: box.options.videoMaxDurationLimit.toString(),
                          }}
                          validationSchema={
                yup.object().shape({
                  name: yup
                    .string()
                    .required('The box name is required'),
                  private: yup
                    .boolean(),
                  random: yup
                    .boolean(),
                  loop: yup
                    .boolean(),
                  berries: yup
                    .boolean(),
                  videoMaxDurationLimit: yup
                    .number()
                    .positive('The duration cannot be negative.')
                    .integer()
                    .typeError('You must specify a number.')
                    .default(0),
                })
              }
                          onSubmit={(values) => updateBox({
                            name: values.name,
                            private: values.private,
                            options: {
                              random: values.random,
                              loop: values.loop,
                              berries: values.berries,
                              videoMaxDurationLimit: parseInt(values.videoMaxDurationLimit, 10),
                            },
                          })}
                        >
                          {({
                            handleChange, setFieldTouched, setFieldValue, handleSubmit, values, touched, errors, isValid,
                          }) => (
                            <View style={styles.form}>
                              <Text style={styles.sectionTitle}>Information</Text>
                              <View style={styles.modeContainer}>
                                <Text style={[styles.modeTitle, { color: colors.textSecondaryColor }]}>Box Name</Text>
                                <FormTextInput
                                  value={values.name}
                                  onChangeText={handleChange('name')}
                                  onBlur={() => setFieldTouched('name')}
                                  placeholder="Box Name"
                                  autoCorrect={false}
                                  returnKeyType="next"
                                />
                                {touched.name && errors.name && <Text style={{ fontSize: 12, color: '#EB172A' }}>{errors.name}</Text>}
                              </View>
                              <View style={styles.modeContainer}>
                                <View style={styles.modeSpace}>
                                  <View style={styles.modeDefinition}>
                                    <View style={{ paddingRight: 5 }}>
                                      <LockIcon width={20} height={20} fill={colors.textColor} />
                                    </View>
                                    <Text style={[styles.modeTitle, { color: colors.textSecondaryColor }]}>Access Restriction</Text>
                                  </View>
                                  <Switch
                                    value={values.private}
                                    onValueChange={(value) => setFieldValue('private', value)}
                                    color="#009AEB"
                                  />
                                </View>
                                <Text style={{ color: colors.textSystemColor }}>
                                  Your box will not appear publicly. You may grant access by sharing invite links.
                                </Text>
                              </View>
                              <View style={{
                                borderBottomColor: '#777777',
                                borderBottomWidth: 1,
                              }}
                              />
                              <Text style={styles.sectionTitle}>Settings</Text>
                              <View style={styles.modeContainer}>
                                <View style={styles.modeSpace}>
                                  <View style={styles.modeDefinition}>
                                    <View style={{ paddingRight: 5 }}>
                                      <RandomIcon width={20} height={20} fill={colors.textColor} />
                                    </View>
                                    <Text style={[styles.modeTitle, { color: colors.textSecondaryColor }]}>Pick Videos at Random</Text>
                                  </View>
                                  <Switch
                                    value={values.random}
                                    onValueChange={(value) => setFieldValue('random', value)}
                                    color="#009AEB"
                                  />
                                </View>
                                <Text style={{ color: colors.textSystemColor }}>
                                  Videos will be played randomly from the queue.
                                </Text>
                              </View>
                              <View style={styles.modeContainer}>
                                <View style={styles.modeSpace}>
                                  <View style={styles.modeDefinition}>
                                    <View style={{ paddingRight: 5 }}>
                                      <ReplayIcon width={20} height={20} fill={colors.textColor} />
                                    </View>
                                    <Text style={[styles.modeTitle, { color: colors.textSecondaryColor }]}>Loop Queue</Text>
                                  </View>
                                  <Switch
                                    value={values.loop}
                                    onValueChange={(value) => setFieldValue('loop', value)}
                                    color="#009AEB"
                                  />
                                </View>
                                <Text style={{ color: colors.textSystemColor }}>Played videos will be automatically requeued.</Text>
                              </View>
                              <View style={styles.modeContainer}>
                                <View style={styles.modeSpace}>
                                  <View style={styles.modeDefinition}>
                                    <View style={{ paddingRight: 5 }}>
                                      <DurationRestrictionIcon width={20} height={20} fill={colors.textColor} />
                                    </View>
                                    <Text style={[styles.modeTitle, { color: colors.textSecondaryColor }]}>Duration Restriction</Text>
                                  </View>
                                </View>
                                <Text style={{ color: colors.textSystemColor }}>
                                  Videos that exceed the set limit (in minutes) will not be accepted into the queue. Specifying 0 or
                                  nothing will disable this restriction.
                                </Text>
                                <View style={{ paddingVertical: 5 }}>
                                  <FormTextInput
                                    value={values.videoMaxDurationLimit}
                                    onChangeText={handleChange('videoMaxDurationLimit')}
                                    onBlur={() => setFieldTouched('videoMaxDurationLimit')}
                                    placeholder="Set the duration restriction (in minutes)"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                    keyboardType="numeric"
                                  />
                                  {touched.videoMaxDurationLimit && errors.videoMaxDurationLimit && <Text style={{ fontSize: 12, color: '#EB172A' }}>{errors.videoMaxDurationLimit}</Text>}
                                </View>
                              </View>
                              <View style={styles.modeContainer}>
                                <View style={styles.modeSpace}>
                                  <View style={styles.modeDefinition}>
                                    <View style={{ paddingRight: 5 }}>
                                      <BerriesIcon width={20} height={20} fill={colors.textColor} />
                                    </View>
                                    <Text style={[styles.modeTitle, { color: colors.textSecondaryColor }]}>Berries System</Text>
                                  </View>
                                  <Switch
                                    value={values.berries}
                                    onValueChange={(value) => setFieldValue('berries', value)}
                                    color="#009AEB"
                                  />
                                </View>
                                <Text style={{ color: colors.textSystemColor }}>
                                  Your users will be able to collect Berries while they are in your box. They will then be able to spend
                                  the berries to skip a video or select the next video to play.
                                </Text>
                              </View>
                              {!isUpdating ? (
                                <Pressable onPress={() => handleSubmit()} disabled={!isValid}>
                                  <BxActionComponent options={{ text: 'Save Modifications' }} />
                                </Pressable>
                              ) : (
                                <BxLoadingIndicator />
                              )}
                            </View>
                          )}
                        </Formik>
                      </ScrollView>
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
