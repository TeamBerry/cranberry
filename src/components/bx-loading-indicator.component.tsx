import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

const BxLoadingIndicator = () => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size="large" color="#EB8400" />
  </View>
);

export default BxLoadingIndicator;
