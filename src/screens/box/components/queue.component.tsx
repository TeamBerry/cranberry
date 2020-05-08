import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, Animated,
} from 'react-native';
import { SyncPacket, QueueItem } from '@teamberry/muscadine';
import Collapsible from 'react-native-collapsible';
import { Svg, Polygon } from 'react-native-svg';
import { Box } from '../../../models/box.model';
import QueueVideo from './queue-video.component';

export type Props = {
    box: Box,
    currentVideo: SyncPacket['item']
}

const Queue = ({ box, currentVideo }: Props) => {
  const [isCollapsed, setCollapse] = useState(true);

  const BoxName = () => {
    if (box) {
      return (
        <Text style={styles.boxName}>{box.name}</Text>
      );
    }
    return (<></>);
  };

  const CurrentVideo = () => {
    if (currentVideo) {
      return (
        <Text style={styles.currentVideo} numberOfLines={1}>{currentVideo.video.name}</Text>
      );
    }

    return (<></>);
  };

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const rotateOpen = () => {
    Animated
      .timing(rotateAnim, {
        toValue: 1,
        duration: 500,
      })
      .start();
  };

  const rotateClose = () => {
    Animated
      .timing(rotateAnim, {
        toValue: 0,
        duration: 500,
      })
      .start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const toggleCollapsible = () => {
    if (!isCollapsed) {
      rotateClose();
    } else {
      rotateOpen();
    }
    setCollapse(!isCollapsed);
  };

  const QueueList = () => {
    if (!box) {
      return (<></>);
    }

    const upcomingVideos = box.playlist.filter((item) => item.startTime === null).reverse();

    if (upcomingVideos.length === 0) {
      return (
        <Text style={{ textAlign: 'center', color: '#BBB', marginHorizontal: 20 }}>The Queue is empty.</Text>
      );
    }

    // Put the preslected video first
    const preselectedVideoIndex = upcomingVideos.findIndex((item: QueueItem) => item.isPreselected);
    if (preselectedVideoIndex !== -1) {
      const preselectedVideo = upcomingVideos[preselectedVideoIndex];
      upcomingVideos.splice(preselectedVideoIndex, 1);
      upcomingVideos.unshift(preselectedVideo);
    }

    // Put the current video first
    const playingVideo = box.playlist.find((item: QueueItem) => item.startTime !== null && item.endTime === null);
    if (playingVideo) {
      upcomingVideos.unshift(playingVideo);
    }

    return (
      <FlatList
        data={upcomingVideos}
        renderItem={({ item }) => (
          <QueueVideo item={item} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => toggleCollapsible()}
        activeOpacity={1}
      >
        <View style={styles.currentSpaceContainer}>
          <View style={styles.currentSpace}>
            <View style={styles.currentSpaceTexts}>
              <BoxName />
              <CurrentVideo />
            </View>
            <View style={styles.currentSpaceActions}>
              <Animated.View
                style={{ transform: [{ rotate: spin }] }}
              >
                <Svg height="50" width="40">
                  <Polygon
                    points="30,22 10,22 20,32"
                    fill="white"
                  />
                </Svg>
              </Animated.View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.upcomingSpaceContainer}>
        <Collapsible collapsed={isCollapsed} style={{ height: 445 }}>
          <QueueList />
        </Collapsible>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  currentSpaceContainer: {
    height: 50,
    backgroundColor: '#262626',
    color: 'white',
    paddingLeft: 10,
  },
  currentSpace: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentSpaceTexts: {
    width: 310,
  },
  currentSpaceActions: {
    width: 40,
  },
  boxName: {
    color: '#BBBBBB',
    fontFamily: 'Montserrat-Regular',
  },
  currentVideo: {
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
  },
  upcomingSpaceContainer: {
    backgroundColor: '#262626',
  },
});

export default Queue;
