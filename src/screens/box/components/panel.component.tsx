import React from "react"
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native"

import ChatTab from './chat-tab.component';
import QueueTab from './queue-tab.component';
import SearchTab from './search-tab.component';
import { Box } from "../../../models/box.model";
import SocketContext from './../box.context';

export type Panel = 'chat' | 'queue' | 'users' | 'search'

const PanelComponent = props => {

    let activePanel: Panel = 'chat';

    console.log('Socket: ', props.socket)

    function DisplayTab(props) {
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
                {/* <DisplayTab selectedPanel={activePanel}></DisplayTab> */}
                <SocketContext.Consumer>
                    {socket => <ChatTab socket={socket}></ChatTab>}
                </SocketContext.Consumer>
            </View>
        </View>
    )
}

export default PanelComponent
