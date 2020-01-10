import React from "react"
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native"
import { Box } from "../models/box.model"

const BoxCard = (box: Box) => {
    return (
        <TouchableOpacity>
            <View style={styles.card}>
                <View>
                    <Image
                        style={{ width: 100, height: 100 }}
                        source={{ uri: 'https://i.ytimg.com/vi/0he85BszwL8/hqdefault.jpg' }}
                    />
                </View>
                <View style={styles.boxInfo}>
                    <Text style={styles.boxTitle}>{box.name}</Text>
                    <Text>Currently Playing</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        height: 100,
        flex: 1,
        flexDirection: 'row'
    },
    boxInfo: {
        marginLeft: 5
    },
    boxTitle: {
        fontSize: 20,
        color: '#009AEB'
    }
})

export default BoxCard