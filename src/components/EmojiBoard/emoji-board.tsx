import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  FlatList, Pressable, View, Text, StyleSheet,
} from 'react-native';
import emojiDataSource from 'emoji-datasource';
import ViewPager, { ViewPagerOnPageSelectedEvent } from '@react-native-community/viewpager';

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

const EmojiBoard = (props: { selectedEmoji: (emoji: string) => void }) => {
  const { selectedEmoji } = props;
  const [activeCategory, setActiveCategory] = useState('emotions');
  const _emojiPager = useRef(null);

  const emojiList = emojiDataSource.filter((e) => !e.obsoleted_by);

  const categories = [
    {
      key: 'emotions',
      name: 'Smileys & Emotion',
      icon: '🙂',
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

  const renderEmojiCell = useCallback(
    ({ item }) => {
      if (item.unified === '1F600') {
        console.log('RENDERING');
      }
      const displayableEmoji = String.fromCodePoint(...item.unified.split('-').map((u) => `0x${u}`));

      return (
        <Pressable
          style={{
            height: 42, alignItems: 'center', justifyContent: 'center', padding: 5,
          }}
          key={item.unified}
          onPress={() => selectedEmoji(displayableEmoji)}
        >
          <Text style={{ fontSize: 26 }}>
            {displayableEmoji}
          </Text>
        </Pressable>
      );
    }, [],
  );

  const setCategory = (e: ViewPagerOnPageSelectedEvent) => {
    setActiveCategory(categories[e.nativeEvent.position].key);
  };

  const extractEmojiKey = (item) => item.unified;

  return (
    <View style={{ backgroundColor: '#121212', height: 170 }}>
      <ViewPager
        initialPage={0}
        style={{ height: 130 }}
        ref={_emojiPager}
        onPageSelected={setCategory}
      >
        {displayData.map((section) => (
          <View key={section.title}>
            <FlatList
              data={section.data}
              renderItem={renderEmojiCell}
              numColumns={8}
              initialNumToRender={10}
              getItemLayout={(_, index) => (
                { length: 42, offset: 42 * index, index }
              )}
              keyExtractor={extractEmojiKey}
            />
          </View>
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
      </View>
    </View>
  );
};

export default React.memo(EmojiBoard);
