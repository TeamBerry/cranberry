import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Image, useWindowDimensions, Pressable,
} from 'react-native';
import { QueueItem } from '@teamberry/muscadine';
import Collapsible from 'react-native-collapsible';
import ProfilePicture from '../../../components/profile-picture.component';
import DurationIndicator from '../../../components/duration-indicator.component';
import BxButtonComponent from '../../../components/bx-button.component';

const styles = StyleSheet.create({
  queueVideo: {
    paddingHorizontal: 7,
    paddingVertical: 10,
    flexDirection: 'column',
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

const QueueVideo = ({ item }: { item: QueueItem }) => {
  const window = useWindowDimensions();
  const [areActionsVisible, setActionsVisibility] = useState(false);

  return (
    <Pressable android_ripple={{ color: '#4d4d4d' }} onPress={() => setActionsVisibility(!areActionsVisible)}>
      <View style={styles.queueVideo}>
        <View style={{ flex: 0, flexDirection: 'row' }}>
          <View style={{ paddingRight: 10 }}>
            <Image
              style={[
                item.isPreselected ? styles.preselectedVideo : {},
                (item.startTime !== null && item.endTime === null) ? styles.currentVideo : {},
                { width: 140, height: 78.75 },
              ]}
              source={{ uri: `https://i.ytimg.com/vi/${item.video.link}/hqdefault.jpg` }}
            />
            <DurationIndicator
              duration={item.video.duration}
              withBorder={
                        item.isPreselected || (item.startTime !== null && item.endTime === null)
                    }
            />
          </View>
          <View style={{
            flex: 1,
            justifyContent: 'center',
          }}
          >
            <Text style={styles.queueVideoName} numberOfLines={2}>
              <Text style={styles.nextVideoIndicator}>{item.isPreselected ? 'Next: ' : null}</Text>
              <Text style={styles.currentVideoIndicator}>
                {(item.startTime !== null && item.endTime === null) ? 'Playing: ' : null}
              </Text>
              {item.video.name}
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <ProfilePicture userId={item.submitted_by._id} size={20} />
              <Text style={{ paddingLeft: 5, color: '#BBBBBB' }}>{item.submitted_by.name}</Text>
            </View>
          </View>
        </View>
        <Collapsible
          collapsed={!areActionsVisible}
          style={{
            display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', padding: 10,
          }}
        >
          {(item.startTime !== null && item.endTime === null) ? (
            <Pressable onPress={() => console.log('SKIP')}>
              <BxButtonComponent options={{ type: 'skip', text: 'Skip', textDisplay: 'full' }} />
            </Pressable>
          ) : (
            <>
              <Pressable onPress={() => console.log('PLAY NEXT')}>
                <BxButtonComponent options={{ type: 'forceNext', text: 'Play Next', textDisplay: 'full' }} />
              </Pressable>
              <Pressable onPress={() => console.log('PLAY NOW')}>
                <BxButtonComponent options={{ type: 'forcePlay', text: 'Play Now', textDisplay: 'full' }} />
              </Pressable>
              <Pressable onPress={() => console.log('REMOVE')}>
                <BxButtonComponent options={{
                  type: 'cancel', text: 'Remove', textDisplay: 'full', context: 'danger',
                }}
                />
              </Pressable>
            </>
          )}
        </Collapsible>
      </View>
    </Pressable>
  );
};

export default QueueVideo;
