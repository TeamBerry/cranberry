import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Permission } from '@teamberry/muscadine';
import BerriesIcon from '../../../../assets/icons/berry-coin-icon.svg';
import PlayNextIcon from '../../../../assets/icons/play-next-icon.svg';
import PlayNowIcon from '../../../../assets/icons/play-now-icon.svg';
import SkipIcon from '../../../../assets/icons/skip-icon.svg';
import Box from '../../../models/box.model';
import { useTheme } from '../../../shared/theme.context';

const styles = StyleSheet.create({
  actionList: {
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionContainer: {
    width: 80,
    height: 130,
    flexDirection: 'column',
  },
  action: {
    width: 80,
    borderRadius: 5,
    height: 80,
    borderColor: '#FF8E52',
    borderWidth: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionDescription: {
    textAlign: 'center',
    fontSize: 11,
  },
});

const ActionValue = ({ value }) => {
  const { colors } = useTheme();
  return (
    <View style={{
      flex: 0, flexDirection: 'row', alignItems: 'center',
    }}
    >
      <BerriesIcon width={20} height={20} />
      <Text style={{ color: colors.textColor, fontFamily: 'Montserrat-SemiBold', paddingLeft: 2 }}>{value}</Text>
    </View>
  );
};

const BerryHelper = (props: { box: Box, permissions: Array<Permission> }) => {
  const { box, permissions } = props;
  const { colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.backgroundAlternateColor, padding: 5 }}>
      <Text style={{ color: colors.textColor, fontSize: 14, fontFamily: 'Montserrat-SemiBold' }}>Berries</Text>
      <Text style={{ color: colors.textSystemColor }}>
        You will collect berries as you participate in the community of this box.
        You can use these berries to execute special actions indicated by their orange border:
      </Text>
      <View style={styles.actionList}>
        {!permissions.includes('forceNext') && box.options.berries ? (
          <View style={styles.actionContainer}>
            <View style={[styles.action, { backgroundColor: colors.background }]}>
              <PlayNextIcon width={20} height={20} fill={colors.textColor} />
              <ActionValue value={10} />
            </View>
            <Text style={[styles.actionDescription, { color: colors.textColor }]}>Puts the selected video into the priority queue.</Text>
          </View>
        ) : null}
        {!permissions.includes('skipVideo') && box.options.berries ? (
          <View style={styles.actionContainer}>
            <View style={[styles.action, { backgroundColor: colors.background }]}>
              <SkipIcon width={20} height={20} fill={colors.textColor} />
              <ActionValue value={20} />
            </View>
            <Text style={[styles.actionDescription, { color: colors.textColor }]}>Skips the current video.</Text>
          </View>
        ) : null}
        {!permissions.includes('forcePlay') && box.options.berries ? (
          <View style={styles.actionContainer}>
            <View style={[styles.action, { backgroundColor: colors.background }]}>
              <PlayNowIcon width={20} height={20} fill={colors.textColor} />
              <ActionValue value={30} />
            </View>
            <Text style={[styles.actionDescription, { color: colors.textColor }]}>Skips the current video for the selected one.</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default BerryHelper;
