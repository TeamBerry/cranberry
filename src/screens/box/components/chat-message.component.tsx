import React from "react"
import { View, Text } from "react-native"
import { Message } from "../../../models/message.model"

const ChatMessage = (message: Message) => {
    return (
        <View>
            <Text>{message}</Text>
        </View>
    )
}

export default ChatMessage