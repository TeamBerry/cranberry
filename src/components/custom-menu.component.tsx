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

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
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
});

const CustomMenu = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<AuthSubject>(null);

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

  const { signOut } = useContext(AuthContext);
  const { colors } = useTheme();

  const UserSpace = () => {
    if (!user?.mail) {
      return (
        <View>
          <View style={{
            flex: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 20,
          }}
          >
            <UserIcon width={40} height={40} fill={colors.textColor} />
            <Text style={{ textAlign: 'center', color: colors.textColor }}>
              Sign up or login to create your own boxes,
              chat with users and more!
            </Text>
          </View>
          <Pressable onPress={() => navigation.navigate('SignIn')}>
            <BxActionComponent options={{ text: 'Log in' }} />
          </Pressable>
        </View>
      );
    }

    return (
      <View>
        <View style={{
          flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20,
        }}
        >
          <View style={{ marginRight: 10 }}>
            <ProfilePicture userId={user._id} size={50} />
          </View>
          <Text style={[styles.userName, { color: colors.textColor }]}>{user.name}</Text>
        </View>
        <Pressable onPress={() => signOut()}>
          <BxActionComponent options={{ text: 'Sign out' }} />
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.backgroundSecondaryColor }]}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
          <View>
            <UserSpace />
          </View>
          <View style={{
            paddingVertical: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
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
        </View>
      </View>
    </>
  );
};

export default CustomMenu;
