import React, {
  useEffect, useRef, useState,
} from 'react';
import {
  Pressable, View, Text, StyleSheet,
} from 'react-native';
import emojiDataSource from 'emoji-datasource';
import ViewPager, { ViewPagerOnPageSelectedEvent } from '@react-native-community/viewpager';
import AsyncStorage from '@react-native-community/async-storage';

import EmojiView from './emoji-view';
import { useTheme } from '../../shared/theme.context';
import BackspaceIcon from '../../../assets/icons/backspace-icon.svg';
import HistoryIcon from '../../../assets/icons/history-icon.svg';
import { IEmoji } from './types';
import EmojiClass from './emoji-methods';

const EmojiBoard = (props: {
    selectedEmoji: (emoji: string) => void,
    shortBackspace: () => void,
    longBackspace: () => void,
}) => {
  const { selectedEmoji, shortBackspace, longBackspace } = props;
  const [activeCategory, setActiveCategory] = useState('emotions');
  const [sections, setSections] = useState<{ title: string, data: Array<IEmoji> }[]>([]);
  const _emojiPager = useRef(null);
  const { colors } = useTheme();

  const emojiList = emojiDataSource.filter((e) => !e.obsoleted_by);

  const categories = [
    {
      key: 'history',
      name: 'History',
      icon: () => <HistoryIcon width={20} height={20} fill={colors.textSystemColor} />,
    },
    {
      key: 'emotions',
      name: 'Smileys & Emotion',
      icon: '🙂',
    },
    {
      key: 'people',
      name: 'People & Body',
      icon: '👋',
    },
    {
      key: 'animals',
      name: 'Animals & Nature',
      icon: '🐣',
    },
    {
      key: 'food',
      name: 'Food & Drink',
      icon: '🍏',
    },
    {
      key: 'activities',
      name: 'Activities',
      icon: '⚽',
    },
    {
      key: 'travel',
      name: 'Travel & Places',
      icon: '✈️',
    },
    {
      key: 'objects',
      name: 'Objects',
      icon: '💡',
    },
    {
      key: 'symbols',
      name: 'Symbols',
      icon: '🔣',
    },
    {
      key: 'flags',
      name: 'Flags',
      icon: '🏳️',
    },
  ];

  useEffect(() => {
    const targetCategory = categories.findIndex((c) => activeCategory === c.key);
    if (_emojiPager && _emojiPager.current && targetCategory !== -1) {
      _emojiPager.current?.setPage(targetCategory);
    }
  }, [activeCategory]);

  useEffect(() => {
    const fillData = async () => {
      const displayData: Array<{ title: string, data: Array<IEmoji> }> = categories.map(
        (c) => ({
          title: c.name,
          data: c.key !== 'history'
            ? emojiList
              .filter((e) => e.category === c.name)
              .sort((a, b) => a.sort_order - b.sort_order)
            : [],
        }),
      );

      displayData[0].data = JSON.parse(await AsyncStorage.getItem('BBOX-emoji-history')) ?? [];

      setSections(displayData);
    };

    fillData();
  }, []);

  const styles = StyleSheet.create({
    tabBar: {
      height: 40,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  });

  if (!emojiList) {
    return null;
  }

  if (sections.length === 0) {
    return null;
  }

  const setCategory = (e: ViewPagerOnPageSelectedEvent) => {
    setActiveCategory(categories[e.nativeEvent.position].key);
  };

  const selectEmoji = (emoji: IEmoji) => {
    // Add it to history
    const emojiIndex = sections[0].data.indexOf(emoji);
    if (emojiIndex !== -1) {
      sections[0].data.splice(emojiIndex, 1);
    }
    sections[0].data.unshift(emoji);
    // Keep only the 50 first emojis
    sections[0].data.slice(0, 50);

    AsyncStorage.setItem('BBOX-emoji-history', JSON.stringify(sections[0].data));

    // Send emoji to parent
    selectedEmoji(EmojiClass.emojiToDisplay({ emoji }));
  };

  return (
    <View style={{ backgroundColor: '#121212', height: 170 }}>
      <ViewPager
        initialPage={1}
        style={{ height: 130 }}
        ref={_emojiPager}
        onPageSelected={setCategory}
      >
        {sections.map((section) => (
          <EmojiView section={section} selectedEmoji={selectEmoji} />
        ))}
      </ViewPager>
      <View style={styles.tabBar}>
        {categories.map((c) => (
          <Pressable
            key={c.key}
            onPress={() => setActiveCategory(c.key)}
            style={{
              flex: 1,
              height: 40,
              borderColor: activeCategory === c.key ? '#383838' : '#121212',
              borderTopWidth: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            android_ripple={{ color: '#272727' }}
          >
            { typeof c.icon === 'string' ? (
              <Text>{c.icon}</Text>
            ) : (
              c.icon
            )}
          </Pressable>
        ))}
        <Pressable
          onPress={shortBackspace}
          onLongPress={longBackspace}
          style={{
            flex: 1,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          android_ripple={{ color: '#272727' }}
        >
          <BackspaceIcon width={20} height={20} fill={colors.textSystemColor} />
        </Pressable>
      </View>
    </View>
  );
};

const isEqual = () => true;

export default React.memo(EmojiBoard, isEqual);
