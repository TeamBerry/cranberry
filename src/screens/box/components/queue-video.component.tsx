import React, { } from 'react';
import {
  StyleSheet, Text, View, Image,
} from 'react-native';
import { QueueItem } from '@teamberry/muscadine';
import ProfilePicture from '../../../components/profile-picture.component';
import DurationIndicator from '../../../components/duration-indicator.component';

const styles = StyleSheet.create({
  queueVideo: {
    paddingHorizontal: 7,
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
  },
  queueVideoName: {
    fontFamily: 'Montserrat-Regular',
    color: 'white',
  },
  currentVideo: {
    borderColor: '#009AEB',
    borderWidth: 2,
  },
  currentVideoIndicator: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#009AEB',
  },
  preselectedVideo: {
    borderColor: '#EBBA17',
    borderWidth: 2,
  },
  nextVideoIndicator: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#EBBA17',
  },
});

const QueueVideo = ({ item }: { item: QueueItem }) => (
  <View style={styles.queueVideo}>
    <View>
      <Image
        style={[
          item.isPreselected ? styles.preselectedVideo : {},
          (item.startTime !== null && item.endTime === null) ? styles.currentVideo : {},
          { width: 140, height: 78.75 },
        ]}
        source={{ uri: `https://i.ytimg.com/vi/${item.video.link}/hqdefault.jpg` }}
      />
      <DurationIndicator duration={item.video.duration} withBorder={item.isPreselected || (item.startTime !== null && item.endTime === null)} />
    </View>
    <View style={{
      paddingLeft: 10,
      width: 230,
      display: 'flex',
      justifyContent: 'center',
    }}
    >
      <Text style={styles.queueVideoName} numberOfLines={2}>
        <Text style={styles.nextVideoIndicator}>{item.isPreselected ? 'Next: ' : null}</Text>
        <Text style={styles.currentVideoIndicator}>{item.startTime !== null ? 'Playing: ' : null}</Text>
        {item.video.name}
      </Text>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <ProfilePicture userId={item.submitted_by._id} size={20} />
        <Text style={{ paddingLeft: 5, color: '#BBBBBB' }}>{item.submitted_by.name}</Text>
      </View>
    </View>
  </View>
);

export default QueueVideo;
