import React, { useState, useEffect } from "react"
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet } from "react-native"
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

    return (
        <View>
            <ScrollView style={styles.messageList}>
                {messages.map(message => {
                    return (
                        <ChatMessage message={message}></ChatMessage>
                    )
                })}
            </ScrollView>
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
        paddingHorizontal: 10,
        height: 340,
        backgroundColor: '#E5E5E5',
    }
})

export default ChatTab