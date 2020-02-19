import React from "react"
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native"

import ChatTab from './chat-tab.component';
import QueueTab from './queue-tab.component';
import SearchTab from './search-tab.component';
import { Box } from "../../../models/box.model";

export type Panel = 'chat' | 'queue' | 'users' | 'search'

const PanelComponent = () => {

    let activePanel: Panel = 'chat';

    function Tab(props) {
        const selectedPanel = props.activePanel

        switch (selectedPanel) {
            case 'chat':
                return <ChatTab></ChatTab>

            case 'queue':
                return <QueueTab></QueueTab>

            case 'search':
                return <SearchTab></SearchTab>

            default:
                return <ChatTab></ChatTab>
        }
    }


    return (
        <View>
            <Text>Panel Icons</Text>
            <View>
                <Tab selectedPanel={activePanel}></Tab>
            </View>
        </View>
    )
}

export default PanelComponent
