import React, { useState } from 'react';
import {
  Image, Pressable, Text, StyleSheet, View,
} from 'react-native';
import { ActiveSubscriber, Role, Permission } from '@teamberry/muscadine';
import { RadioButton } from 'react-native-paper';
import { useTheme } from '../../../shared/theme.context';
import EmbeddedBackButton from '../../../components/embedded-back-button.component';
import ProfilePicture from '../../../components/profile-picture.component';
import Box from '../../../models/box.model';
import BxActionComponent from '../../../components/bx-action.component';

const UserDetails = (props: {
    selectedUser: ActiveSubscriber,
    boxAcl: Box['acl'],
    permissions: Array<Permission>,
    goBack: () => void,
    onRoleChange: (target: string, role: Role) => void
}) => {
  const {
    selectedUser, boxAcl, permissions, goBack, onRoleChange,
  } = props;
  const { colors } = useTheme();
  const [selectedRole, setSelectedRole] = useState<Role>(selectedUser.role);

  const styles = StyleSheet.create({
    roleSelectorContainer: {
      backgroundColor: colors.backgroundChatColor,
      padding: 20,
      borderRadius: 5,
      marginTop: 10,
    },
    roleTitle: {
      fontSize: 12,
      color: colors.textColor,
      fontFamily: 'Montserrat-SemiBold',
    },
  });

  return (
    <>
      <EmbeddedBackButton text="Back to users" onPress={goBack} />
      <View style={{ padding: 20 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ marginRight: 14 }}>
            <ProfilePicture fileName={selectedUser.settings.picture} size={50} isOnline={selectedUser.origin !== null} />
          </View>
          <Text style={{ fontFamily: 'Montserrat-SemiBold', color: colors.textColor, fontSize: 20 }}>{selectedUser.name}</Text>
        </View>
        <View style={styles.roleSelectorContainer}>
          <Text style={{ color: colors.textSystemColor, fontFamily: 'Montserrat-SemiBold', marginBottom: 10 }}>Assign role</Text>
          {permissions.includes('setModerator') ? (
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  style={{ width: 16, height: 16, marginRight: 5 }}
                  source={{ uri: 'https://role-badges.s3-eu-west-1.amazonaws.com/moderator-badge.png' }}
                />
                <Text style={styles.roleTitle}>Moderator</Text>
              </View>
              <RadioButton
                value="moderator"
                status={selectedRole === 'moderator' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedRole('moderator')}
              />
            </View>
          ) : null}
          {(['setVIP', 'unsetVIP'] as Permission[]).some((p) => permissions.includes(p)) ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  style={{ width: 16, height: 16, marginRight: 5 }}
                  source={{ uri: 'https://role-badges.s3-eu-west-1.amazonaws.com/vip-badge.png' }}
                />
                <Text style={styles.roleTitle}>VIP</Text>
              </View>
              <RadioButton
                value="vip"
                status={selectedRole === 'vip' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedRole('vip')}
              />
            </View>
          ) : null}
          { (['setModerator', 'setVIP'] as Permission[]).some((p) => permissions.includes(p)) ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.roleTitle}>Community</Text>
              </View>
              <RadioButton
                value="simple"
                status={selectedRole === 'simple' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedRole('simple')}
              />
            </View>
          ) : null}
          <Pressable onPress={() => onRoleChange(selectedUser._id, selectedRole)}>
            <BxActionComponent options={{ text: 'Assign Role' }} />
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default UserDetails;
