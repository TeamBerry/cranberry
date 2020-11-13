import React from 'react';
import {
  Text, View, Image, StyleSheet, Pressable,
} from 'react-native';
import { QueueItem } from '@teamberry/muscadine';
import Box from '../models/box.model';
import ProfilePicture from './profile-picture.component';
import BxChipComponent from './bx-chip.component';
import UsersIcon from '../../assets/icons/users-icon.svg';

const styles = StyleSheet.create({
  card: {
    height: 270,
    width: 240,
    paddingHorizontal: 5,
  },
  boxContents: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#3f3f3f',
    borderBottomColor: '#EB8400',
    borderBottomWidth: 5,
  },
  boxMainInfo: {
    height: 130,
    paddingHorizontal: 5,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  boxInfo: {
    width: 200,
  },
  boxTitle: {
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
  boxCurrent: {
    color: '#e6e6e6',
    fontFamily: 'Montserrat-Regular',
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

const FeaturedBoxCard = (props: { box: Box, onPress: () => void }) => {
  const { box, onPress } = props;
  const currentVideo = displayCurrentvideo(box);

  return (
    <View style={styles.card}>
      <Pressable style={styles.boxContents} android_ripple={{ color: '#4d4d4d' }} onPress={onPress}>
        <View style={{ paddingBottom: 5 }}>
          {currentVideo ? (
            <Image
              style={{ width: 230, height: 129.375 }}
              source={{ uri: `https://i.ytimg.com/vi/${currentVideo.video.link}/0.jpg` }}
            />
          ) : (
            <Image
              style={{ width: 230, height: 129.375 }}
              source={{ uri: 'https://berrybox-user-pictures.s3-eu-west-1.amazonaws.com/profile-pictures/default-picture' }}
            />
          )}
          <View style={styles.boxUserDisplay}>
            <UsersIcon width={16} height={16} fill="white" />
            <Text style={{ color: 'white' }}>{box.users || 0}</Text>
          </View>
        </View>
        <View style={styles.boxMainInfo}>
          <View style={{ flexDirection: 'row' }}>
            <ProfilePicture userId={box.creator._id} size={45} />
            <View>
              <Text style={styles.boxTitle} numberOfLines={2}>{box.name}</Text>
              <Text style={{ color: '#BBBBBB', fontSize: 12 }}>{box.creator.name}</Text>
            </View>
          </View>
          <Text style={styles.boxCurrent} numberOfLines={2}>{currentVideo ? currentVideo.video.name : '--'}</Text>
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
                <BxChipComponent options={{ type: 'duration-limit', chipText: `${box.options.videoMaxDurationLimit} mins` }} display="full" />
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default FeaturedBoxCard;
