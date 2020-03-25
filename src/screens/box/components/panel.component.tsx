import React from "react"
import { Text, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView } from "react-native"

import ChatTab from './chat-tab.component';
import SocketContext from './../box.context';

export type Panel = 'chat' | 'queue' | 'users' | 'search'

const PanelComponent = props => {
    let activePanel: Panel = 'chat';

    return (
        <View style={{display: 'flex'}}>
            <SocketContext.Consumer>
                {socket => <ChatTab boxToken={props.boxToken} socket={socket}></ChatTab>}
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
