import React from 'react';
import { connect } from 'react-redux';
import {
  View, Pressable, ToastAndroid, Image,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';
import { updateUser } from '../../redux/actions';
import { getUser } from '../../redux/selectors';
import { AuthSubject } from '../../models/session.model';
import BxActionComponent from '../../components/bx-action.component';
import BxHeader from '../../components/bx-header.component';

const PicturePreviewScreen = (props: { route, navigation, user: AuthSubject, updateUser }) => {
  const {
    route, navigation, user, updateUser,
  } = props;
  const { picture } = route.params;

  const uploadPicture = async () => {
    // Upload picture
    const formData = new FormData();
    formData.append('picture', picture, picture.name);
    const uploadedPicturePath: { file: string } = await (await axios.post(`${Config.API_URL}/user/picture`, formData)).data;

    // Update user settings
    user.settings.picture = uploadedPicturePath.file;
    await AsyncStorage.setItem('BBOX-user', JSON.stringify(user));
    updateUser({ user });
    ToastAndroid.show('Settings updated', 3000);

    // Navigate back
    navigation.goBack();
  };

  return (
    <>
      <BxHeader text="Change your profile picture" onPress={() => navigation.pop()} />
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
