import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, Pressable, ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Switch } from 'react-native-paper';
import axios from 'axios';
import Config from 'react-native-config';
import { useTheme } from '../../shared/theme.context';

import BackIcon from '../../../assets/icons/back-icon.svg';
import ProfilePicture from '../../components/profile-picture.component';
import { AuthSubject } from '../../models/session.model';
import BxLoadingIndicator from '../../components/bx-loading-indicator.component';
import AuthContext from '../../shared/auth.context';

const SettingsScreen = ({ navigation }) => {
  const [user, setUser] = useState<AuthSubject>(null);
  const [isColorblind, setColorblindSetting] = useState(user?.settings?.isColorblind ?? false);
  const { colors } = useTheme();
  const { refreshSettings } = useContext(AuthContext);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const authSubject: AuthSubject = JSON.parse(await AsyncStorage.getItem('BBOX-user'));
        setUser(authSubject);
        setColorblindSetting(authSubject.settings.isColorblind);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Session could not be obtained', e);
      }
    };

    bootstrap();
  }, []);

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
      justifyContent: 'space-between',
    },
    loginLink: {
      textTransform: 'uppercase',
      color: '#009AEB',
      fontFamily: 'Montserrat-SemiBold',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 40,
      backgroundColor: colors.background,
    },
    form: {
      flex: 1,
      width: 320,
      paddingBottom: 20,
    },
    image: {
      height: 100,
      width: 100,
    },
    userName: {
      color: colors.textColor,
    },
    accountSummary: {
      backgroundColor: colors.backgroundAlternateColor,
      paddingVertical: 20,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    setting: {
      paddingVertical: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    settingSpace: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    settingName: {
      color: colors.textColor,
    },
    settingValue: {
      color: colors.textSystemColor,
    },
    userColor: {
      width: 15,
      height: 15,
      borderRadius: 4,
      marginHorizontal: 5,
    },
    helpText: {
      color: colors.inactiveColor,
      fontSize: 9,
    },
  });

  const onPictureChange = () => {
    console.log('REQUEST ACCESS TO PICTURES');
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.headerStyle}>
          <Pressable
            onPress={() => navigation.navigate('Home')}
          >
            <BackIcon width={20} height={20} fill={colors.textColor} />
          </Pressable>
        </View>
      </View>
      {user ? (
        <>
          <View style={styles.accountSummary}>
            <Pressable onPress={onPictureChange}>
              <ProfilePicture userId={user._id} size={70} style={{ borderWidth: 1, borderColor: '#0C9AEB', marginRight: 20 }} />
            </Pressable>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <View style={styles.setting}>
              <>
                <Text style={styles.settingName}>Change password</Text>
              </>
              <BackIcon height={20} width={20} fill={colors.textSystemColor} rotation={180} />
            </View>
            <Pressable
              style={styles.setting}
              onPress={() => navigation.push('ColorSelect',
                { color: user.settings.color, name: user.name })}
            >
              <View style={styles.settingSpace}>
                <Text style={styles.settingName}>Username color</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={[styles.userColor, { backgroundColor: user.settings.color }]} />
                  <Text style={[styles.settingValue, { color: user.settings.color }]}>{user.name}</Text>
                </View>
              </View>
              <BackIcon height={20} width={20} fill={colors.textSystemColor} rotation={180} />
            </Pressable>
            <View style={styles.setting}>
              <View style={styles.settingSpace}>
                <View>
                  <Text style={styles.settingName}>Colorblind Mode</Text>
                  <Text style={styles.helpText}>Removes all custom colors from your chat.</Text>
                </View>
                <Switch
                  value={isColorblind}
                  onValueChange={(value) => refreshSettings({ isColorblind: value })}
                  color="#009AEB"
                />
              </View>
            </View>
          </View>
        </>
      ) : (
        <BxLoadingIndicator />
      )}
    </>
  );
};

export default SettingsScreen;
