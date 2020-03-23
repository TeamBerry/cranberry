import React, { useState, useEffect } from "react"
import { TextInput, StyleSheet, KeyboardAvoidingView } from "react-native"
import { Message, FeedbackMessage } from '@teamberry/muscadine'

import ChatMessage from './chat-message.component';
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatTab = (props: {socket: any, boxToken: string}) => {

    const welcomeMessage: FeedbackMessage = {
        author: null,
        contents: 'Welcome to the box!',
        feedbackType: 'success',
        scope: props.boxToken,
        source: 'system',
        time: new Date()
    }

    const [messages, setMessages] = useState([welcomeMessage] as Array<Message | FeedbackMessage>)
    const [messageInput, setMessageInput] = useState('')

    useEffect(() => {
        props.socket.on('chat', (newMessage: Message | FeedbackMessage) => {
            setMessages(messages => [...messages, newMessage])
        })
    }, [])

    const sendMessage = () => {
        const newMessage: Message = new Message({
            author: '5e715f673640b31cb895238f',
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
        height: '88%',
        flex: 0,
        backgroundColor: '#404040'
    },
    messageList: {
        paddingHorizontal: 5,
        flex: 1,
    },
    chatInput: {
        padding: 10,
        height: 40,
        backgroundColor: '#303030',
        borderColor: '#009AEB',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: "flex-end",
        color: 'white'
    }
})

export default ChatTab