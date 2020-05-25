import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import durationToString from '../shared/duration.pipe';

const styles = StyleSheet.create({
  durationDisplayBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    top: 52,
    left: 2,
    width: '97%',
    padding: 3,
  },
  durationDisplay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    top: 54,
    left: 0,
    width: '100%',
    padding: 3,
  },
});

const DurationIndicator = ({ duration, withBorder }: { duration: string, withBorder: boolean }) => (
  <View style={withBorder ? styles.durationDisplayBorder : styles.durationDisplay}>
    <Text style={{ color: 'white', textAlign: 'center' }}>{durationToString(duration)}</Text>
  </View>
);

export default DurationIndicator;
