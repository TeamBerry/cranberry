import React, { useState } from "react"
import { View, Text, TextInput, FlatList, ActivityIndicator } from "react-native"
import { Message } from './../../../models/message.model'

import ChatMessage from './chat-message.component';

const ChatTab = props => {
    this.props.socket.on('chat', msg => {
        this.setState({ messages: [...msg] })
    })


    return (
        <View>
            <View>
                <FlatList
                    data={this.state.messages}
                    renderItem={({ item, index, separators }) => (
                        // <ChatMessage {...item}></ChatMessage>
                        <Text>Message</Text>
                    )}
                />
            </View>
            <View>
                {/* <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        onChangeText={text => onChangeText(text)}
                        value={value}
                    ></TextInput> */}
            </View>
        </View>
    )
}

export default ChatTab