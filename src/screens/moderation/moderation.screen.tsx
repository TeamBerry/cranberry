import React from 'react';
import {
  StyleSheet, Text, View, Pressable, Image,
} from 'react-native';
import { connect } from 'react-redux';
import { getUser } from '../../redux/selectors';
import { AuthSubject } from '../../models/session.model';
import { useTheme } from '../../shared/theme.context';

import BackIcon from '../../../assets/icons/back-icon.svg';
import BxLoadingIndicator from '../../components/bx-loading-indicator.component';

const ModerationScreen = (props: {
    navigation, user: AuthSubject
}) => {
  const { navigation, user } = props;
  const { colors } = useTheme();

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
      alignItems: 'center',
    },
    settingTitle: {
      color: colors.textColor,
      marginLeft: 30,
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 18,
    },
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
  });

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.headerStyle}>
          <Pressable
            onPress={() => navigation.navigate('Home')}
          >
            <BackIcon width={20} height={20} fill={colors.textColor} />
          </Pressable>
          <Text style={styles.settingTitle}>Moderation</Text>
        </View>
      </View>
      {user ? (
        <View style={{ paddingHorizontal: 10, backgroundColor: colors.background, height: '100%' }}>
          <Text style={{
            color: colors.textSystemColor, fontSize: 11, textAlign: 'center', marginVertical: 10,
          }}
          >
            You can adjust the actions available to the users in your boxes.
          </Text>
          <Text style={styles.settingSectionTitle}>Customizable Roles</Text>
          <Pressable
            style={styles.roleContainer}
            onPress={() => navigation.navigate('Permissions', { role: 'moderator' })}
          >
            <View style={styles.roleSpace}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  style={{ width: 16, height: 16, marginRight: 5 }}
                  source={require('../../../assets/badges/moderator-badge.png')}
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
                  source={require('../../../assets/badges/vip-badge.png')}
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
                  source={require('../../../assets/badges/creator-badge.png')}
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
                  source={require('../../../assets/badges/staff-badge.png')}
                />
                <Text style={styles.roleTitle}>Staff</Text>
              </View>
              <Text style={styles.roleDescription}>
                Staff members will always have all privileges. They will usually help you and your moderators.
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <BxLoadingIndicator />
      )}
    </>
  );
};

export default connect((state) => getUser(state))(ModerationScreen);
