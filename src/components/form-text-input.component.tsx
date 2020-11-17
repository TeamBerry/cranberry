import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useTheme } from '../shared/theme.context';

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#009aeb',
    padding: 10,
    borderRadius: 5,
  },
});

const FormTextInput = (props) => {
  const { colors } = useTheme();

  return (
    <TextInput
      placeholderTextColor={colors.textSystemColor}
      style={[styles.textInput, { color: colors.textColor }]}
            // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

export default FormTextInput;
