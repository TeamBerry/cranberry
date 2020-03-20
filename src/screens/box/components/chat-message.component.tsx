import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Message } from "../../../models/message.model"

const renderSystemMessage = message => {

}

const renderAuthor = message => {
    if (message.author) {
        return (<Text style={styles.author}>{message.author.name}</Text>)
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
    },
    author: {
        fontWeight: "700",
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