import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import ChatTab from "./chat-tab.component";
import SearchTab from "./search-tab.component";

const Panel = (props: { boxToken: string, socket: any}) => {

    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'first', title: 'Chat' },
        { key: 'second', title: 'Search' }
    ])

    const initialLayout = { width: Dimensions.get('window').width };

    const FirstRoute = () => (
        <ChatTab boxToken={props.boxToken} socket={props.socket} />
    )

    const SecondRoute = () => (
        <SearchTab boxToken={props.boxToken} socket={props.socket}/>
    )

    const renderTabBar = (props) => {
        return (
            <TabBar
                {...props}
                style={{ backgroundColor: '#191919' }}
                indicatorStyle={{ backgroundColor: '#009AEB' }}
                pressColor={'#191919'}
                labelStyle={{
                    fontFamily: 'Montserrat-Regular',
                    textTransform: 'capitalize'
                }}
                activeColor={'#009AEB'}
            />
        )
    }

    return (
        <TabView
            navigationState={{ index, routes }}
            renderTabBar={renderTabBar}
            renderScene={SceneMap({
                first: FirstRoute,
                second: SecondRoute
            })}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
        />
    )
}

export default Panel