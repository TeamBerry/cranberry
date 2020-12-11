import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import RandomIcon from '../../assets/icons/random-icon.svg';
import ReplayIcon from '../../assets/icons/replay-icon.svg';
import BerriesIcon from '../../assets/icons/coin-enabled-icon.svg';
import DurationLimitIcon from '../../assets/icons/duration-limit-icon.svg';
import LockIcon from '../../assets/icons/lock-icon.svg';
import { useTheme } from '../shared/theme.context';

export interface ChipOptions {
    chipText?: string,
    type: 'random' | 'loop' | 'coin-enabled' | 'lock' | 'duration-limit'
    icon?: string
}

const InsertIcon = ({ type, color }: { type: string, color: string }) => {
  switch (type) {
    case 'random':
      return <RandomIcon width={10} height={10} fill={color} />;

    case 'loop':
      return <ReplayIcon width={10} height={10} fill={color} />;

    case 'coin-enabled':
      return <BerriesIcon width={10} height={10} fill={color} />;

    case 'lock':
      return <LockIcon width={10} height={10} fill={color} />;

    case 'duration-limit':
      return <DurationLimitIcon width={10} height={10} fill={color} />;

    default:
      return null;
  }
};

const BxChipComponent = ({ options, display }: { options: ChipOptions, display: 'full' | 'icon' }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    boxMode: {
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: colors.chipColor,
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
      color: colors.textColor,
    },
  });

  return (
    <View style={[styles.boxMode, (display === 'full') ? styles.boxModeFull : styles.boxModeIcon]}>
      <View style={styles.modeIcon}>
        <InsertIcon type={options.type} color={colors.textColor} />
      </View>
      {display === 'full' ? (<Text style={styles.modeText}>{options.chipText}</Text>) : null}
    </View>
  );
};

export default BxChipComponent;
