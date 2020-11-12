import React, { useEffect, useState } from 'react';
import {
  View,
} from 'react-native';

const convertDurationToSeconds = (value: string) => {
  const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  let hours = 0; let minutes = 0; let seconds = 0; let
    totalseconds;

  if (reptms.test(value)) {
    const matches = reptms.exec(value);
    if (matches[1]) hours = Number(matches[1]);
    if (matches[2]) minutes = Number(matches[2]);
    if (matches[3]) seconds = Number(matches[3]);
    totalseconds = hours * 3600 + minutes * 60 + seconds;
  }

  return totalseconds;
};

const DurationLine = (props: { current: number, videoDuration: string }) => {
  let { current } = props;
  const { videoDuration } = props;

  const [width, setWidth] = useState(0);

  let displayTimeout;

  useEffect(() => {
    const duration = convertDurationToSeconds(videoDuration);
    const durationWidthUnit = 100 / duration;

    displayTimeout = setInterval(() => {
      current += 1;
      setWidth(current * durationWidthUnit);
    }, 1000);

    return () => clearInterval(displayTimeout);
  }, [current, videoDuration]);

  return (
    <View style={{ width: `${width}%`, height: 2, backgroundColor: '#009AEB' }} />
  );
};

export default DurationLine;
