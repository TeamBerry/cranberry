import React from 'react';
import {
  View, Text, Pressable, ToastAndroid,
} from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthSubject } from '../../models/session.model';
import { useTheme } from '../../shared/theme.context';
import BackIcon from '../../../assets/icons/back-icon.svg';
import BxActionComponent from '../../components/bx-action.component';
import { getUser } from '../../redux/selectors';
import { updateUser } from '../../redux/actions';
import ProfilePicture from '../../components/profile-picture.component';
import BxHeader from '../../components/bx-header.component';

const PictureDeleteScreen = (props: { navigation, user: AuthSubject, updateUser }) => {
  const { navigation, user, updateUser } = props;
  const { colors } = useTheme();

  const removePicture = async () => {
    // Remove picture
    await axios.delete(`${Config.API_URL}/user/picture`);

    // Update user settings
    user.settings.picture = 'default-picture';
    await AsyncStorage.setItem('BBOX-user', JSON.stringify(user));
    updateUser({ user });
    ToastAndroid.show('Picture removed', 3000);

    // Navigate back
    navigation.goBack();
  };

  return (
    <>
      <BxHeader text="Remove your profile picture" onPress={() => navigation.pop()} />
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <Text style={{ color: colors.textSystemColor, fontSize: 11, textAlign: 'center' }}>
          Your profile picture will be reset to the default picture. This operation cannot be undone, although you may change
          your profile picture when you want.
        </Text>
        <View style={{
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingVertical: 50,
        }}
        >
          <ProfilePicture
            fileName={user.settings.picture}
            size={80}
            style={{ borderWidth: 1, borderColor: colors.inactiveColor }}
          />
          <BackIcon width={60} height={60} fill={colors.textColor} rotation={180} />
          <ProfilePicture
            fileName="default-picture"
            size={100}
            style={{ borderWidth: 1, borderColor: '#0C9AEB' }}
          />
        </View>
        <Pressable onPress={removePicture}>
          <BxActionComponent options={{ text: 'Remove profile picture' }} />
        </Pressable>
      </View>
    </>
  );
};

export default connect((state) => getUser(state), { updateUser })(PictureDeleteScreen);
