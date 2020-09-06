import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    height: 40,
    backgroundColor: '#009AEB',
    borderRadius: 3,
    flex: 0,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export interface ActionOptions {
    text: string,
    context?: 'primary'
}

const BxActionComponent = ({ options }: { options: ActionOptions }) => (
  <View style={styles.button}>
    <Text style={styles.buttonText}>{options.text}</Text>
  </View>
);

export default BxActionComponent;
