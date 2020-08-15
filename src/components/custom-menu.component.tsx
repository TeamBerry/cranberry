import React, { useState, useEffect, useContext } from 'react';
import {
  Text, View, StyleSheet, Button,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AuthContext from '../shared/auth.context';
import ProfilePicture from './profile-picture.component';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#404040',
    height: '100%',
    padding: 20,
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
      return null;
    }

    return (
      <View>
        <View style={{ alignSelf: 'center' }}>
          <ProfilePicture userId={user._id} size={50} />
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Button
          title="Sign out"
          onPress={() => signOut()}
        />
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <UserSpace />
      </View>
    </>
  );
};

export default CustomMenu;
