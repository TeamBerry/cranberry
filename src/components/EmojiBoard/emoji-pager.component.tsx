import React, { useEffect, useRef } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Emoji } from './emoji-board';

const EmojiPager = (props: {
    categories,
    emojiList: Array<Emoji>,
    activeCategory: string,
    selectedEmoji: (emoji: Emoji) => void
}) => {
  const {
    categories, emojiList, activeCategory, selectedEmoji,
  } = props;
  const window = useWindowDimensions();
  const _emojiPager = useRef(null);

  const unifiedToChar = (unified) => String.fromCodePoint(...unified.split('-').map((u) => `0x${u}`));
  const sortEmoji = (list) => list.sort((a, b) => a.sort_order - b.sort_order);

  useEffect(() => {
    const targetCategory = categories.findIndex((c) => activeCategory === c.key);
    if (_emojiPager && _emojiPager.current && targetCategory !== -1) {
      _emojiPager.current.scrollToIndex({
        index: targetCategory,
      });
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

  const renderEmojiCell = (emoji: Emoji) => (
    <Pressable
      style={{
        height: 40, alignItems: 'center', justifyContent: 'center', padding: 5,
      }}
      onPress={() => selectedEmoji(emoji)}
    >
      <Text style={{ fontSize: 24 }}>
        {unifiedToChar(emoji.unified)}
      </Text>
    </Pressable>
  );

  const renderTab = (set: Array<Emoji>) => (
    <ScrollView style={{ height: 160, width: window.width }}>
      <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {set.map((e) => renderEmojiCell(e))}
      </View>
    </ScrollView>
  );

  return (
    <FlatList
      ref={_emojiPager}
      data={displayData}
      renderItem={({ item }) => renderTab(item.data)}
      horizontal
      initialNumToRender={2}
      keyExtractor={(item, index) => item.title + index}
      getItemLayout={(data, index) => (
        { length: window.width, offset: window.width * index, index }
      )}
      scrollEnabled={false}
    />
  );
};

export default EmojiPager;
