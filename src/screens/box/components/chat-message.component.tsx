import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Message } from "../../../models/message.model"
import { FeedbackMessage } from "@teamberry/muscadine"

const ChatMessage = ({ message }) => {

    const SystemMessage = (message: FeedbackMessage) => {
        console.log(message)
        const type = `${message.feedbackType}Feedback`
        console.log(type)
        console.log()

        return (
            <Text style={[styles.systemMessage, styles[type]]}>{message.contents}</Text>
        )
    }

    const renderAuthor = (message: Message | FeedbackMessage) => {
        if (message.author) {
            const { _id, name } = message.author as { _id: string, name: string };
            return (<Text style={styles.author}>{name}</Text>)
        }
    }


    return (
        <View style={styles.message} >
            {(message.source !== 'system' && message.source !== 'bot') ? (
                <Text style={styles.userMessage}>{renderAuthor(message)} {message.contents}</Text>
            ) : (
                SystemMessage(message)
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    message: {
        paddingVertical: 3,
    },
    author: {
        fontFamily: 'Montserrat-SemiBold',
        color: '#BBBBBB'
    },
    systemMessage: {
        fontStyle: 'italic',
        color: '#BBBBBB',
        borderLeftWidth: 5,
        borderStyle: 'solid',
        paddingLeft: 9
    },
    successFeedback: {
        borderLeftColor: '#62d77c',
    },
    infoFeedback: {
        borderLeftColor: '#009AEB',
    },
    errorFeedback: {
        borderLeftColor: '#B30F4F',
    },
    warningFeedback: {
        borderLeftColor: 'yellow'
    },
    userMessage: {
        color: 'white',
        paddingLeft: 4
    }
})

export default ChatMessage