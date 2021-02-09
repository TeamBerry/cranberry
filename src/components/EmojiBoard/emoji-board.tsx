import React, {
  useEffect, useRef, useState,
} from 'react';
import {
  Pressable, View, Text, StyleSheet,
} from 'react-native';
import emojiDataSource from 'emoji-datasource';
import ViewPager, { ViewPagerOnPageSelectedEvent } from '@react-native-community/viewpager';
import EmojiView from './emoji-view';
import BackspaceIcon from '../../../assets/icons/backspace-icon.svg';
import { useTheme } from '../../shared/theme.context';

export type Emoji = {
    'added_in': string,
    'au': string,
    'category': string,
    'docomo': string,
    'google': string,
    'has_img_apple': boolean,
    'has_img_facebook': boolean,
    'has_img_google': boolean,
    'has_img_twitter': boolean,
    'image': string,
    'name': string,
    'non_qualified': unknown,
    'sheet_x': number,
    'sheet_y': number,
    'short_name': string,
    'short_names': Array<string>,
    'softbank': string,
    'sort_order': number,
    'text': string,
    'texts': Array<string>,
    'unified': string
}

const EmojiBoard = (props: {
    selectedEmoji: (emoji: string) => void,
    shortBackspace: () => void,
    longBackspace: () => void,
}) => {
  const { selectedEmoji, shortBackspace, longBackspace } = props;
  const [activeCategory, setActiveCategory] = useState('emotions');
  const _emojiPager = useRef(null);
  const { colors } = useTheme();

  const emojiList = emojiDataSource.filter((e) => !e.obsoleted_by);

  const categories = [
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

  const displayData: Array<{ title: string, data: Array<Emoji> }> = categories.map(
    (c) => ({
      title: c.name,
      data: emojiList
        .filter((e) => e.category === c.name)
        .sort((a, b) => a.sort_order - b.sort_order),
    }),
  );

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

  if (displayData.length === 0) {
    return null;
  }

  const setCategory = (e: ViewPagerOnPageSelectedEvent) => {
    setActiveCategory(categories[e.nativeEvent.position].key);
  };

  return (
    <View style={{ backgroundColor: '#121212', height: 170 }}>
      <ViewPager
        initialPage={0}
        style={{ height: 130 }}
        ref={_emojiPager}
        onPageSelected={setCategory}
      >
        {displayData.map((section) => (
          <EmojiView section={section} selectedEmoji={selectedEmoji} />
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
            <Text>{c.icon}</Text>
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
