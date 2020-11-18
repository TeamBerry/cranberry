import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../shared/theme.context';

const styles = StyleSheet.create({
  defaultStyle: {
    height: 2,
  },
});

const CountdownIndicator = (props: { time: number, color?: string, text: string }) => {
  const { time, color, text } = props;
  const { colors } = useTheme();

  const [width, setWidth] = useState(100);
  let displayTimeout;
  const widthFraction = (1 / (time / 1000)) * 100;

  useEffect(() => {
    displayTimeout = setInterval(() => {
      setWidth((width) => width - widthFraction);
    }, 1000);

    return () => clearInterval(displayTimeout);
  }, []);

  return (
    <>
      <Text style={{ textAlign: 'center', color: colors.textSystemColor, paddingVertical: 5 }}>{text}</Text>
      { width > 0 ? (
        <View style={[styles.defaultStyle, { width: `${width}%`, backgroundColor: color ?? '#009AEB' }]} />
      ) : null}
    </>
  );
};

CountdownIndicator.defaultProps = {
  color: '#009AEB',
};

export default CountdownIndicator;
