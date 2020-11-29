import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, Animated, Pressable, Share, BackHandler,
} from 'react-native';
import { QueueItem, Permission } from '@teamberry/muscadine';
import Collapsible from 'react-native-collapsible';
import { Svg, Polygon } from 'react-native-svg';
import axios from 'axios';
import Config from 'react-native-config';
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

import Box from '../../../models/box.model';
import QueueVideo from './queue-video.component';
import ProfilePicture from '../../../components/profile-picture.component';

import BerriesIcon from '../../../../assets/icons/berry-coin-icon.svg';
import InviteIcon from '../../../../assets/icons/invite-icon.svg';
import EditIcon from '../../../../assets/icons/edit-icon.svg';
import BerryCounter from './berry-counter.component';
import BerryHelper from './berry-helper.component';
import { useTheme } from '../../../shared/theme.context';
import BxChipComponent from '../../../components/bx-chip.component';

const styles = StyleSheet.create({
  currentSpaceContainer: {
    height: 50,
    flexDirection: 'row',
    flex: 0,
    alignItems: 'center',
  },
  currentSpace: {
    paddingLeft: 5,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 1,
  },
  shareSpace: {
    flex: 0,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  boxName: {
    fontFamily: 'Montserrat-Regular',
  },
  currentVideo: {
    fontFamily: 'Montserrat-SemiBold',
  },
});

const Queue = (props: {
    box: Box,
    currentVideo: QueueItem,
    height: number,
    berryCount: number,
    permissions: Array<Permission>,
    onEdit: () => void
}) => {
  const {
    box, currentVideo, height, berryCount, permissions, onEdit,
  } = props;
  const { colors } = useTheme();

  const [isCollapsed, setCollapse] = useState(true);
  const [error, setError] = useState(false);
  const [hasUpdatedSuccessfully, setUpdateState] = useState(false);
  const [queueVideos, setQueueVideos] = useState<Array<QueueItem>>([]);
  const [user, setUser] = useState(null);
  const [isBerriesHelperShown, showBerriesHelper] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));
      setUser(user);
    };

    bootstrap();
  }, []);

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
        <Text style={[styles.currentVideo, { color: colors.textColor }]} numberOfLines={1}>{currentVideo.video.name}</Text>
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

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!isCollapsed) {
        toggleCollapsible();
        showBerriesHelper(false);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isCollapsed]);

  const QueueList = () => (
    <FlatList
      data={queueVideos}
      ItemSeparatorComponent={() => <View style={{ backgroundColor: colors.backgroundSecondaryAlternateColor, height: 1 }} />}
      renderItem={({ item }) => (
        <QueueVideo item={item} boxToken={box._id} permissions={permissions} berriesEnabled={user && user.mail && box.options.berries} />
      )}
      keyExtractor={(item) => item._id}
      initialNumToRender={8}
      windowSize={12}
      ListEmptyComponent={() => <Text style={{ textAlign: 'center', color: colors.inactiveColor, marginHorizontal: 20 }}>The Queue is empty.</Text>}
      ListFooterComponent={() => <Text style={{ textAlign: 'center', color: colors.inactiveColor, marginHorizontal: 20 }}>●</Text>}
    />
  );

  const onShare = async () => {
    try {
      const invite = await axios.post(`${Config.API_URL}/boxes/${box._id}/invite`, null);
      await Share.share({
        title: 'Share an invite to this box (This invite will expire in 15 minutes)',
        message: `https://berrybox.tv/i/${invite.data.link}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <View style={[styles.currentSpaceContainer, { backgroundColor: colors.backgroundAlternateColor }]}>
        <Pressable
          onPress={() => toggleCollapsible()}
          style={styles.currentSpace}
        >
          <View style={{ width: 35 }}>
            <ProfilePicture userId={box.creator._id} size={25} />
          </View>
          <View style={{ flex: 1, flexShrink: 1 }}>
            <Text style={[styles.boxName, { color: colors.textSystemColor }]} numberOfLines={1}>{box.name}</Text>
            <CurrentVideo />
          </View>
          <View style={{ width: 30 }}>
            <Animated.View
              style={{ transform: [{ rotate: spin }] }}
            >
              <Svg height="50" width="40">
                <Polygon
                  points="30,22 10,22 20,32"
                  fill={colors.textColor}
                />
              </Svg>
            </Animated.View>
          </View>
        </Pressable>
        <View style={{
          height: '55%', width: 1, marginRight: 5, marginLeft: 10, backgroundColor: '#777777',
        }}
        />
        {permissions.includes('editBox') ? (
          <Pressable style={[styles.shareSpace, { paddingHorizontal: 5 }]} onPress={onEdit}>
            <EditIcon width={20} height={20} fill={colors.textColor} />
          </Pressable>
        ) : null}
        {permissions.includes('inviteUser') ? (
          <>
            <Pressable style={[styles.shareSpace, { paddingRight: 7 }]} onPress={onShare}>
              <InviteIcon width={20} height={20} fill="rgba(0,154,235,0.75)" />
            </Pressable>
          </>
        ) : null}
      </View>
      <View style={{ backgroundColor: colors.background }}>
        <Collapsible
          collapsed={isCollapsed}
          style={{ height: height - 50 }}
        >
          <View style={{ backgroundColor: colors.backgroundSecondaryAlternateColor, padding: 10 }}>
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
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
              <View>
                {user && user.mail && box?.options?.berries && box?.creator?._id !== user._id ? (
                  <Pressable style={{ flex: 0, justifyContent: 'center' }} onPress={() => showBerriesHelper(!isBerriesHelperShown)}>
                    <BerryCounter count={berryCount} />
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>
          <Collapsible collapsed={!isBerriesHelperShown}>
            <BerryHelper box={box} permissions={permissions} />
          </Collapsible>
          {user && user.mail && box.playlist.length > 0 ? (
            <Text style={{ textAlign: 'center', color: colors.textSystemColor, paddingVertical: 5 }}>Tap a video for more info</Text>
          ) : null}
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
        <Text style={{ color: 'white' }}>Option updated successfully.</Text>
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
        <Text style={{ color: 'white' }}>Something wrong happened. Please try again.</Text>
      </Snackbar>
    </>
  );
};

export default Queue;
