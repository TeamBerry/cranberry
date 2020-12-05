import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View, Text, Pressable, StyleSheet, ToastAndroid,
} from 'react-native';
import { ColorPicker } from 'react-native-color-picker';
import Config from 'react-native-config';
import axios from 'axios';
import { AuthSubject } from '../../models/session.model';
import { useTheme } from '../../shared/theme.context';
import BackIcon from '../../../assets/icons/back-icon.svg';
import BxActionComponent from '../../components/bx-action.component';

const ColorSelectScreen = ({ navigation }) => {
  const [user, setUser] = useState<AuthSubject>(null);
  const [userColor, setUserColor] = useState<string>(null);
  const { colors } = useTheme();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const authSubject: AuthSubject = JSON.parse(await AsyncStorage.getItem('BBOX-user'));
        setUser(authSubject);
        setUserColor(authSubject.settings.color);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Session could not be obtained', e);
      }
    };

    bootstrap();
  }, []);

  const saveUserColor = async () => {
    try {
      // Patch in database
      await axios.patch(`${Config.API_URL}/user/settings`, { color: userColor });

      // Update storage & states
      user.settings = Object.assign(user.settings, { color: userColor });
      await AsyncStorage.setItem('BBOX-user', JSON.stringify(user));
      ToastAndroid.show('Color updated', 2000);
    } catch (error) {
      ToastAndroid.show('There was an error. Please try again.', 5000);
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
    form: {
      flex: 1,
      width: 320,
      paddingBottom: 20,
    },
    image: {
      height: 100,
      width: 100,
    },
    previewContainer: {
      marginHorizontal: 20,
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
      { user ? (
        <>
          <View style={{ height: 300 }}>
            <ColorPicker
              defaultColor={userColor}
              oldColor={userColor}
              hideSliders
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
          <Pressable onPress={() => saveUserColor()} style={{ padding: 20 }}>
            <BxActionComponent options={{ text: 'Save color' }} />
          </Pressable>
        </>
      ) : null}
    </>
  );
};

export default ColorSelectScreen;
