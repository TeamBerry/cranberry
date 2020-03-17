import React, { useState, useEffect } from "react"
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, KeyboardAvoidingView } from "react-native"
import { Message } from '@teamberry/muscadine'

import ChatMessage from './chat-message.component';
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatTab = props => {

    const [messages, setMessages] = useState([] as Array<Message>)
    const [messageInput, setMessageInput] = useState('')

    useEffect(() => {
        props.socket.on('chat', (newMessage: Message) => {
            setMessages(messages => [...messages, newMessage])
        })
    }, [])

    const sendMessage = () => {
        const newMessage: Message = new Message({
            author: '5dcd89d6fc9a6c5b3758a0ae',
            contents: messageInput,
            source: 'user',
            scope: props.boxToken
        })
        props.socket.emit('chat', newMessage)
        setMessageInput('')
    }

    return (
        <SafeAreaView style={styles.chatTab}>
            <KeyboardAvoidingView style={styles.messageList} behavior="padding" enabled>
                <ScrollView style={styles.messageList}>
                    {messages.map((message, index) => {
                        return (
                            <ChatMessage key={index} message={message}></ChatMessage>
                        )
                    })}
                </ScrollView>
                <TextInput
                    style={styles.chatInput}
                    placeholder='Type to chat...'
                    onChangeText={(text) => setMessageInput(text)}
                    value={messageInput}
                    onSubmitEditing={() => sendMessage()}
                    ></TextInput>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    chatTab: {
        backgroundColor: '#E5E5E5',
        height: '88%',
        flex: 0
    },
    messageList: {
        paddingHorizontal: 5,
        flex: 1,
    },
    chatInput: {
        padding: 4,
        height: 40,
        backgroundColor: '#D8D8D8',
        justifyContent: "flex-end"
    }
})

export default ChatTab