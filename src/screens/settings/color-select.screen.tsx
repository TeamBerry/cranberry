import React, { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, ToastAndroid,
} from 'react-native';
import { TriangleColorPicker } from 'react-native-color-picker';
import { connect } from 'react-redux';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '../../shared/theme.context';
import BackIcon from '../../../assets/icons/back-icon.svg';
import BxActionComponent from '../../components/bx-action.component';
import { updateUser } from '../../redux/actions';
import { AuthSubject } from '../../models/session.model';

const ColorSelectScreen = (props: { navigation, user: AuthSubject, color: string, updateUser }) => {
  const {
    navigation, user, color, updateUser,
  } = props;
  const [userColor, setUserColor] = useState<string>(color);
  const { colors } = useTheme();

  const updateSettings = async (settings: Partial<AuthSubject['settings']>) => {
    try {
      user.settings = Object.assign(user.settings, settings);
      await axios.patch(`${Config.API_URL}/user/settings`, user.settings);
      await AsyncStorage.setItem('BBOX-user', JSON.stringify(user));
      ToastAndroid.show('Settings updated', 3000);
      updateUser(user);
    } catch (error) {
      ToastAndroid.show('There was an error. Please try again', 4000);
    }
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
          <Text style={styles.settingTitle}>Change your user color</Text>
        </View>
      </View>
      { color ? (
        <View style={{ marginHorizontal: 20 }}>
          <View style={{ height: 300 }}>
            <TriangleColorPicker
              defaultColor={userColor}
              oldColor={userColor}
              onColorSelected={(color) => setUserColor(color)}
              style={{ flex: 1, height: 100 }}
            />
          </View>
          <View style={styles.previewContainer}>
            <Text style={{ color: colors.textSystemColor }}>Previews:</Text>
            <View style={styles.preview}>
              <View style={[styles.colorPreview, { backgroundColor: '#E9E9E9' }]}>
                <Text style={{ textAlign: 'center', color: userColor }}>{user.name}</Text>
              </View>
              <View style={[styles.colorPreview, { backgroundColor: '#191919' }]}>
                <Text style={{ textAlign: 'center', color: userColor }}>{user.name}</Text>
              </View>
            </View>
            <Text style={{ color: colors.textSystemColor, fontSize: 11 }}>
              Be careful, some colors might be difficult to
              read in light or dark themes and for users with color blindness.
            </Text>
          </View>
          <Pressable onPress={() => updateSettings({ color: userColor })} style={{ marginTop: 20 }}>
            <BxActionComponent options={{ text: 'Save color' }} />
          </Pressable>
        </View>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => {
  const user = state.userReducer;
  return { user, color: user?.settings?.color ?? '#D13E9C' };
};

export default connect(mapStateToProps, { updateUser })(ColorSelectScreen);
