/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect, useRef } from 'react';
import { Image, View } from 'react-native';
import YouTube from 'react-native-youtube';
import { PlayingItem } from '@teamberry/muscadine';
import BxLoadingIndicator from '../../../components/bx-loading-indicator.component';
import DurationLine from './duration-line.component';

const Player = ({ boxKey, currentItem, height }: {
    boxKey: string,
    currentItem: PlayingItem,
    height: number
}) => {
  const _youtubeRef = useRef(null);
  const [isLoading, setLoading] = useState(true);
  const [isPlayerReady, setPlayerReadiness] = useState(false);
  const [videoPosition, setVideoPosition] = useState(0);

  useEffect(() => {
    setLoading(false);
  }, [currentItem]);

  useEffect(() => {
    if (currentItem && isPlayerReady) {
      const exactPosition = currentItem.position
        ? currentItem.position
        : Math.floor((Date.now() - Date.parse(currentItem.startTime.toString())) / 1000);
      const position = exactPosition <= 2 ? 0 : exactPosition;

      setVideoPosition(position);

      _youtubeRef.current.seekTo(position);
    }
  }, [currentItem, isPlayerReady]);

  if (isLoading) {
    return (
      <BxLoadingIndicator />
    );
  }

  if (currentItem) {
    return (
      <View style={{ flexDirection: 'column' }}>
        <YouTube
          ref={_youtubeRef}
          apiKey={boxKey}
          play
          videoId={currentItem.video.link}
          style={{ alignSelf: 'stretch', height: height - 2 }}
          onReady={() => setPlayerReadiness(true)}
        // eslint-disable-next-line no-console
          onError={(e) => console.log(e)}
        />
        <View style={{ height: 2, width: '100%', backgroundColor: '#444444' }}>
          <DurationLine current={videoPosition} videoDuration={currentItem.video.duration} />
        </View>
      </View>
    );
  }

  return (
    <Image
      style={{ width: 400, height: 200 }}
      source={require('../../../../assets/berrybox-logo-master.png')}
    />
  );
};

export default Player;
