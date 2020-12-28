import React from 'react';
import {
  Text, View, Image, StyleSheet, Pressable,
} from 'react-native';
import { format, parseISO } from 'date-fns';

import Badge from '../models/badge.model';
import { useTheme } from '../shared/theme.context';

const BadgeCard = (props: { badge: Badge, unlockedAt: Date, isDisplayed: boolean, onChoose: () => void }) => {
  const {
    badge, unlockedAt, isDisplayed, onChoose,
  } = props;
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    badgeCard: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondaryColor,
      padding: 10,
      borderRadius: 5,
      marginVertical: 5,
      marginHorizontal: 10,
    },
    badgeCardUnlocked: {
      borderRightWidth: 15,
      borderRightColor: colors.successColor,
    },
    badgeCardDisplayed: {
      borderRightWidth: 15,
      borderRightColor: colors.activeColor,
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

  const BadgeLife = () => (
    <Text style={{ color: colors.warningColor, fontSize: 9 }}>
      Available
      { badge.availableFrom ? (
        <>
          <Text>
            {' '}
            from
            {' '}
          </Text>
          {format(parseISO(badge.availableFrom as string), 'dd MMM y')}
        </>
      ) : null}
      { badge.availableTo ? (
        <>
          <Text>
            {' '}
            until
            {' '}
          </Text>
          {format(parseISO(badge.availableTo as string), 'dd MMM y')}
        </>
      ) : null}
    </Text>
  );

  const selectBadge = () => {
    if (unlockedAt) {
      onChoose();
    }
  };

  return (
    <Pressable
      style={[styles.badgeCard,
        isDisplayed ? styles.badgeCardUnlocked : {}]}
      onPress={selectBadge}
    >
      <Image source={{ uri: badge.picture }} style={[styles.badgePicture, unlockedAt ? {} : styles.badgePictureLocked]} />
      <View style={styles.badgeContents}>
        <Text style={styles.badgeTitle}>
          {badge.name}
        </Text>
        <Text style={styles.badgeDescription}>
          {badge.description}
        </Text>
        {unlockedAt ? (
          <Text style={{ color: colors.textColor, fontSize: 10, fontWeight: '700' }}>
            Unlocked on
            {' '}
            {format(parseISO(unlockedAt as unknown as string), 'dd MMM y')}
          </Text>
        ) : null}
        {(badge.availableFrom || badge.availableTo) && !unlockedAt ? (
          <BadgeLife />
        ) : null}
      </View>
    </Pressable>
  );
};

export default BadgeCard;
