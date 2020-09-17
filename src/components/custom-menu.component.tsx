import React, { useState, useEffect, useContext } from 'react';
import {
  Text, View, StyleSheet, Pressable, Linking,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../shared/auth.context';
import ProfilePicture from './profile-picture.component';
import BxActionComponent from './bx-action.component';

import UsersIcon from '../../assets/icons/users-icon.svg';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#404040',
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
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
  },
});

const CustomMenu = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

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

  const UserSpace = () => {
    if (!user) {
      return (
        <View>
          <View style={{
            flex: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 20,
          }}
          >
            <UsersIcon width={40} height={40} fill="white" />
            <Text style={{ textAlign: 'center', color: 'white' }}>
              Sign up or login to create your own boxes,
              chat with users and more!
            </Text>
          </View>
          <Pressable onPress={() => navigation.push('SignIn')}>
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
          <Text style={styles.userName}>{user.name}</Text>
        </View>
        <Pressable onPress={() => signOut()}>
          <BxActionComponent options={{ text: 'Sign out' }} />
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
          <View>
            <UserSpace />
          </View>
          <View style={{ paddingVertical: 20 }}>
            <Pressable onPress={() => Linking.openURL('https://berrybox.tv/privacy')}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Privacy Policy</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
};

export default CustomMenu;
