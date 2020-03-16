import React from "react"
import { View, Text } from "react-native"
import { Message } from "../../../models/message.model"

const ChatMessage = ({ message }) => (
    <View>
        <Text>{message.contents}</Text>
    </View>
)

export default ChatMessage