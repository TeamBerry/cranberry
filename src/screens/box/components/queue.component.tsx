import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, Animated,
} from 'react-native';
import { QueueItem } from '@teamberry/muscadine';
import Collapsible from 'react-native-collapsible';
import { Svg, Polygon } from 'react-native-svg';
import Box from '../../../models/box.model';
import QueueVideo from './queue-video.component';
import ProfilePicture from '../../../components/profile-picture.component';

const styles = StyleSheet.create({
  currentSpaceContainer: {
    height: 50,
    backgroundColor: '#111111',
    color: 'white',
    paddingLeft: 10,
  },
  currentSpace: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

const Queue = ({ box, currentVideo, height }: {
    box: Box,
    currentVideo: QueueItem,
    height: number
}) => {
  const [isCollapsed, setCollapse] = useState(true);

  const BoxName = () => {
    if (!box) {
      return null;
    }
    return (
      <Text style={styles.boxName}>{box.name}</Text>
    );
  };

  const CurrentVideo = () => {
    if (!currentVideo) {
      return null;
    }

    return (
      <Text style={styles.currentVideo} numberOfLines={1}>{currentVideo.video.name}</Text>
    );
  };

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const rotateOpen = () => {
    Animated
      .timing(rotateAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
      .start();
  };

  const rotateClose = () => {
    Animated
      .timing(rotateAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
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
      return null;
    }

    let upcomingVideos = [];

    if (!box.options.loop) {
      upcomingVideos = box.playlist.filter((item) => item.startTime === null);
    } else {
      upcomingVideos = box.playlist;
    }

    if (upcomingVideos.length === 0) {
      return (
        <Text style={{ textAlign: 'center', color: '#BBB', marginHorizontal: 20 }}>The Queue is empty.</Text>
      );
    }

    upcomingVideos.reverse();

    // Put the preslected video first
    const preselectedVideoIndex = upcomingVideos.findIndex((item: QueueItem) => item.isPreselected);
    if (preselectedVideoIndex !== -1) {
      const preselectedVideo = upcomingVideos[preselectedVideoIndex];
      upcomingVideos.splice(preselectedVideoIndex, 1);
      upcomingVideos.unshift(preselectedVideo);
    }

    // Put the current video first
    const playingVideo: QueueItem = box.playlist.find((item: QueueItem) => item.startTime !== null && item.endTime === null);
    if (playingVideo) {
      // If loop, the full queue is displayed, regardless of the state of the videos.
      // So the current video has to be spliced out before being unshifted.
      const playingVideoIndex = upcomingVideos.findIndex((item: QueueItem) => item.video.link === playingVideo.video.link);
      if (playingVideoIndex !== -1) {
        upcomingVideos.splice(playingVideoIndex, 1);
      }
      upcomingVideos.unshift(playingVideo);
    }

    return (
      <FlatList
        data={upcomingVideos}
        ItemSeparatorComponent={() => <View style={{ backgroundColor: '#191919', height: 1 }} />}
        renderItem={({ item }) => (
          <QueueVideo item={item} boxToken={box._id} />
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
            <View style={{ paddingRight: 10 }}>
              <ProfilePicture userId={box.creator._id} size={25} />
            </View>
            <View style={{ flex: 1 }}>
              <BoxName />
              <CurrentVideo />
            </View>
            <View style={{ width: 40 }}>
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
        <Collapsible
          collapsed={isCollapsed}
          style={{ height: height - 50 }}
        >
          <QueueList />
        </Collapsible>
      </View>
    </>
  );
};

export default Queue;
