import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, Pressable, ToastAndroid, Image, FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthSubject } from '../../models/session.model';
import { useTheme } from '../../shared/theme.context';
import BackIcon from '../../../assets/icons/back-icon.svg';
import { updateUser } from '../../redux/actions';
import Badge from '../../models/badge.model';
import BadgeCard from '../../components/badge-card.component';
import BxLoadingIndicator from '../../components/bx-loading-indicator.component';

const BadgesScreen = (props: {
    navigation, user: AuthSubject, badge: string, updateUser
}) => {
  const {
    navigation, user, badge, updateUser,
  } = props;
  const { colors } = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [badges, setBadges] = useState<Array<Badge>>([]);
  const [userBadges, setUserBadges] = useState([]);
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
      alignItems: 'center',
    },
    settingTitle: {
      color: colors.textColor,
      marginLeft: 30,
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 18,
    },
  });

  const getBadges = async () => {
    setLoading(true);
    const badges = await (await axios.get(`${Config.API_URL}/badges`)).data;
    setBadges(badges);

    const userBadges = await (await axios.get(`${Config.API_URL}/users/badges`)).data;
    setUserBadges(userBadges);
    setLoading(false);
  };

  useEffect(() => {
    getBadges();
  }, []);

  const updateSettings = async (settings: Partial<AuthSubject['settings']>) => {
    try {
      user.settings = Object.assign(user.settings, settings);
      await axios.patch(`${Config.API_URL}/user/settings`, user.settings);
      await AsyncStorage.setItem('BBOX-user', JSON.stringify(user));
      updateUser({ user });
      ToastAndroid.show('Settings updated', 3000);
    } catch (error) {
      ToastAndroid.show('There was an error. Please try again', 4000);
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.headerStyle}>
          <Pressable
            onPress={() => navigation.navigate('Home')}
          >
            <BackIcon width={20} height={20} fill={colors.textColor} />
          </Pressable>
          <Text style={styles.settingTitle}>My Badges</Text>
        </View>
      </View>
      { user && badges ? (
        <View style={{ padding: 10 }}>
          <Text style={{
            color: colors.textSystemColor, fontSize: 11, textAlign: 'center', marginBottom: 10,
          }}
          >
            Tap a badge you have unlocked to have it display in chat!
          </Text>
          <FlatList
            data={badges}
            renderItem={({ item }) => <BadgeCard badge={item} unlocked={false} onChoose={() => { console.log('CHOSEN'); }} />}
            keyExtractor={(item) => item._id}
          />
        </View>
      )
        : <BxLoadingIndicator />}
    </>
  );
};

const mapStateToProps = (state) => {
  const { user } = state.user;
  return {
    user, badge: user?.settings?.badge,
  };
};

export default connect(mapStateToProps, { updateUser })(BadgesScreen);
