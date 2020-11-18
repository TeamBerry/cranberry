import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Image, Pressable, BackHandler,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';

import { QueueItem, Permission } from '@teamberry/muscadine';
import Collapsible from 'react-native-collapsible';
import ProfilePicture from '../../../components/profile-picture.component';
import DurationIndicator from '../../../components/duration-indicator.component';
import BxButtonComponent from '../../../components/bx-button.component';

import BerriesIcon from '../../../../assets/icons/berry-coin-icon.svg';
import { useTheme } from '../../../shared/theme.context';

const styles = StyleSheet.create({
  queueVideo: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    flexDirection: 'column',
  },
  queueVideoName: {
    fontFamily: 'Montserrat-Regular',
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
    borderColor: '#EB8400',
    borderWidth: 2,
  },
  nextVideoIndicator: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#EB8400',
  },
});

const QueueVideo = (props: { item: QueueItem, boxToken: string, permissions: Array<Permission>, berriesEnabled: boolean }) => {
  const {
    item, boxToken, permissions, berriesEnabled,
  } = props;
  const playNext = () => {
    axios.put(`${Config.API_URL}/boxes/${boxToken}/queue/${item._id}/next`);
  };

  const playNow = () => {
    axios.put(`${Config.API_URL}/boxes/${boxToken}/queue/${item._id}/now`);
  };

  const skip = () => {
    axios.put(`${Config.API_URL}/boxes/${boxToken}/queue/skip`);
  };

  const [areActionsVisible, setActionsVisibility] = useState(false);
  const [deletionConfirmationShown, showDeletionConfirmation] = useState(false);
  const { colors } = useTheme();

  const removeVideo = () => {
    if (!deletionConfirmationShown) {
      showDeletionConfirmation(true);
    } else {
      axios.delete(`${Config.API_URL}/boxes/${boxToken}/queue/${item._id}`);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (areActionsVisible) {
        setActionsVisibility(false);
        showDeletionConfirmation(false);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [areActionsVisible]);

  return (
    <Pressable
      android_ripple={{ color: '#4d4d4d' }}
      onPress={() => {
        setActionsVisibility(!areActionsVisible); showDeletionConfirmation(false);
      }}
    >
      <View style={[styles.queueVideo, deletionConfirmationShown ? { backgroundColor: 'rgba(235,23,42,0.2)' } : {}]}>
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
            <Text style={[styles.queueVideoName, { color: colors.textColor }]} numberOfLines={2}>
              {item.stateForcedWithBerries ? (
                <View>
                  <BerriesIcon width={16} height={16} />
                </View>
              ) : null}
              <Text style={styles.nextVideoIndicator}>{item.isPreselected ? 'Next: ' : null}</Text>
              <Text style={styles.currentVideoIndicator}>
                {(item.startTime !== null && item.endTime === null) ? 'Playing: ' : null}
              </Text>
              {item.video.name}
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <ProfilePicture userId={item.submitted_by._id} size={20} />
              <Text style={{ paddingLeft: 5, color: colors.textSystemColor }}>{item.submitted_by.name}</Text>
            </View>
          </View>
        </View>
        <Collapsible
          collapsed={!areActionsVisible}
          style={{
            display: 'flex', flexDirection: 'row', alignContent: 'center', paddingVertical: 10, justifyContent: 'space-around',
          }}
        >
          {(item.startTime !== null && item.endTime === null) ? (
            <>
              {permissions.includes('skipVideo') || berriesEnabled ? (
                <Pressable onPress={() => skip()}>
                  <BxButtonComponent options={{
                    type: 'skip',
                    text: permissions.includes('skipVideo') ? 'Skip' : '20 $BC$',
                    textDisplay: 'full',
                    context: permissions.includes('forcePlay') ? 'primary' : 'berries',
                  }}
                  />
                </Pressable>
              ) : null}
            </>
          ) : (
            <>
              {!deletionConfirmationShown ? (
                <>
                  {permissions.includes('forceNext') || berriesEnabled ? (
                    <Pressable onPress={() => playNext()}>
                      <BxButtonComponent options={{
                        type: 'forceNext',
                        text: permissions.includes('forceNext') ? 'Play Next' : '10 $BC$',
                        textDisplay: 'full',
                        context: permissions.includes('forceNext') ? 'primary' : 'berries',
                      }}
                      />
                    </Pressable>
                  ) : null}
                  {permissions.includes('forcePlay') || berriesEnabled ? (
                    <Pressable onPress={() => playNow()}>
                      <BxButtonComponent options={{
                        type: 'forcePlay',
                        text: permissions.includes('forcePlay') ? 'Play Now' : '30 $BC$',
                        textDisplay: 'full',
                        context: permissions.includes('forcePlay') ? 'primary' : 'berries',
                      }}
                      />
                    </Pressable>
                  ) : null}
                </>
              ) : null}
              {permissions.includes('removeVideo') ? (
                <>
                  {deletionConfirmationShown ? (
                    <Pressable onPress={() => showDeletionConfirmation(false)}>
                      <BxButtonComponent options={{
                        type: 'play',
                        text: 'Cancel deletion',
                        textDisplay: 'full',
                        context: 'primary',
                      }}
                      />
                    </Pressable>
                  ) : null}
                  <Pressable onPress={() => removeVideo()}>
                    <BxButtonComponent options={{
                      type: 'cancel',
                      text: deletionConfirmationShown ? 'Tap again to confirm' : 'Remove',
                      textDisplay: 'full',
                      context: 'danger',
                    }}
                    />
                  </Pressable>
                </>
              ) : null}
            </>
          )}
        </Collapsible>
      </View>
    </Pressable>
  );
};

export default QueueVideo;
