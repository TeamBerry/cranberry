import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Pressable, Image,
} from 'react-native';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import Collapsible from 'react-native-collapsible';
import { getUser } from '../../redux/selectors';
import { AuthSubject } from '../../models/session.model';
import { useTheme } from '../../shared/theme.context';

import BackIcon from '../../../assets/icons/back-icon.svg';
import BxLoadingIndicator from '../../components/bx-loading-indicator.component';
import BxHeader from '../../components/bx-header.component';

const ModerationScreen = (props: {
    navigation, user: AuthSubject
}) => {
  const { navigation, user } = props;
  const { colors } = useTheme();
  const [isHelperOpen, setHelperState] = useState(false);

  const styles = StyleSheet.create({
    roleContainer: {
      paddingVertical: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    roleSpace: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    roleTitle: {
      fontSize: 20,
      color: colors.textColor,
      fontFamily: 'Montserrat-SemiBold',
    },
    roleDescription: {
      color: colors.textSystemColor,
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: colors.videoSeparator,
      marginVertical: 5,
    },
    settingSectionTitle: {
      fontSize: 14,
      textTransform: 'uppercase',
      fontWeight: '700',
      color: colors.textSystemColor,
      marginTop: 10,
    },
    helpButton: {
      height: 40,
      backgroundColor: colors.backgroundSecondaryAlternateColor,
      borderRadius: 3,
      flex: 0,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      marginVertical: 5,
      marginHorizontal: 10,
    },
  });

  return (
    <>
      <BxHeader text="Moderation" onPress={() => navigation.navigate('Home')} />
      {user ? (
        <ScrollView style={{ backgroundColor: colors.background, height: '100%' }}>
          <Text style={{
            color: colors.textSystemColor, fontSize: 11, textAlign: 'center', marginVertical: 10,
          }}
          >
            You can adjust the actions available to the users in your boxes.
          </Text>
          <Pressable
            onPress={() => setHelperState(!isHelperOpen)}
            android_ripple={{ color: colors.activeColor }}
            style={styles.helpButton}
          >
            <Text style={{ color: colors.textSystemColor }}>Need some help? Tap me!</Text>
          </Pressable>
          <Collapsible collapsed={!isHelperOpen} style={{ backgroundColor: colors.backgroundAlternateColor }}>
            <View style={{ margin: 10 }}>
              <Text style={{ color: colors.textSystemColor, fontWeight: '700' }}>
                Permissions work like this:
              </Text>
              <Text style={{ color: colors.textSystemColor, marginVertical: 5 }}>
                <Text style={{ color: colors.activeColor }}> ● </Text>
                Users can only have one role.
              </Text>
              <Text style={{ color: colors.textSystemColor, marginVertical: 5 }}>
                <Text style={{ color: colors.activeColor }}> ● </Text>
                Only you (the box creator) can promote your Moderators.
              </Text>
              <Text style={{ color: colors.textSystemColor, marginVertical: 5 }}>
                <Text style={{ color: colors.activeColor }}> ● </Text>
                Permissions are not cumulative! Which means promoting someone might make them lose some
                privileges. Adjust your roles carefully.
              </Text>
              <Text style={{ color: colors.textSystemColor, marginVertical: 5 }}>
                <Text style={{ color: colors.activeColor }}> ● </Text>
                As box creator, you will always have all privileges.
              </Text>
            </View>
          </Collapsible>
          <View style={{ marginHorizontal: 10 }}>
            <Text style={styles.settingSectionTitle}>Customizable Roles</Text>
            <Pressable
              style={styles.roleContainer}
              onPress={() => navigation.navigate('Permissions', { role: 'moderator' })}
            >
              <View style={styles.roleSpace}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={{ width: 16, height: 16, marginRight: 5 }}
                    source={{ uri: 'https://role-badges.s3-eu-west-1.amazonaws.com/moderator-badge.png' }}
                  />
                  <Text style={styles.roleTitle}>Moderators</Text>
                </View>
                <Text style={styles.roleDescription}>
                  Use this role for users you trust. Moderators should be able to enforce your rules when you are not
                  present in one of your boxes.
                </Text>
              </View>
              <BackIcon height={20} width={20} fill={colors.textSystemColor} rotation={180} />
            </Pressable>
            <Pressable
              style={styles.roleContainer}
              onPress={() => navigation.navigate('Permissions', { role: 'vip' })}
            >
              <View style={styles.roleSpace}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={{ width: 16, height: 16, marginRight: 5 }}
                    source={{ uri: 'https://role-badges.s3-eu-west-1.amazonaws.com/vip-badge.png' }}
                  />
                  <Text style={styles.roleTitle}>VIPs</Text>
                </View>
                <Text style={styles.roleDescription}>
                  Give this role to special users of your community.
                </Text>
              </View>
              <BackIcon height={20} width={20} fill={colors.textSystemColor} rotation={180} />
            </Pressable>
            <Pressable
              style={styles.roleContainer}
              onPress={() => navigation.navigate('Permissions', { role: 'simple' })}
            >
              <View style={styles.roleSpace}>
                <Text style={styles.roleTitle}>Community Members</Text>
                <Text style={styles.roleDescription}>
                  This role is the default role automatically given to every member of your communities.
                </Text>
              </View>
              <BackIcon height={20} width={20} fill={colors.textSystemColor} rotation={180} />
            </Pressable>
            <View style={styles.separator} />
            <Text style={styles.settingSectionTitle}>Special Roles</Text>
            <View
              style={styles.roleContainer}
            >
              <View style={styles.roleSpace}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={{ width: 16, height: 16, marginRight: 5 }}
                    source={{ uri: 'https://role-badges.s3-eu-west-1.amazonaws.com/creator-badge.png' }}
                  />
                  <Text style={styles.roleTitle}>Box Creator</Text>
                </View>
                <Text style={styles.roleDescription}>
                  This role is the one you will have when you create a box.
                  You cannot take it off and it gives you all privileges at all times.
                </Text>
              </View>
            </View>
            <View
              style={styles.roleContainer}
            >
              <View style={styles.roleSpace}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={{ width: 16, height: 16, marginRight: 5 }}
                    source={{ uri: 'https://role-badges.s3-eu-west-1.amazonaws.com/staff-badge.png' }}
                  />
                  <Text style={styles.roleTitle}>Staff</Text>
                </View>
                <Text style={styles.roleDescription}>
                  Staff members will always have all privileges. They will usually help you and your moderators.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <BxLoadingIndicator />
      )}
    </>
  );
};

export default connect((state) => getUser(state))(ModerationScreen);
