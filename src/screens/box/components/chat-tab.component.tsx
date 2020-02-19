import React, { useState } from "react"
import { View, Text, TextInput, FlatList, ActivityIndicator } from "react-native"
import { Message } from './../../../models/message.model'

import ChatMessage from './chat-message.component';

const ChatTab = () => {
    const [value, onChangeText] = useState('Enter your message here...')
    const [isConnectedToStream] = useState(false)
    const [messages, setMessages] = useState([])

    const connectToStream = () => {
        setMessages([])
        isConnectedToStream[0] = true
    }

    return (
        <View>
            <View>
                {isConnectedToStream ? (
                    <FlatList
                        data={messages}
                        renderItem={({ item, index, separators }) => (
                            <ChatMessage {...item}></ChatMessage>
                        )}
                    />
                ) : (
                        <ActivityIndicator />
                    )}
            </View>
            <View>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => onChangeText(text)}
                    value={value}
                ></TextInput>
            </View>
        </View>
    )
}

export default ChatTab