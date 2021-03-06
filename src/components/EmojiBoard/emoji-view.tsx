import React from 'react';
import {
  FlatList, View, Pressable, Text,
} from 'react-native';
import { IEmoji } from './emoji-interface';

const EmojiView = (props: { section, selectedEmoji: (emoji: IEmoji, displayableEmoji: string) => void }) => {
  const { section, selectedEmoji } = props;
  const extractEmojiKey = (item) => item.unified;

  const renderEmojiCell = ({ item }) => {
    const displayableEmoji = String.fromCodePoint(...item.unified.split('-').map((u) => `0x${u}`));

    return (
      <Pressable
        style={{
          height: 42, alignItems: 'center', justifyContent: 'center', padding: 5,
        }}
        key={item.unified}
        onPress={() => selectedEmoji(item, displayableEmoji)}
      >
        <Text style={{ fontSize: 26, color: 'white' }}>
          {displayableEmoji}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      key={section.title}
    >
      <FlatList
        data={section.data}
        contentContainerStyle={{
          paddingHorizontal: 8,
        }}
        renderItem={renderEmojiCell}
        numColumns={8}
        initialNumToRender={10}
        getItemLayout={(_, index) => (
          { length: 42, offset: 42 * index, index }
        )}
        keyExtractor={extractEmojiKey}
      />
    </View>
  );
};

const isEqual = (prevProps, nextProps) => prevProps.section.data.length === nextProps.section.data.length;

export default React.memo(EmojiView, isEqual);
