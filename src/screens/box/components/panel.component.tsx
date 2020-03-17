import React from "react"
import { Text, TouchableOpacity, View, Image, StyleSheet, KeyboardAvoidingView } from "react-native"

import ChatTab from './chat-tab.component';
import QueueTab from './queue-tab.component';
import SearchTab from './search-tab.component';
import { Box } from "../../../models/box.model";
import SocketContext from './../box.context';

export type Panel = 'chat' | 'queue' | 'users' | 'search'

const PanelComponent = props => {

    let activePanel: Panel = 'chat';
    const KVO: number = 100;

    function DisplayTab(props) {
        const selectedPanel = props.activePanel

        switch (selectedPanel) {
            case 'chat':
                return (
                    <SocketContext.Consumer>
                        {socket => <ChatTab socket={socket}></ChatTab>}
                    </SocketContext.Consumer>
                )

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
            <SocketContext.Consumer>
                {socket => <ChatTab style={{display: 'flex'}} socket={socket}></ChatTab>}
            </SocketContext.Consumer>
        </View>
    )
}

const styles = StyleSheet.create({
    iconTabs: {
        height: 35,
    }
})

export default PanelComponent
