import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Box } from "../models/box.model"

const BoxListItem = (box: Box) => {
    return (
        <TouchableOpacity>
            <View>
                <Text>Box name: {box.name}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default BoxListItem