import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, Text, StyleSheet } from 'react-native';


const OfflineNotice = () => {
  const [isConnected, setConnected] = useState(true);

  useEffect(() => {
    NetInfo.addEventListener((state) => setConnected(state.isConnected));
  });

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>The connexion has been lost. Reconnecting...</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#B30F4F',
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});

export default OfflineNotice;
