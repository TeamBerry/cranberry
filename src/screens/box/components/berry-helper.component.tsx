import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Permission } from '@teamberry/muscadine';
import BerriesIcon from '../../../../assets/icons/berry-coin-icon.svg';
import PlayNextIcon from '../../../../assets/icons/force-next-icon.svg';
import PlayNowIcon from '../../../../assets/icons/force-play-icon.svg';
import SkipIcon from '../../../../assets/icons/skip-icon.svg';
import Box from '../../../models/box.model';

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
    backgroundColor: '#262626',
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
    color: 'white',
    fontSize: 10,
  },
});

const ActionValue = ({ value }) => (
  <View style={{
    flex: 0, flexDirection: 'row', alignItems: 'center',
  }}
  >
    <BerriesIcon width={20} height={20} />
    <Text style={{ color: 'white', fontFamily: 'Montserrat-SemiBold', paddingLeft: 2 }}>{value}</Text>
  </View>
);

const BerryHelper = (props: { box: Box, permissions: Array<Permission> }) => {
  const { box, permissions } = props;

  return (
    <View style={{ backgroundColor: '#131313', padding: 5 }}>
      <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Montserrat-SemiBold' }}>Berries</Text>
      <Text style={{ color: '#BBBBBB' }}>
        You will collect berries as you participate in the community of this box.
        You can use these berries to execute special actions indicated by their orange border:
      </Text>
      <View style={styles.actionList}>
        {!permissions.includes('skipVideo') && box.options.berries ? (
          <View style={styles.actionContainer}>
            <View style={styles.action}>
              <SkipIcon width={20} height={20} fill="white" />
              <ActionValue value={10} />
            </View>
            <Text style={styles.actionDescription}>Skips the current video</Text>
          </View>
        ) : null}
        {!permissions.includes('forceNext') && box.options.berries ? (
          <View style={styles.actionContainer}>
            <View style={styles.action}>
              <PlayNextIcon width={20} height={20} fill="white" />
              <ActionValue value={20} />
            </View>
            <Text style={styles.actionDescription}>Plays the selected video after the current one.</Text>
          </View>
        ) : null}
        {!permissions.includes('forcePlay') && box.options.berries ? (
          <View style={styles.actionContainer}>
            <View style={styles.action}>
              <PlayNowIcon width={20} height={20} fill="white" />
              <ActionValue value={30} />
            </View>
            <Text style={styles.actionDescription}>Skips the current video for the selected one.</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default BerryHelper;
