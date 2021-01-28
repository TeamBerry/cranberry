import React from 'react';
import {
  StyleSheet, View, Pressable, Text,
} from 'react-native';
import { useTheme } from '../shared/theme.context';
import BackIcon from '../../assets/icons/back-icon.svg';

const BxHeader = (props: { text: string, onPress: () => void}) => {
  const { text, onPress } = props;
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    headerContainer: {
      paddingVertical: 20,
      paddingHorizontal: 10,
      borderColor: '#191919',
      borderStyle: 'solid',
      borderBottomWidth: 1,
      backgroundColor: colors.background,
    },
    headerStyle: {
      height: 20,
      elevation: 0,
      shadowOpacity: 0,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    settingTitle: {
      color: colors.textColor,
      marginLeft: 30,
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 18,
    },
  });

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerStyle}>
        <Pressable onPress={onPress}>
          <BackIcon width={20} height={20} fill={colors.textColor} />
        </Pressable>
        <Text style={styles.settingTitle}>{text}</Text>
      </View>
    </View>
  );
};

export default BxHeader;
