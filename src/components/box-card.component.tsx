import React from 'react';
import {
  Text, View, Image, StyleSheet,
} from 'react-native';
import { QueueItem } from '@teamberry/muscadine';
import Box from 'models/box.model';
import ProfilePicture from './profile-picture.component';

const styles = StyleSheet.create({
  card: {
    height: 80,
    width: 230,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  boxInfo: {
    marginLeft: 10,
    justifyContent: 'space-around',
  },
  boxTitle: {
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
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
    height: 15,
    textAlign: 'center',
    marginRight: 3,
    marginLeft: 3,
    fontSize: 10,
  },
});


const displayCurrentvideo = (box: Box): QueueItem => box.playlist.find((video) => video.startTime !== null && video.endTime === null);

const BoxCard = (box: Box) => {
  const currentVideo = displayCurrentvideo(box);

  return (
    <View style={styles.card}>
      <View>
        {currentVideo ? (
          <Image
            style={{ width: 107, height: 60 }}
            source={{ uri: `https://i.ytimg.com/vi/${currentVideo.video.link}/default.jpg` }}
          />
        ) : (
          <Image
            style={{ width: 107, height: 60 }}
            source={{ uri: 'https://berrybox-user-pictures.s3-eu-west-1.amazonaws.com/profile-pictures/default-picture' }}
          />
        )}
      </View>
      <View style={styles.boxInfo}>
        <Text style={styles.boxTitle} numberOfLines={1}>{box.name}</Text>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <ProfilePicture userId={box.creator._id} size={15} />
          <Text style={{ color: 'white', paddingLeft: 4 }}>{box.creator.name}</Text>
        </View>
        <Text style={styles.boxCurrent} numberOfLines={1}>{currentVideo ? currentVideo.video.name : '--'}</Text>
        <View style={styles.boxModes}>
          {box.options.random ? (
            <Text style={styles.boxMode}>Random</Text>
          ) : (<></>)}
          {box.options.loop ? (
            <Text style={styles.boxMode}>Loop</Text>
          ) : (<></>)}
        </View>
      </View>
    </View>
  );
};

export default BoxCard;
