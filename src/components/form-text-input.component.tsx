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
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);

export default FormTextInput;
