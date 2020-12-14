import React, { } from 'react';
import {
  Image, View, Text, StyleSheet, Pressable,
} from 'react-native';
import { Permission } from '@teamberry/muscadine';

import DurationIndicator from '../../../components/duration-indicator.component';
import BxButtonComponent from '../../../components/bx-button.component';
import { useTheme } from '../../../shared/theme.context';

const styles = StyleSheet.create({
  resultItem: {
    paddingVertical: 10,
    flexDirection: 'column',
  },
  inQueueIndicator: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#0CEBC0',
  },
  inQueueVideo: {
    borderColor: '#0CEBC0',
    borderWidth: 2,
  },
});

export interface Video {
      _id?: string,
      name: string,
      link: string;
      duration?: string;
}

export interface Props {
    video: Video,
    isAlreadyInQueue: boolean,
    berriesEnabled: boolean,
    permissions: Array<Permission>,
    onPress: (video: Video, flag?: string) => void
}

const SearchVideo = (props: Props) => {
  const {
    video, isAlreadyInQueue, berriesEnabled, permissions, onPress,
  } = props;
  const { colors } = useTheme();

  return (
    <View style={styles.resultItem}>
      <View style={{ flex: 0, flexDirection: 'row' }}>
        <View style={{ paddingRight: 10 }}>
          <Image
            style={[{ width: 140, height: 78.75 }, isAlreadyInQueue ? styles.inQueueVideo : null]}
            source={{ uri: `https://i.ytimg.com/vi/${video.link}/hqdefault.jpg` }}
          />
          <DurationIndicator duration={video.duration} withBorder={isAlreadyInQueue} />
        </View>
        <View style={{
          flex: 1,
          justifyContent: 'center',
        }}
        >
          <Text style={{ color: colors.textColor, fontFamily: 'Montserrat-Light' }} numberOfLines={3}>
            {isAlreadyInQueue ? (<Text style={styles.inQueueIndicator}>Already in Queue: </Text>) : null}
            {video.name}
          </Text>
        </View>
      </View>
      <View style={{
        display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', paddingTop: 10,
      }}
      >
        <>
          {!isAlreadyInQueue ? (
            <>
              {permissions.includes('addVideo') ? (
                <Pressable onPress={() => onPress(video)}>
                  <BxButtonComponent options={{
                    type: 'play',
                    text: 'Later',
                    textDisplay: 'full',
                  }}
                  />
                </Pressable>
              ) : null}
            </>
          ) : null}
          {(permissions.includes('forceNext') && (isAlreadyInQueue || (!isAlreadyInQueue && permissions.includes('addVideo'))))
                || berriesEnabled ? (
                  <Pressable onPress={() => onPress(video, 'next')}>
                    <BxButtonComponent options={{
                      type: 'forceNext',
                      text: permissions.includes('forceNext') ? 'Next' : '10 $BC$',
                      textDisplay: 'full',
                      context: permissions.includes('forceNext') ? 'primary' : 'berries',
                    }}
                    />
                  </Pressable>
            ) : null}
          {(permissions.includes('forcePlay') && (isAlreadyInQueue || (!isAlreadyInQueue && permissions.includes('addVideo'))))
                || berriesEnabled ? (
                  <Pressable onPress={() => onPress(video, 'now')}>
                    <BxButtonComponent options={{
                      type: 'forcePlay',
                      text: permissions.includes('forcePlay') ? 'Now' : '30 $BC$',
                      textDisplay: 'full',
                      context: permissions.includes('forcePlay') ? 'primary' : 'berries',
                    }}
                    />
                  </Pressable>
            ) : null}
        </>
      </View>
    </View>
  );
};

const isEqual = (prevProps: Props, nextProps: Props) => {
  const oldInQueue = prevProps.isAlreadyInQueue;
  const newInQueue = nextProps.isAlreadyInQueue;
  return oldInQueue === newInQueue;
};

export default React.memo(SearchVideo, isEqual);
