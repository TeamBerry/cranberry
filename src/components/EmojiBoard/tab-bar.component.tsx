import React from 'react';
import {
  Pressable, Text, StyleSheet, View,
} from 'react-native';

const TabBar = (props: { categories, activeCategory: string, selectedCategory: (categoryKey: string) => void }) => {
  const { categories, activeCategory, selectedCategory } = props;

  const styles = StyleSheet.create({
    tabBar: {
      height: 40,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  });

  return (
    <View style={styles.tabBar}>
      {categories.map((c) => (
        <Pressable
          key={c.key}
          onPress={() => selectedCategory(c.key)}
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
  );
};

export default TabBar;
