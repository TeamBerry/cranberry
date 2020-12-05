import React, { useState, useEffect, useContext } from 'react';
import {
  Text, View, StyleSheet, Pressable, Linking,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../shared/auth.context';
import ProfilePicture from './profile-picture.component';
import BxActionComponent from './bx-action.component';

import UserIcon from '../../assets/icons/user-icon.svg';
import { useTheme } from '../shared/theme.context';
import { AuthSubject } from '../models/session.model';

const CustomMenu = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<AuthSubject>(null);
  const { signOut } = useContext(AuthContext);
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: colors.backgroundSecondaryColor,
      justifyContent: 'space-between',
      padding: 0,
    },
    menuSpace: {
      paddingHorizontal: 20,
    },
    menuItem: {
      paddingVertical: 20,
    },
    userImage: {
      height: 50,
      width: 50,
      borderRadius: 25,
      alignSelf: 'center',
    },
    userName: {
      paddingTop: 10,
      fontSize: 20,
      fontFamily: 'Montserrat-SemiBold',
    },
    sectionSeparator: {
      height: 1,
      backgroundColor: colors.backgroundChatColor,
      marginVertical: 20,
    },
    identitySpace: {
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 40,
    },
    identityContainer: {
      flex: 1,
    },
  });

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setUser(JSON.parse(await AsyncStorage.getItem('BBOX-user')));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Session could not be obtained');
      }
    };

    bootstrap();
  }, []);

  const UserSpace = () => {
    if (!user?.mail) {
      return (
        <View style={styles.identityContainer}>
          <View style={[styles.identitySpace, { paddingHorizontal: 40 }]}>
            <View style={{ marginRight: 10 }}>
              <UserIcon width={40} height={40} fill={colors.textColor} />
            </View>
            <Text style={{ textAlign: 'center', color: colors.textColor }}>
              Sign up or login to create your own boxes,
              chat with users and more!
            </Text>
          </View>
          <View style={styles.sectionSeparator} />
          <View style={styles.menuSpace}>
            <Pressable onPress={() => navigation.navigate('SignIn')}>
              <BxActionComponent options={{ text: 'Log in' }} />
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.identityContainer}>
        <View style={styles.identitySpace}>
          <View style={{ marginRight: 10 }}>
            <ProfilePicture userId={user._id} size={50} />
          </View>
          <Text style={[styles.userName, { color: colors.textColor }]}>{user.name}</Text>
        </View>
        <View style={styles.sectionSeparator} />
        <View style={styles.menuSpace}>
          <Pressable onPress={() => navigation.navigate('Settings')} style={styles.menuItem}>
            <Text style={{ color: colors.textColor }}>Settings</Text>
          </Pressable>
          <Pressable onPress={() => signOut()}>
            <BxActionComponent options={{ text: 'Sign out' }} />
          </Pressable>
        </View>
      </View>
    );
  };

  const ContactSpace = () => (
    <View style={{
      marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    }}
    >
      <Pressable onPress={() => Linking.openURL('https://twitter.com/search/?q=%23BerryboxApp')}>
        <Text style={{ color: colors.textColor, textAlign: 'center' }}>Feedback</Text>
      </Pressable>
      <View style={{ height: '70%', width: 1, backgroundColor: '#777777' }} />
      <Pressable onPress={() => Linking.openURL('https://berrybox.tv/privacy')}>
        <Text style={{ color: colors.textColor, textAlign: 'center' }}>Privacy Policy</Text>
      </Pressable>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <UserSpace />
        <View style={styles.sectionSeparator} />
        <ContactSpace />
      </View>
    </>
  );
};

export default CustomMenu;
