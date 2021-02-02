import React, { useState } from 'react';
import { View } from 'react-native';
import emojiDataSource from 'emoji-datasource';
import TabBar from './tab-bar.component';
import EmojiPager from './emoji-pager.component';

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

  if (!emojiList) {
    return null;
  }

  return (
    <View style={{ backgroundColor: '#121212', height: 170 }}>
      <EmojiPager
        categories={categories}
        emojiList={emojiList}
        activeCategory={activeCategory}
        selectedEmoji={selectedEmoji}
      />
      <TabBar
        categories={categories}
        activeCategory={activeCategory}
        selectedCategory={(category) => setActiveCategory(category)}
      />
    </View>
  );
};

export default EmojiBoard;
