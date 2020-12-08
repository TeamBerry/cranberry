import React from 'react';
import {
  View, Text, Pressable, StyleSheet, ToastAndroid,
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
      fontWeight: '700',
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
          <Text style={styles.settingTitle}>Remove your profile picture</Text>
        </View>
      </View>
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
