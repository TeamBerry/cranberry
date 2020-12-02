import React from 'react';
import {
  Text, View, Image, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { QueueItem } from '@teamberry/muscadine';
import Box from '../models/box.model';
import ProfilePicture from './profile-picture.component';

import UsersIcon from '../../assets/icons/users-icon.svg';
import UnlockIcon from '../../assets/icons/unlock-icon.svg';
import BxChipComponent from './bx-chip.component';
import { useTheme } from '../shared/theme.context';

const styles = StyleSheet.create({
  card: {
    height: 130,
    flex: 1,
    flexDirection: 'column',
  },
  boxMainInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  boxFeatures: {
    height: 30,
    flex: 1,
  },
  boxInfo: {
    width: 200,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  boxTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
  boxCreator: {
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  boxCurrent: {
    color: '#e6e6e6',
    fontFamily: 'Montserrat-Regular',
  },
  boxModes: {
    flex: 1,
    flexDirection: 'row',
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

const displayCurrentvideo = (box: Box): QueueItem => box.playlist.find((video) => video.startTime !== null && video.endTime === null);

const BoxCard = (props: { box: Box, onPress: () => void, isUnlocked: boolean }) => {
  const { box, onPress, isUnlocked } = props;
  const currentVideo = displayCurrentvideo(box);
  const { colors } = useTheme();

  return (
    <View style={styles.card}>
      <Pressable style={styles.boxMainInfo} android_ripple={{ color: '#4d4d4d' }} onPress={onPress}>
        <View>
          {currentVideo ? (
            <Image
              style={{ width: 140, height: 78.75 }}
              source={{ uri: `https://i.ytimg.com/vi/${currentVideo.video.link}/default.jpg` }}
            />
          ) : (
            <Image
              style={{ width: 140, height: 78.75 }}
              source={require('../../assets/berrybox-logo-master.png')}
            />
          )}
          <View style={styles.boxUserDisplay}>
            <UsersIcon width={16} height={16} fill="white" />
            <Text style={{ color: 'white' }}>{box.users || 0}</Text>
          </View>
        </View>
        <View style={styles.boxInfo}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {isUnlocked ? (
              <UnlockIcon width={20} height={20} fill={colors.successColor} />
            ) : null}
            <Text style={[styles.boxTitle, { color: colors.textColor }]} numberOfLines={1}>{box.name}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <ProfilePicture userId={box.creator._id} size={15} />
            <Text style={{ color: colors.textSystemColor, paddingLeft: 4 }}>{box.creator.name}</Text>
          </View>
          <Text
            style={[styles.boxCurrent, { color: colors.textSecondaryColor }]}
            numberOfLines={2}
          >
            {currentVideo ? currentVideo.video.name : '--'}
          </Text>
        </View>
      </Pressable>
      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {box.options.random ? (
          <View style={{ paddingHorizontal: 2 }}>
            <BxChipComponent options={{ type: 'random', chipText: 'Random' }} display="full" />
          </View>
        ) : null}
        {box.options.loop ? (
          <View style={{ paddingHorizontal: 2 }}>
            <BxChipComponent options={{ type: 'loop', chipText: 'Loop' }} display="full" />
          </View>
        ) : null}
        {box.options.berries ? (
          <View style={{ paddingHorizontal: 2 }}>
            <BxChipComponent options={{ type: 'coin-enabled', chipText: 'Berries' }} display="full" />
          </View>
        ) : null}
        {box.private ? (
          <View style={{ paddingHorizontal: 2 }}>
            <BxChipComponent options={{ type: 'lock', chipText: 'Private' }} display="full" />
          </View>
        ) : null}
        {box.options.videoMaxDurationLimit !== 0 ? (
          <View style={{ paddingHorizontal: 2 }}>
            <BxChipComponent options={{ type: 'duration-limit', chipText: `${box.options.videoMaxDurationLimit} mins` }} display="full" />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default BoxCard;
