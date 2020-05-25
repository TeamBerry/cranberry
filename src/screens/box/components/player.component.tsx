/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Image } from 'react-native';
import YouTube from 'react-native-youtube';
import { QueueItem } from '@teamberry/muscadine';

const Player = ({ boxKey, currentItem }: {
    boxKey: string,
    currentItem: QueueItem
}) => {
  const _youtubeRef = useRef(null);
  const [isLoading, setLoading] = useState(true);
  const [isPlayerReady, setPlayerReadiness] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [currentItem]);

  useEffect(() => {
    if (currentItem && isPlayerReady) {
      const exactPosition = Math.floor((Date.now() - Date.parse(currentItem.startTime.toString())) / 1000);
      const position = exactPosition <= 2 ? 0 : exactPosition;

      _youtubeRef.current.seekTo(position);
    }
  }, [currentItem, isPlayerReady]);

  if (isLoading) {
    return (
      <ActivityIndicator />
    );
  }

  if (currentItem) {
    return (
      <YouTube
        ref={_youtubeRef}
        apiKey={boxKey}
        play
        videoId={currentItem.video.link}
        style={{ alignSelf: 'stretch', height: 204 }}
        onReady={() => setPlayerReadiness(true)}
        // eslint-disable-next-line no-console
        onError={(e) => console.log(e)}
      />
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
