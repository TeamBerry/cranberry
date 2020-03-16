import React, { useState, useEffect } from "react"
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, KeyboardAvoidingView } from "react-native"
import { Message } from '@teamberry/muscadine'

import ChatMessage from './chat-message.component';
import { ScrollView } from "react-native-gesture-handler";

const ChatTab = props => {

    const [messages, setMessages] = useState([] as Array<Message>)

    useEffect(() => {
        props.socket.on('chat', (newMessage: Message) => {
            setMessages(messages => [...messages, newMessage])
        })
    }, [])

    const sendMessage = contents => {
        const newMessage: Message = new Message({
            author: '5dcd89d6fc9a6c5b3758a0ae',
            contents,
            source: 'user',
            scope: props.boxToken
        })
        props.socket.emit('chat', newMessage)
    }

    return (
        <KeyboardAvoidingView style={styles.chatTab} enabled>
            <ScrollView style={styles.messageList}>
                {messages.map(message => {
                    return (
                        // <ChatMessage message={message}></ChatMessage>
                        <Text key={message.time.toString()}>{message.contents}</Text>
                    )
                })}
            </ScrollView>
            <View style={styles.chatInputContainer}>
                <TextInput
                    style={styles.chatInput}
                    placeholder='Type to chat...'
                ></TextInput>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    chatTab: {
        backgroundColor: '#E5E5E5',
        paddingBottom: 300,
    },
    messageList: {
        paddingHorizontal: 10,
        height: 340,
    },
    chatInputContainer: {
        padding: 10
    },
    chatInput: {
        padding: 4,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1
    }
})

export default ChatTab