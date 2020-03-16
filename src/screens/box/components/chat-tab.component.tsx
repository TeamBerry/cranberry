import React, { useState, useEffect } from "react"
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet } from "react-native"
import { Message } from '@teamberry/muscadine'

import ChatMessage from './chat-message.component';

const ChatTab = props => {

    const [messages, setMessages] = useState([] as Array<Message>)

    useEffect(() => {
        props.socket.on('chat', (newMessage: Message) => {
            setMessages(messages => [...messages, newMessage])
        })
    }, [])

    return (
        <View>
            <View style={styles.messageList}>
                {messages.map(message => {
                    return (
                        <Text key={message.time.toString()}>{message.contents}</Text>
                        // <ChatMessage message={message}></ChatMessage>
                    )
                })}
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

const styles = StyleSheet.create({
    messageList: {
        paddingHorizontal: 10
    }
})

export default ChatTab