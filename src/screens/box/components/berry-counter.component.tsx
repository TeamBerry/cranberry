import React from 'react';
import { View, Text } from 'react-native';

import BerriesIcon from '../../../../assets/icons/berry-coin-icon.svg';

const BerryCounter = (props: { count: number }) => {
  const { count } = props;
  return (
    <View style={{
      flex: 0, flexDirection: 'row', alignItems: 'center', paddingLeft: 5,
    }}
    >
      <BerriesIcon width={20} height={20} />
      <Text style={{ color: 'white', fontFamily: 'Montserrat-SemiBold', paddingLeft: 2 }}>{count}</Text>
    </View>
  );
};

export default BerryCounter;
