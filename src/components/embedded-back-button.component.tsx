import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../shared/theme.context';
import BackIcon from '../../assets/icons/back-icon.svg';

const EmbeddedBackButton = (props: { text: string, onPress: () => void }) => {
  const { text, onPress } = props;
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    backPrompt: {
      width: 140,
      paddingLeft: 10,
      paddingVertical: 10,
      backgroundColor: colors.backgroundAlternateColor,
      borderBottomRightRadius: 70,
      display: 'flex',
      flexDirection: 'row',
    },
  });

  return (
    <Pressable
      style={styles.backPrompt}
      onPress={onPress}
    >
      <BackIcon width={20} height={20} fill={colors.textSystemColor} />
      <Text style={{ color: colors.textSystemColor }}>{ text }</Text>
    </Pressable>
  );
};

export default EmbeddedBackButton;
