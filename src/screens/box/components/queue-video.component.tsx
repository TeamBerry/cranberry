import React from 'react';
import {
  StyleSheet, Text, View, Image,
} from 'react-native';

import { QueueItem } from '@teamberry/muscadine';
import ProfilePicture from '../../../components/profile-picture.component';
import DurationIndicator from '../../../components/duration-indicator.component';

import BerriesIcon from '../../../../assets/icons/berry-coin-icon.svg';
import PlayNextIcon from '../../../../assets/icons/play-next-icon.svg';
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
  priority: {
    paddingHorizontal: 5,
    marginRight: 5,
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: -10,
    display: 'flex',
    flexDirection: 'row',
  },
  priorityValue: {
    textAlign: 'center',
    fontSize: 10,
    color: '#EB8400',
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 4,
  },
});

const QueueVideo = (props: { item: QueueItem, priority: number }) => {
  const { item, priority } = props;
  const { colors } = useTheme();

  return (
    <View style={styles.queueVideo}>
      <View style={{ flex: 0, flexDirection: 'row' }}>
        <View style={{ paddingRight: 10 }}>
          <Image
            style={[
              (item.startTime !== null && item.endTime === null) ? styles.currentVideo : {},
              { width: 140, height: 78.75 },
            ]}
            source={{ uri: `https://i.ytimg.com/vi/${item.video.link}/hqdefault.jpg` }}
          />
          <DurationIndicator
            duration={item.video.duration}
            withBorder={item.startTime !== null && item.endTime === null}
          />
        </View>
        <View style={{
          flex: 1,
          justifyContent: 'center',
        }}
        >
          {item.setToNext ? (
            <View style={styles.priority}>
              <PlayNextIcon fill="#EB8400" width={14} height={14} />
              <Text style={styles.priorityValue}>{priority}</Text>
            </View>
          ) : null}
          <Text style={[styles.queueVideoName, { color: colors.textColor }]} numberOfLines={2}>
            {item.stateForcedWithBerries ? (
              <View><BerriesIcon width={16} height={16} /></View>
            ) : null}
            {(item.startTime !== null && item.endTime === null) ? (
              <Text style={styles.currentVideoIndicator}>Playing: </Text>
            ) : null}
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

const isEqual = (prevProps: { item: QueueItem, priority: number }, nextProps: { item: QueueItem, priority: number }) => {
  const previousItem = prevProps.item;
  const nextItem = nextProps.item;

  return (
    previousItem.setToNext === nextItem.setToNext
      && prevProps.priority === nextProps.priority
        && previousItem.startTime === nextItem.startTime
        && previousItem.stateForcedWithBerries === nextItem.stateForcedWithBerries
  );
};

export default React.memo(QueueVideo, isEqual);
