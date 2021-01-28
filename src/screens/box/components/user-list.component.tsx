import { ActiveSubscriber, Permission, Role } from '@teamberry/muscadine';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Image, Pressable, Share, StyleSheet, Text, ToastAndroid, View,
} from 'react-native';
import Config from 'react-native-config';
import { ScrollView } from 'react-native-gesture-handler';
import { Socket } from 'socket.io-client';
import { RoleChangeRequest } from '@teamberry/muscadine/dist/interfaces/acl.interface';
import BxLoadingIndicator from '../../../components/bx-loading-indicator.component';
import ProfilePicture from '../../../components/profile-picture.component';
import Box from '../../../models/box.model';
import { AuthSubject } from '../../../models/session.model';
import { useTheme } from '../../../shared/theme.context';

import InviteIcon from '../../../../assets/icons/invite-icon.svg';
import BxActionComponent from '../../../components/bx-action.component';
import EmbeddedBackButton from '../../../components/embedded-back-button.component';
import UserDetails from './user-details.component';

export type UsersDisplaySchema = Array<{
    title: string,
    icon: string,
    context: Exclude<Role, 'admin'>,
    actionsDisplayed: boolean,
    list: Array<ActiveSubscriber>
}>

const UserList = (props: {
    user: AuthSubject,
    permissions: Array<Permission>,
    box: Box,
    socket: Socket,
    height: number
}) => {
  const {
    user, permissions, box, height, socket,
  } = props;
  const [users, setUsers] = useState<UsersDisplaySchema>([]);

  // Sharing
  const [isSharing, setSharing] = useState(false);
  const [shareLink, setShareLink] = useState<string>(null);

  const [selectedUser, setSelectedUser] = useState <ActiveSubscriber>(null);

  const { colors } = useTheme();

  const getUsers = async () => {
    const userlistRequest = await axios.get<Array<ActiveSubscriber>>(`${Config.API_URL}/boxes/${box._id}/users`);
    const { data } = userlistRequest;

    const users: UsersDisplaySchema = [
      {
        title: 'Creator',
        icon: 'https://role-badges.s3-eu-west-1.amazonaws.com/creator-badge.png',
        context: null,
        actionsDisplayed: false,
        list: data.filter((s) => s._id === box.creator._id),
      },
      {
        title: 'Moderators',
        icon: 'https://role-badges.s3-eu-west-1.amazonaws.com/moderator-badge.png',
        context: 'moderator',
        actionsDisplayed: permissions.includes('setModerator'),
        list: data.filter((s) => s.role === 'moderator'),
      },
      {
        title: 'VIPs',
        icon: 'https://role-badges.s3-eu-west-1.amazonaws.com/vip-badge.png',
        context: 'vip',
        actionsDisplayed: (['setVIP', 'unsetVIP'] as Permission[]).some((p) => permissions.includes(p)),
        list: data.filter((s) => s.role === 'vip'),
      },
      {
        title: 'Community Members',
        icon: null,
        context: 'simple',
        actionsDisplayed: (['setModerator', 'setVIP'] as Permission[]).some((p) => permissions.includes(p)),
        list: data.filter((s) => s.role === 'simple'),
      },
    ];

    setUsers(users);
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isSharing || selectedUser) {
        setSharing(false);
        setSelectedUser(null);
        return true;
      }

      return false;
    });

    return () => backHandler.remove();
  }, [isSharing, selectedUser]);

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

  const assignRole = (target: string, role: Role) => {
    socket.emit('roleChange', {
      scope: {
        userToken: target,
        boxToken: box._id,
      },
      role,
      source: user._id,
    } as RoleChangeRequest);

    setTimeout(() => getUsers(), 4000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 0,
      height: height - 50,
      backgroundColor: colors.background,
    },
    roleTitleContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      paddingLeft: 20,
    },
    roleTitle: {
      color: colors.textColor,
      fontFamily: 'Montserrat-SemiBold',
      textTransform: 'uppercase',
      fontSize: 11,
    },
    userNameContainer: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      marginBottom: 10,
      paddingLeft: 20,
      paddingVertical: 5,
    },
    userName: {
      marginLeft: 5,
      fontSize: 11,
      fontFamily: 'Montserrat-Regular',
      color: colors.textColor,
    },
    fab: {
      position: 'absolute',
      marginRight: 10,
      marginBottom: 40,
      right: 0,
      bottom: 0,
      backgroundColor: '#009AEB',
      padding: 15,
      borderRadius: 30,
      elevation: 10,
    },
  });

  return (
    <View style={styles.container}>
      { !isSharing ? (
        <>
          { !selectedUser ? (
            <>
              <ScrollView>
                <View style={{ paddingVertical: 20 }}>
                  {users && users.map((section) => (
                    <React.Fragment key={section.context}>
                      <View style={{ marginBottom: 10 }}>
                        <View style={styles.roleTitleContainer}>
                          {section.icon ? (
                            <Image
                              style={{ width: 18, height: 18, marginRight: 10 }}
                              source={{ uri: section.icon }}
                            />
                          ) : null}
                          <Text style={styles.roleTitle}>
                            {section.title}
                            {' '}
                            -
                            {' '}
                            {section.list.length}
                          </Text>
                        </View>
                        {section.list.map((member) => (
                          <React.Fragment key={member._id}>
                            <Pressable
                              style={styles.userNameContainer}
                              onPress={() => {
                                if (section.actionsDisplayed && member._id !== user._id) {
                                  setSelectedUser(selectedUser !== member ? member : null);
                                }
                              }}
                              android_ripple={{ color: colors.backgroundAlternateColor }}
                            >
                              <View style={{ marginRight: 7 }}>
                                <ProfilePicture fileName={member.settings.picture} size={30} isOnline={member.origin !== null} />
                              </View>
                              <Text style={styles.userName}>{member.name}</Text>
                            </Pressable>
                          </React.Fragment>
                        ))}
                      </View>
                    </React.Fragment>
                  ))}
                </View>
              </ScrollView>
              {permissions.includes('inviteUser') ? (
                <Pressable
                  style={styles.fab}
                  onPress={() => { setSharing(true); generateInvite(); }}
                  android_ripple={{ color: '#47B4EE', radius: 28 }}
                >
                  <InviteIcon width={25} height={25} fill="white" />
                </Pressable>
              ) : null}
            </>
          ) : (
            <UserDetails
              selectedUser={selectedUser}
              permissions={permissions}
              goBack={() => setSelectedUser(null)}
              onRoleChange={assignRole}
            />
          )}
        </>
      ) : (
        <>
          <EmbeddedBackButton text="Back to users" onPress={() => setSharing(false)} />
          <View style={{ padding: 20 }}>
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
        </>
      )}
    </View>
  );
};

export default UserList;
