import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Image, BackHandler,
} from 'react-native';

import { QueueItem } from '@teamberry/muscadine';
import ProfilePicture from '../../../components/profile-picture.component';
import DurationIndicator from '../../../components/duration-indicator.component';

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

const QueueVideo = (props: {
    item: QueueItem,
}) => {
  const {
    item,
  } = props;

  const [areActionsVisible, setActionsVisibility] = useState(false);
  const [deletionConfirmationShown, showDeletionConfirmation] = useState(false);
  const { colors } = useTheme();

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
            <ProfilePicture fileName={item.submitted_by.settings.picture} size={20} />
            <Text style={{ paddingLeft: 5, color: colors.textSystemColor }}>{item.submitted_by.name}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default QueueVideo;
