import React from 'react';
import { connect } from 'react-redux';
import {
  View, Text, Pressable, StyleSheet, ToastAndroid, Image,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';
import { updateUser } from '../../redux/actions';
import { getUser } from '../../redux/selectors';
import { useTheme } from '../../shared/theme.context';
import { AuthSubject } from '../../models/session.model';
import BackIcon from '../../../assets/icons/back-icon.svg';
import BxActionComponent from '../../components/bx-action.component';

const PicturePreviewScreen = (props: { route, navigation, user: AuthSubject, updateUser }) => {
  const {
    route, navigation, user, updateUser,
  } = props;
  const { picture } = route.params;
  const { colors } = useTheme();

  const uploadPicture = async () => {
    // Upload picture
    const formData = new FormData();
    formData.append('picture', picture, picture.name);
    const uploadedPicturePath: { file: string } = await axios.post(`${Config.API_URL}/users/${user._id}/picture`, formData);

    // Update user settings
    user.settings.picture = uploadedPicturePath.file;
    await AsyncStorage.setItem('BBOX-user', JSON.stringify(user));
    updateUser({ user });
    ToastAndroid.show('Settings updated', 3000);

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
          <Text style={styles.settingTitle}>Change your profile picture</Text>
        </View>
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: 40 }}>
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Image
              source={{ uri: picture.uri }}
              style={{
                width: 300, height: 300, alignItems: 'center', justifyContent: 'center', borderRadius: 150,
              }}
            />
          </View>
          <Pressable
            onPress={() => uploadPicture()}
          >
            <BxActionComponent options={{ text: 'Save picture' }} />
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default connect((state) => getUser(state), { updateUser })(PicturePreviewScreen);
