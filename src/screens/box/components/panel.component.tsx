import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import ChatTab from "./chat-tab.component";
import SearchTab from "./search-tab.component";

const Panel = (props: { boxToken: string, socket: any}) => {

    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'first', title: 'Chat' },
        { key: 'second', title: 'Search' }
    ])

    const FirstRoute = () => (
        <ChatTab boxToken={props.boxToken} socket={props.socket} />
    )

    const SecondRoute = () => (
        <SearchTab boxToken={props.boxToken} socket={props.socket}/>
    )

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={SceneMap({
                first: FirstRoute,
                second: SecondRoute
            })}
            onIndexChange={setIndex}
        />
    )
}

export default Panel