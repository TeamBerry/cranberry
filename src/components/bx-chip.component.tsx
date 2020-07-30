import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import RandomIcon from '../../assets/icons/random-icon.svg';
import ReplayIcon from '../../assets/icons/replay-icon.svg';
import BerriesIcon from '../../assets/icons/coin-enabled-icon.svg';
import DurationLimitIcon from '../../assets/icons/duration-limit-icon.svg';
import LockIcon from '../../assets/icons/lock-icon.svg';

const styles = StyleSheet.create({
  boxMode: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#979797',
    color: 'white',
    borderRadius: 10,
    height: 18,
  },
  boxModeFull: {
    width: 70,
  },
  boxModeIcon: {
    width: 20,
  },
  modeIcon: {
    paddingHorizontal: 5,
  },
  modeText: {
    fontSize: 11,
    color: 'white',
  },
});

export interface ChipOptions {
    chipText?: string,
    type: 'random' | 'loop' | 'coin-enabled' | 'lock' | 'duration-limit'
    icon?: string
}

const InsertIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'random':
      return <RandomIcon width={10} height={10} fill="white" />;

    case 'loop':
      return <ReplayIcon width={10} height={10} fill="white" />;

    case 'coin-enabled':
      return <BerriesIcon width={10} height={10} fill="white" />;

    case 'lock':
      return <LockIcon width={10} height={10} fill="white" />;

    case 'duration-limit':
      return <DurationLimitIcon width={10} height={10} fill="white" />;

    default:
      return <></>;
  }
};

const BxChipComponent = ({ options, display }: { options: ChipOptions, display: 'full' | 'icon' }) => (
  <View style={[styles.boxMode, (display === 'full') ? styles.boxModeFull : styles.boxModeIcon]}>
    <View style={styles.modeIcon}>
      <InsertIcon type={options.type} />
    </View>
    {display === 'full' ? (<Text style={styles.modeText}>{options.chipText}</Text>) : (<></>)}
  </View>
);

export default BxChipComponent;
