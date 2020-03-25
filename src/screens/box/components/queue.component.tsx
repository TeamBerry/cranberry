import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { SyncPacket } from "@teamberry/muscadine"

const Queue = ({box, currentVideo}) => {

    const BoxName = () => {
        if (box) {
            return (
                <Text style={styles.boxName}>{box.name}</Text>
                )
        }
        return (<></>)
    }

    const CurrentVideo = () => {
        if (currentVideo) {
            return (
                <Text style={styles.currentVideo} numberOfLines={1}>{currentVideo.video.name}</Text>
            )
        }

        return (<></>)
    }

    return (
        <>
            <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={styles.currentSpaceTexts}>
                    <BoxName />
                    <CurrentVideo />
                </View>
                <View style={styles.currentSpaceActions}>
                    <Text>V</Text>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    currentSpaceTexts: {
        width: '90%',
    },
    currentSpaceActions: {
        width: '10%',
    },
    boxName: {
        color: '#BBBBBB',
        fontFamily: 'Montserrat-Regular'
    },
    currentVideo: {
        color: 'white',
        fontFamily: 'Montserrat-SemiBold',
    },
    queue: {

    }
})

export default Queue