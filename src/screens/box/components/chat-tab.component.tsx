import React, { useState, useEffect } from "react"
import { TextInput, StyleSheet, KeyboardAvoidingView, View } from "react-native"
import { Message, FeedbackMessage, SystemMessage } from '@teamberry/muscadine'
import AsyncStorage from '@react-native-community/async-storage';

import ChatMessage from './chat-message.component';
import { ScrollView } from "react-native-gesture-handler";

const ChatTab = (props: {socket: any, boxToken: string}) => {

    const welcomeMessage: FeedbackMessage = {
        contents: 'Welcome to the box!',
        context: 'success',
        source: 'feedback',
        author: null,
        time: new Date(),
        scope: props.boxToken,
    }

    const [messages, setMessages] = useState([welcomeMessage] as Array<Message | FeedbackMessage | SystemMessage>)
    const [messageInput, setMessageInput] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getSession = async () => {
            const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));
            setUser(user);
        }

        getSession();
    }, [])

    useEffect(() => {
        props.socket.on('chat', (newMessage: Message | FeedbackMessage | SystemMessage) => {
            setMessages(messages => [...messages, newMessage])
        })
    }, [])

    const sendMessage = () => {
        const newMessage: Message = new Message({
            author: user._id,
            contents: messageInput,
            source: 'human',
            scope: props.boxToken
        })
        props.socket.emit('chat', newMessage)
        setMessageInput('')
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='padding'>
            <ScrollView style={styles.messageList}>
                {messages.map((message, index) => {
                    return (
                        <ChatMessage key={index} message={message}></ChatMessage>
                    )
                })}
            </ScrollView>
            <View style={{paddingHorizontal: 5}}>
            <TextInput
                style={styles.chatInput}
                placeholder='Type to chat...'
                placeholderTextColor='#BBB'
                onChangeText={(text) => setMessageInput(text)}
                value={messageInput}
                onSubmitEditing={() => sendMessage()}
            ></TextInput>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
        justifyContent: 'space-between'
    },
    messageList: {
        paddingTop: 0,
        height: 352
    },
    chatInput: {
        padding: 10,
        marginBottom: 5,
        height: 40,
        backgroundColor: '#303030',
        borderColor: '#009AEB',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        color: 'white',
    }
})

export default ChatTab