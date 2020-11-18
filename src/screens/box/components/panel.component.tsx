import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

import { Permission } from '@teamberry/muscadine';
import ChatTab from './chat-tab.component';
import SearchTab from './search-tab.component';
import Box from '../../../models/box.model';
import { useTheme } from '../../../shared/theme.context';

const Panel = (props: { box: Box, socket: any, berryCount: number, permissions: Array<Permission> }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'chat', title: 'Chat' },
    { key: 'search', title: 'Search' },
  ]);
  const {
    box, socket, berryCount, permissions,
  } = props;
  const { colors } = useTheme();

  const initialLayout = { width: Dimensions.get('window').width };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'chat':
        return <ChatTab box={box} socket={socket} berryCount={berryCount} permissions={permissions} />;
      case 'search':
        return <SearchTab box={box} socket={socket} berryCount={berryCount} permissions={permissions} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
            // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      style={{ backgroundColor: colors.backgroundSecondaryAlternateColor }}
      indicatorStyle={{ backgroundColor: '#009AEB' }}
      pressColor={colors.backgroundSecondaryAlternateColor}
      labelStyle={{
        fontFamily: 'Montserrat-Regular',
        textTransform: 'capitalize',
        color: colors.textColor,
      }}
      activeColor="#009AEB"
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
};

export default Panel;
