import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#009aeb',
    padding: 10,
    borderRadius: 5,
    color: 'white',
  },
});

const FormTextInput = (props) => (
  <TextInput
    placeholderTextColor="#BBBBBB"
    style={styles.textInput}
    {...props}
  />
);

export default FormTextInput;
