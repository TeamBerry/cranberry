import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, Pressable, ScrollView, Switch, ToastAndroid,
} from 'react-native';

import { connect } from 'react-redux';
import { ACLConfig, Permission } from '@teamberry/muscadine';
import Config from 'react-native-config';
import axios from 'axios';
import { getUser } from '../../redux/selectors';
import { useTheme } from '../../shared/theme.context';
import BackIcon from '../../../assets/icons/back-icon.svg';
import BerriesIcon from '../../../assets/icons/berry-coin-icon.svg';
import { AuthSubject } from '../../models/session.model';
import BxLoadingIndicator from '../../components/bx-loading-indicator.component';
import BxActionComponent from '../../components/bx-action.component';

const PermissionsScreen = (props: { route, navigation, user: AuthSubject }) => {
  const { route, navigation, user } = props;
  const { role } = route.params;
  const { colors } = useTheme();
  const [acl, setAcl] = useState<ACLConfig>();
  const [currentAcl, setCurrentAcl] = useState<Array<Permission>>();

  const sections: Array<{
        name: string,
        permissions: Array<{ key: Permission, name: string, explanation: string, withBerries: boolean }>
    }> = [
      {
        name: 'Queue Actions',
        permissions: [
          {
            key: 'addVideo',
            name: 'Add video',
            explanation: 'Adds a video to the playing queue.',
            withBerries: false,
          },
          {
            key: 'bypassVideoDurationLimit',
            name: 'Bypass Duration Restriction',
            explanation: 'Allows the submission of videos longer than the maximum duration allowed',
            withBerries: false,
          },
          {
            key: 'removeVideo',
            name: 'Remove video',
            explanation: 'Removes a video from the queue',
            withBerries: false,
          },
          {
            key: 'skipVideo',
            name: 'Skip video',
            explanation: 'Skips the currently playing video',
            withBerries: true,
          },
          {
            key: 'forceNext',
            name: 'Add video to Priority Queue',
            explanation: 'Puts the selected video in the priority queue.',
            withBerries: true,
          },
          {
            key: 'forcePlay',
            name: 'Force play a video',
            explanation: 'Skips the currently playing video for the selected one.',
            withBerries: true,
          },
        ],
      },
      {
        name: 'Box Actions',
        permissions: [
          {
            key: 'editBox',
            name: 'Edit Box',
            explanation: null,
            withBerries: false,
          },
          {
            key: 'bypassBerries',
            name: 'Bypass Berries',
            explanation: 'Allows to bypass any action that consumed berries. With this permission, skipping a video played with berries is possible.',
            withBerries: false,
          },
        ],
      },
      {
        name: 'User Actions',
        permissions: [
        //   {
        //     key: 'promoteVIP',
        //     name: 'Promote an user to VIP',
        //     explanation: 'Only you can promote Moderators',
        //     withBerries: false,
        //   },
        //   {
        //     key: 'demoteVIP',
        //     name: 'Demote an user from VIP',
        //     explanation: null,
        //     withBerries: false,
        //   },
          {
            key: 'inviteUser',
            name: 'Invite users to the box',
            explanation: 'Allows users to generate an invite link to the box',
            withBerries: false,
          },
        ],
      },
    ];

  useEffect(() => {
    const bootstrap = async () => {
      const userRequest = await axios.get(`${Config.API_URL}/users/me`);
      setAcl(userRequest.data.acl);
      setCurrentAcl(userRequest.data.acl[role]);
    };

    bootstrap();
  }, [role]);

  const togglePermission = (permission: Permission) => {
    const permissionIndex = currentAcl.findIndex((p) => p === permission);
    if (permissionIndex !== -1) {
      currentAcl.splice(permissionIndex, 1);
    } else {
      currentAcl.push(permission);
    }
    // Re-rendering
    setCurrentAcl([...currentAcl]);
  };

  const updateACL = async () => {
    try {
      await axios.patch(`${Config.API_URL}/users/acl`, acl);
      ToastAndroid.show('Moderation template updated.', 3000);
    } catch (error) {
      ToastAndroid.show('Could not update your moderation template. Please try again.', 3000);
    }
  };

  const styles = StyleSheet.create({
    headerContainer: {
      paddingVertical: 20,
      paddingHorizontal: 10,
      borderColor: '#191919',
      borderStyle: 'solid',
      borderBottomWidth: 1,
      backgroundColor: colors.background,
    },
    headerStyle: {
      height: 20,
      elevation: 0,
      shadowOpacity: 0,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    previewContainer: {
      marginTop: 20,
    },
    preview: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 20,
    },
    colorPreview: {
      width: 150,
      padding: 10,
      borderRadius: 5,
      textAlign: 'center',
      borderWidth: 1,
      borderColor: '#B3B3B3',
    },
    settingTitle: {
      color: colors.textColor,
      marginLeft: 30,
      fontFamily: 'Montserrat-SemiBold',
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

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.headerStyle}>
          <Pressable
            onPress={() => navigation.pop()}
          >
            <BackIcon width={20} height={20} fill={colors.textColor} />
          </Pressable>
          <Text style={styles.settingTitle}>Update role</Text>
        </View>
      </View>
      <View style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5,
      }}
      >
        <BerriesIcon width={20} height={20} style={{ marginRight: 5 }} />
        <Text style={{
          color: colors.textSystemColor, fontSize: 11, textAlign: 'center', marginVertical: 10, flex: 1,
        }}
        >
          Permissions with this icon will require berries if they are disabled.
          You can disable berries when creating your box.
        </Text>
      </View>
      { user && acl && currentAcl ? (
        <ScrollView style={styles.form}>
          { sections.map((section, index) => (
            <React.Fragment key={index.toString()}>
              <Text style={styles.sectionTitle}>{section.name}</Text>
              {section.permissions.map((permission) => (
                <React.Fragment key={permission.key}>
                  <View style={styles.modeContainer}>
                    <View style={styles.modeSpace}>
                      <View style={styles.modeDefinition}>
                        {permission.withBerries ? (
                          <BerriesIcon width={20} height={20} style={{ marginRight: 5 }} />
                        ) : null}
                        <Text style={[styles.modeTitle, { color: colors.textSecondaryColor }]}>{permission.name}</Text>
                      </View>
                      <Switch
                        value={currentAcl.includes(permission.key)}
                        onValueChange={() => togglePermission(permission.key)}
                        trackColor={{
                          false: colors.inactiveColor,
                          true: colors.activeColor,
                        }}
                        thumbColor="white"
                      />
                    </View>
                    {permission.explanation ? (
                      <Text style={{ color: colors.textSystemColor }}>
                        {permission.explanation}
                      </Text>
                    ) : null}
                  </View>
                </React.Fragment>
              ))}
              {index < sections.length - 1 ? (
                <View style={{
                  borderBottomColor: '#777777',
                  borderBottomWidth: 1,
                }}
                />
              ) : null}
            </React.Fragment>
          ))}
          <Pressable onPress={() => updateACL()}>
            <BxActionComponent options={{ text: 'Save Modifications' }} />
          </Pressable>
        </ScrollView>
      ) : (
        <BxLoadingIndicator />
      )}
    </>
  );
};

export default connect((state) => getUser(state))(PermissionsScreen);
