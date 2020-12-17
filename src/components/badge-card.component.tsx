import React from 'react';
import {
  Text, View, Image, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { format, parseISO } from 'date-fns';

import Badge from '../models/badge.model';
import { useTheme } from '../shared/theme.context';

const BadgeCard = (props: { badge: Badge, unlocked: boolean, chosen: boolean, onChoose: () => void }) => {
  const {
    badge, unlocked, chosen, onChoose,
  } = props;
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondaryColor,
      padding: 10,
      borderRadius: 5,
    },
    badgePicture: {
      width: 90,
      height: 90,
      marginRight: 10,
    },
    badgePictureLocked: {
      opacity: 0.1,
    },
    badgeContents: {
      alignItems: 'flex-start',
      flexShrink: 1,
      justifyContent: 'space-between',
    },
    badgeTitle: {
      fontFamily: 'Montserrat-SemiBold',
      color: colors.textColor,
    },
    badgeDescription: {
      color: colors.textSystemColor,
      fontSize: 11,
    },
  });

  return (
    <View style={styles.card}>
      <Image source={{ uri: badge.picture }} style={[styles.badgePicture, unlocked ? {} : styles.badgePictureLocked]} />
      <View style={styles.badgeContents}>
        <Text style={styles.badgeTitle}>
          {badge.name}
        </Text>
        <Text style={styles.badgeDescription}>
          {badge.description}
        </Text>
        {badge.availableTo ? (
          <Text style={{ color: colors.textSecondaryColor, fontSize: 9 }}>
            Available until
            {' '}
            {format(parseISO(badge.availableTo as string), 'dd MMM y')}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default BadgeCard;
