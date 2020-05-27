import React from 'react';
import {
  Text, View, Image, StyleSheet,
} from 'react-native';
import { QueueItem } from '@teamberry/muscadine';
import Box from '../models/box.model';
import ProfilePicture from './profile-picture.component';

import UsersIcon from '../../assets/icons/users-icon.svg';

const styles = StyleSheet.create({
  card: {
    height: 120,
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
  },
  boxMainInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 90,
    marginBottom: 10,
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
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
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
  boxMode: {
    backgroundColor: '#979797',
    color: 'white',
    borderRadius: 10,
    width: 80,
    height: 18,
    textAlign: 'center',
    marginRight: 3,
    marginLeft: 3,
    fontSize: 12,
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

const BoxCard = (box: Box) => {
  const currentVideo = displayCurrentvideo(box);

  return (
    <View style={styles.card}>
      <View style={styles.boxMainInfo}>
        <View>
          {currentVideo ? (
            <Image
              style={{ width: 140, height: 78.75 }}
              source={{ uri: `https://i.ytimg.com/vi/${currentVideo.video.link}/default.jpg` }}
            />
          ) : (
            <Image
              style={{ width: 140, height: 78.75 }}
              source={{ uri: 'https://berrybox-user-pictures.s3-eu-west-1.amazonaws.com/profile-pictures/default-picture' }}
            />
          )}
          <View style={styles.boxUserDisplay}>
            <UsersIcon width={16} height={16} fill="white" />
            <Text style={{ color: 'white' }}>{box.users || 0}</Text>
          </View>
        </View>
        <View style={styles.boxInfo}>
          <Text style={styles.boxTitle} numberOfLines={1}>{box.name}</Text>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <ProfilePicture userId={box.creator._id} size={15} />
            <Text style={{ color: '#BBBBBB', paddingLeft: 4 }}>{box.creator.name}</Text>
          </View>
          <Text style={styles.boxCurrent} numberOfLines={2}>{currentVideo ? currentVideo.video.name : '--'}</Text>
        </View>
      </View>
      <View style={styles.boxMode}>
        <View style={styles.boxModes}>
          {box.options.random ? (
            <Text style={styles.boxMode}>Random</Text>
          ) : (<></>)}
          {box.options.loop ? (
            <Text style={styles.boxMode}>Loop</Text>
          ) : (<></>)}
          {!box.options.berries ? (
            <Text style={styles.boxMode}>No Berries</Text>
          ) : (<></>)}
          {!box.private ? (
            <Text style={styles.boxMode}>Private</Text>
          ) : (<></>)}
        </View>
      </View>
    </View>
  );
};

export default BoxCard;
