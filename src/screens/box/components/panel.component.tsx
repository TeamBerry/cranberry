import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

import ChatTab from './chat-tab.component';
import SearchTab from './search-tab.component';

const Panel = (props: { boxToken: string, socket: any}) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'chat', title: 'Chat' },
    { key: 'search', title: 'Search' },
  ]);

  const initialLayout = { width: Dimensions.get('window').width };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'chat':
        return <ChatTab boxToken={props.boxToken} socket={props.socket} />;
      case 'search':
        return <SearchTab boxToken={props.boxToken} socket={props.socket} />;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      style={{ backgroundColor: '#191919' }}
      indicatorStyle={{ backgroundColor: '#009AEB' }}
      pressColor="#191919"
      labelStyle={{
        fontFamily: 'Montserrat-Regular',
        textTransform: 'capitalize',
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
