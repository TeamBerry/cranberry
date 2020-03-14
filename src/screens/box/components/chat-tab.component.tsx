import React, { useState, useEffect } from "react"
import { View, Text, TextInput, FlatList, ActivityIndicator } from "react-native"
import { Message } from './../../../models/message.model'

import ChatMessage from './chat-message.component';

const ChatTab = props => {

    const [messages, setMessages] = useState([] as Array<Message>)

    // TODO: Fix this mess (doubling effect on every trigger, wtf)
    useEffect(() => {
        console.log('USE EFFECT')
        props.socket.on('chat', (newMessage: Message) => {
            console.log('Recieved new message: ', newMessage)
            setMessages(messages.concat(newMessage))
        })
    }, [messages])

    return (
        <View>
            <View>
                <FlatList
                    data={messages}
                    renderItem={({ item, index, separators }) => (
                        // <ChatMessage {...item}></ChatMessage>
                        <Text>{item.contents}</Text>
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