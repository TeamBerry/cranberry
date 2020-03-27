import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Message } from "../../../models/message.model"
import { FeedbackMessage } from "@teamberry/muscadine"

const renderSystemMessage = (message: Message | FeedbackMessage) => {

}

const renderAuthor = (message: Message | FeedbackMessage) => {
    if (message.author) {
        const { _id, name } = message.author as { _id: string, name: string };
        return (<Text style={styles.author}>{name}</Text>)
    }
}

const ChatMessage = ({ message }) => (
    <View style={styles.message} >
        {(message.source !== 'system' && message.source !== 'bot') ? (
            <Text style={styles.userMessage}>{renderAuthor(message)} {message.contents}</Text>
        ) : (
            <Text style={styles.systemMessage}>{message.contents}</Text>
        )}
    </View>
)

const styles = StyleSheet.create({
    message: {
        paddingVertical: 3,
        paddingHorizontal: 7
    },
    author: {
        fontFamily: 'Montserrat-SemiBold'
    },
    systemMessage: {
        fontStyle: 'italic',
        color: '#BBBBBB'
    },
    userMessage: {
        color: 'white'
    }
})

export default ChatMessage