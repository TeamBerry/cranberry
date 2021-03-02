import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../shared/theme.context';

const PresenceIndicator = (props: { status: boolean, size: number }) => {
  const { status, size } = props;
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    presenceIndicatorContainer: {
      height: (0.6 * size),
      width: (0.6 * size),
      borderRadius: (0.3 * size),
      backgroundColor: colors.background,
      position: 'absolute',
      top: (0.53 * size),
      left: (0.6 * size),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    presenceIndicator: {
      height: (0.4 * size),
      width: (0.4 * size),
      borderRadius: (0.2 * size),
      borderStyle: 'solid',
    },
    presenceIndicatorOffline: {
      borderWidth: (0.1 * size),
      borderColor: colors.inactiveColor,
    },
    presenceIndicatorOnline: {
      borderWidth: 1,
      borderColor: colors.background,
      backgroundColor: colors.successColor,
    },
  });

  if (!size) {
    return null;
  }

  return (
    <View style={styles.presenceIndicatorContainer}>
      <View style={[
        styles.presenceIndicator,
        status ? styles.presenceIndicatorOnline : styles.presenceIndicatorOffline,
      ]}
      />
    </View>
  );
};

export default PresenceIndicator;
