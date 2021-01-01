import React from 'react';
import {
  Text, View, Image, StyleSheet, Pressable,
} from 'react-native';
import Box from '../models/box.model';
import ProfilePicture from './profile-picture.component';
import BxChipComponent from './bx-chip.component';
import UsersIcon from '../../assets/icons/users-icon.svg';
import { useTheme } from '../shared/theme.context';

const styles = StyleSheet.create({
  card: {
    height: 270,
    width: 240,
    paddingHorizontal: 5,
  },
  boxContents: {
    display: 'flex',
    flexDirection: 'column',
    borderBottomColor: '#EB8400',
    borderBottomWidth: 5,
  },
  boxMainInfo: {
    height: 130,
    width: 240,
    paddingHorizontal: 5,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  boxInfo: {
    width: 200,
  },
  boxTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
  boxCurrent: {
    fontFamily: 'Montserrat-Regular',
    paddingHorizontal: 5,
  },
  boxUserDisplay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 5,
    position: 'absolute',
    top: 5,
    left: 5,
    padding: 3,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const FeaturedBoxCard = (props: { box: Box, onPress: () => void }) => {
  const { box, onPress } = props;
  const currentVideo = box.currentVideo ?? null;
  const { colors } = useTheme();

  return (
    <View style={styles.card}>
      <Pressable
        style={[styles.boxContents, { backgroundColor: colors.backgroundSecondaryColor }]}
        android_ripple={{ color: '#4d4d4d' }}
        onPress={onPress}
      >
        <View style={{ paddingBottom: 5 }}>
          {currentVideo ? (
            <Image
              style={{ width: 230, height: 129.375 }}
              source={{ uri: `https://i.ytimg.com/vi/${currentVideo.video.link}/0.jpg` }}
            />
          ) : (
            <Image
              style={{ width: 230, height: 129.375 }}
              source={require('../../assets/berrybox-logo-master.png')}
            />
          )}
          <View style={styles.boxUserDisplay}>
            <UsersIcon width={16} height={16} fill="white" />
            <Text style={{ color: 'white' }}>{box.users || 0}</Text>
          </View>
        </View>
        <View style={styles.boxMainInfo}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{ paddingRight: 5 }}>
              <ProfilePicture fileName={box.creator.settings.picture} size={35} />
            </View>
            <View style={{ width: 185 }}>
              <Text style={[styles.boxTitle, { color: colors.textColor }]} numberOfLines={2}>{box.name}</Text>
              <Text style={{ color: colors.textSystemColor, fontSize: 12 }} numberOfLines={1}>{box.creator.name}</Text>
            </View>
          </View>
          <Text
            style={[styles.boxCurrent, { color: colors.textSecondaryColor }]}
            numberOfLines={2}
          >
            {currentVideo ? currentVideo.video.name : '--'}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            {box.options.random ? (
              <View style={{ paddingHorizontal: 2 }}>
                <BxChipComponent options={{ type: 'random', chipText: 'Random' }} display="icon" />
              </View>
            ) : null}
            {box.options.loop ? (
              <View style={{ paddingHorizontal: 2 }}>
                <BxChipComponent options={{ type: 'loop', chipText: 'Loop' }} display="icon" />
              </View>
            ) : null}
            {box.options.berries ? (
              <View style={{ paddingHorizontal: 2 }}>
                <BxChipComponent options={{ type: 'coin-enabled', chipText: 'Berries' }} display="icon" />
              </View>
            ) : null}
            {box.options.videoMaxDurationLimit !== 0 ? (
              <View style={{ paddingHorizontal: 2 }}>
                <BxChipComponent
                  options={{ type: 'duration-limit', chipText: `${box.options.videoMaxDurationLimit} mins` }}
                  display="full"
                />
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default FeaturedBoxCard;
