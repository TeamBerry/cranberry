import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, Animated, Pressable, TextInput,
} from 'react-native';
import { QueueItem, Permission } from '@teamberry/muscadine';
import Collapsible from 'react-native-collapsible';
import { Svg, Polygon } from 'react-native-svg';
import axios from 'axios';
import Config from 'react-native-config';
import { Snackbar } from 'react-native-paper';
import Box from '../../../models/box.model';
import QueueVideo from './queue-video.component';
import ProfilePicture from '../../../components/profile-picture.component';

import RandomIcon from '../../../../assets/icons/random-icon.svg';
import ReplayIcon from '../../../../assets/icons/replay-icon.svg';
import BerriesIcon from '../../../../assets/icons/berry-coin-icon.svg';
import BerriesEnabledIcon from '../../../../assets/icons/coin-enabled-icon.svg';
import DurationRestrictionIcon from '../../../../assets/icons/duration-limit-icon.svg';
import BerryCounter from './berry-counter.component';

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

const Queue = (props: {
    box: Box,
    currentVideo: QueueItem,
    height: number,
    berryCount: number,
    permissions: Array<Permission>
}) => {
  const {
    box, currentVideo, height, berryCount, permissions,
  } = props;

  const _durationInputRef = useRef(null);

  const [isCollapsed, setCollapse] = useState(true);
  const [error, setError] = useState(false);
  const [hasUpdatedSuccessfully, setUpdateState] = useState(false);
  const [isDurationInputVisible, setDurationInputVisibility] = useState(false);
  const [queueVideos, setQueueVideos] = useState([] as Array<QueueItem>);

  useEffect((): void => {
    if (!box) {
      setQueueVideos([]);
    }

    let upcomingVideos = [];

    if (!box.options.loop) {
      upcomingVideos = box.playlist.filter((item) => item.startTime === null);
    } else {
      upcomingVideos = box.playlist;
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

    setQueueVideos(upcomingVideos);
  }, [box.playlist]);

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
      <View style={{ flex: 0, flexDirection: 'row' }}>
        {currentVideo.stateForcedWithBerries ? (
          <View style={{ paddingRight: 5 }}>
            <BerriesIcon width={20} height={20} />
          </View>
        ) : null}
        <Text style={styles.currentVideo} numberOfLines={1}>{currentVideo.video.name}</Text>
      </View>
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

  const patchBox = async (setting) => {
    try {
      await axios.patch(`${Config.API_URL}/boxes/${box._id}`, setting);
      setUpdateState(true);
    } catch (error) {
      setError(true);
    }
  };

  const RandomIndicator = () => {
    if (permissions.includes('editBox')) {
      return (
        <Pressable onPress={() => { patchBox({ random: !box.options.random }); }}>
          <RandomIcon width={20} height={20} fill={box.options.random ? '#009AEB' : '#CCCCCC'} />
        </Pressable>
      );
    }

    if (box.options.random) {
      return <RandomIcon width={20} height={20} fill="#009AEB" />;
    }

    return null;
  };

  const LoopIndicator = () => {
    if (permissions.includes('editBox')) {
      return (
        <Pressable onPress={() => { patchBox({ loop: !box.options.loop }); }}>
          <ReplayIcon width={20} height={20} fill={box.options.loop ? '#009AEB' : '#CCCCCC'} />
        </Pressable>
      );
    }

    if (box.options.loop) {
      return <ReplayIcon width={20} height={20} fill="#009AEB" />;
    }

    return null;
  };

  const BerriesIndicator = () => {
    if (permissions.includes('editBox')) {
      return (
        <Pressable onPress={() => { patchBox({ berries: !box.options.berries }); }}>
          <BerriesEnabledIcon width={20} height={20} fill={box.options.berries ? '#009AEB' : '#CCCCCC'} />
        </Pressable>
      );
    }

    if (box.options.berries) {
      return <BerryCounter count={berryCount} />;
    }

    return null;
  };

  const DurationRestrictionIndicator = () => {
    if (permissions.includes('editBox')) {
      if (box.options.videoMaxDurationLimit !== 0) {
        return (
          <Pressable onPress={() => { patchBox({ videoMaxDurationLimit: 0 }); }}>
            <View style={{ flex: 0, flexDirection: 'row' }}>
              <DurationRestrictionIcon width={20} height={20} fill={box.options.videoMaxDurationLimit !== 0 ? '#009AEB' : '#CCCCCC'} />
              {box.options.videoMaxDurationLimit ? (
                <Text style={{ color: '#009AEB' }}>
                  {box.options.videoMaxDurationLimit}
                  {' '}
                  mins
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      }
      return (
        <Pressable onPress={() => { setDurationInputVisibility(!isDurationInputVisible); }}>
          <View style={{ flex: 0, flexDirection: 'row' }}>
            <DurationRestrictionIcon width={20} height={20} fill="#CCCCCC" />
          </View>
        </Pressable>
      );
    }

    if (box.options.videoMaxDurationLimit) {
      return (
        <View style={{ flex: 0, flexDirection: 'row' }}>
          <DurationRestrictionIcon width={20} height={20} fill={box.options.videoMaxDurationLimit !== 0 ? '#009AEB' : '#CCCCCC'} />
          <Text style={{ color: '#009AEB' }}>
            {box.options.videoMaxDurationLimit}
            {' '}
            mins
          </Text>
        </View>
      );
    }

    return null;
  };

  const QueueList = () => {
    if (!queueVideos || queueVideos.length === 0) {
      return (
        <Text style={{ textAlign: 'center', color: '#BBB', marginHorizontal: 20 }}>The Queue is empty.</Text>
      );
    }

    return (
      <FlatList
        data={queueVideos}
        ItemSeparatorComponent={() => <View style={{ backgroundColor: '#191919', height: 1 }} />}
        renderItem={({ item }) => (
          <QueueVideo item={item} boxToken={box._id} permissions={permissions} berriesEnabled={box.options.berries} />
        )}
        keyExtractor={(item, index) => item._id}
        initialNumToRender={8}
        windowSize={12}
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
          <View style={{ backgroundColor: '#191919', padding: 10 }}>
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
              {/* Display icons in "inactive" status for users who can act on them. Don't display icons for user who cannot. */}
              <View style={{ flex: 0, flexDirection: 'row' }}>
                <View style={{ paddingRight: 20 }}>
                  <RandomIndicator />
                </View>
                <View style={{ paddingRight: 20 }}>
                  <LoopIndicator />
                </View>
                <View style={{ paddingRight: 20 }}>
                  <BerriesIndicator />
                </View>
                <View style={{ paddingRight: 20 }}>
                  <DurationRestrictionIndicator />
                </View>
              </View>
            </View>
            {isDurationInputVisible ? (
              <View style={{ paddingVertical: 5 }}>
                <TextInput
                  ref={_durationInputRef}
                  keyboardType="numeric"
                  onSubmitEditing={({ nativeEvent }) => { patchBox({ videoMaxDurationLimit: nativeEvent.text }); }}
                  onBlur={() => setDurationInputVisibility(false)}
                  placeholder="Set the duration restriction (in minutes)"
                  autoFocus
                  placeholderTextColor="#CCCCCC"
                  style={{
                    height: 40,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: '#009aeb',
                    padding: 10,
                    borderRadius: 5,
                    color: 'white',
                  }}
                />
              </View>
            ) : null}
          </View>
          <QueueList />
        </Collapsible>
      </View>
      <Snackbar
        visible={hasUpdatedSuccessfully}
        duration={1500}
        style={{
          backgroundColor: '#090909',
          borderLeftColor: '#0CEBC0',
          borderLeftWidth: 10,
        }}
        onDismiss={() => setUpdateState(false)}
      >
        Option updated successfully.
      </Snackbar>
      <Snackbar
        visible={error}
        duration={5000}
        style={{
          backgroundColor: '#090909',
          borderLeftColor: '#B30F4F',
          borderLeftWidth: 10,
        }}
        onDismiss={() => setError(false)}
      >
        Something wrong happened. Try again?
      </Snackbar>
    </>
  );
};

export default Queue;
