import { connect } from 'react-redux';
import React from 'react';
import {
  View, Text, Pressable, StyleSheet, ToastAndroid, Image,
} from 'react-native';
import { getUser } from '../../redux/selectors';
import { useTheme } from '../../shared/theme.context';
import { AuthSubject } from '../../models/session.model';
import BackIcon from '../../../assets/icons/back-icon.svg';
import BxActionComponent from '../../components/bx-action.component';

const PicturePreviewScreen = (props: { route, navigation, user: AuthSubject }) => {
  const { route, navigation, user } = props;
  const { picture } = route.params;
  const { colors } = useTheme();

  const uploadPicture = () => {
    const formData: FormData = new FormData();
    formData.append('picture', picture, picture.fileName);
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
              source={{ uri: `data:${picture.type};base64,${picture.data}` }}
              style={{
                width: 300, height: 300, alignItems: 'center', justifyContent: 'center',
              }}
            />
          </View>
          <Pressable>
            <BxActionComponent options={{ text: 'Save picture' }} />
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default connect((state) => getUser(state))(PicturePreviewScreen);
