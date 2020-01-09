import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Box } from "../models/box.model"

const BoxListItem = ({ name }) => {
    return (
        <TouchableOpacity>
            <View>
                <Text>{name}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default BoxListItem