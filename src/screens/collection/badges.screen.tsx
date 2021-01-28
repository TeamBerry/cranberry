import React, { useEffect, useState } from 'react';
import {
  Text, ToastAndroid, FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthSubject } from '../../models/session.model';
import { useTheme } from '../../shared/theme.context';
import { updateUser } from '../../redux/actions';
import Badge from '../../models/badge.model';
import BadgeCard from '../../components/badge-card.component';
import BxLoadingIndicator from '../../components/bx-loading-indicator.component';
import User from '../../models/user.model';
import BxHeader from '../../components/bx-header.component';

const BadgesScreen = (props: {
    navigation, user: AuthSubject, displayedBadge: string, updateUser
}) => {
  const {
    navigation, user, displayedBadge, updateUser,
  } = props;
  const { colors } = useTheme();
  const [badges, setBadges] = useState<Array<Badge>>([]);
  const [userBadges, setUserBadges] = useState<User['badges']>([]);
  const [userBadgeIds, setUserBadgeIds] = useState<Array<string>>([]);

  const getBadges = async () => {
    const badges = await (await axios.get(`${Config.API_URL}/badges`)).data;
    setBadges(badges);

    const userBadges: User['badges'] = (await (await axios.get(`${Config.API_URL}/users/me`)).data).badges;
    const userBadgeIds = userBadges.map((ub) => ub.badge);
    setUserBadges(userBadges);
    setUserBadgeIds(userBadgeIds);
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

  const matchingBadge = (badge: string): User['badges'][0] => userBadges.find((ub) => ub.badge === badge);

  return (
    <>
      <BxHeader text="Badges" onPress={() => navigation.navigate('Home')} />
      { user && badges && userBadges && userBadgeIds ? (
        <>
          <Text style={{
            color: colors.textSystemColor, fontSize: 11, textAlign: 'center', marginVertical: 10,
          }}
          >
            Tap a badge you have unlocked to have it display in chat!
          </Text>
          <FlatList
            data={badges}
            renderItem={({ item }) => (
              <BadgeCard
                badge={item}
                unlockedAt={matchingBadge(item._id)?.unlockedAt ?? null}
                isDisplayed={displayedBadge === item._id}
                onChoose={() => { updateSettings({ badge: item._id }); }}
              />
            )}
            keyExtractor={(item) => item._id}
          />
        </>
      )
        : <BxLoadingIndicator />}
    </>
  );
};

const mapStateToProps = (state) => {
  const { user } = state.user;
  return {
    user, displayedBadge: user?.settings?.badge,
  };
};

export default connect(mapStateToProps, { updateUser })(BadgesScreen);
