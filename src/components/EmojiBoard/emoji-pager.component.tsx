import React, { useRef, useEffect } from 'react';
import ViewPager from '@react-native-community/viewpager';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Emoji } from './emoji-board';

const EmojiPager = (props: {
    categories,
    emojiList: Array<Emoji>,
    activeCategory: string,
    selectedEmoji: (emoji: string) => void
    onCategorySelected: (page: number) => void
}) => {
  const {
    categories, emojiList, selectedEmoji, activeCategory,
  } = props;
  const _emojiPager = useRef(null);

  const unifiedToChar = (unified) => String.fromCodePoint(...unified.split('-').map((u) => `0x${u}`));
  const sortEmoji = (list) => list.sort((a, b) => a.sort_order - b.sort_order);

  useEffect(() => {
    const targetCategory = categories.findIndex((c) => activeCategory === c.key);
    if (_emojiPager && _emojiPager.current && targetCategory !== -1) {
      _emojiPager.current?.setPage(targetCategory);
    }
  }, [activeCategory]);

  const displayData: Array<{ title: string, data: Array<Emoji> }> = [];

  categories.map((c) => {
    const emojisOfCategory = emojiList.filter((e) => e.category === c.name);
    return displayData.push({ title: c.name, data: sortEmoji(emojisOfCategory) });
  });

  if (displayData.length === 0) {
    return null;
  }

  const renderEmojiCell = (emoji: Emoji) => {
    const displayableEmoji = unifiedToChar(emoji.unified);

    return (
      <Pressable
        style={{
          height: 42, alignItems: 'center', justifyContent: 'center', padding: 5,
        }}
        onPress={() => selectedEmoji(displayableEmoji)}
        key={emoji.unified}
      >
        <Text style={{ fontSize: 26 }}>
          {displayableEmoji}
        </Text>
      </Pressable>
    );
  };

  return (
    <ViewPager
      initialPage={0}
      style={{ height: 130 }}
      ref={_emojiPager}
    >
      {displayData.map((section) => (
        <View key={section.title}>
          <FlatList
            data={section.data}
            renderItem={({ item }) => renderEmojiCell(item)}
            numColumns={8}
            keyExtractor={(item) => item.unified}
            initialNumToRender={40}
          />
        </View>
      ))}
    </ViewPager>
  );
};

export default EmojiPager;
