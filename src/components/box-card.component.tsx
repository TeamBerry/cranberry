import React, { useState } from "react"
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native"
import { Box } from "../models/box.model"
import ProfilePicture from "./profile-picture.component"

const displayCurrentvideo = (box: Box) => {
    return box.playlist.find(video => video.startTime !== null && video.endTime === null)
}

const BoxCard = (box: Box) => {
    const currentVideo = displayCurrentvideo(box);

    return (
        <View style={styles.card}>
            <View>
                {currentVideo ? (<Image
                    style={{ width: 107, height: 60 }}
                    source={{ uri: `https://i.ytimg.com/vi/${currentVideo.video.link}/hqdefault.jpg` }}
                />) : (<Image
                    style={{ width: 107, height: 60 }}
                    source={{ uri: 'https://berrybox-user-pictures.s3-eu-west-1.amazonaws.com/profile-pictures/default-picture' }}
                >
                </Image>)
                }
            </View>
            <View style={styles.boxInfo}>
                <Text style={styles.boxTitle} numberOfLines={1}>{box.name}</Text>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <ProfilePicture userId={box.creator._id} size={15}/>
                    <Text style={{color: 'white', paddingLeft: 4}}>{box.creator.name}</Text>
                </View>
                <Text style={styles.boxCurrent} numberOfLines={1}>{currentVideo?.video?.name || 'Nothing'}</Text>
                <View style={styles.boxModes}>
                    {box.options.random ? (
                        <Text style={styles.boxMode}>Random</Text>
                    ) : (<></>)}
                    {box.options.loop ? (
                        <Text style={styles.boxMode}>Loop</Text>
                    ) : (<></>)}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        height: 80,
        width: 230,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10
    },
    boxInfo: {
        marginLeft: 10,
        justifyContent: 'space-around'
    },
    boxTitle: {
        color: 'white',
        fontFamily: 'Montserrat-SemiBold'
    },
    boxCreator: {
        height: 12,
        width: 12,
        borderRadius: 6
    },
    boxCurrent: {
        color: '#e6e6e6',
        fontFamily: 'Montserrat-Regular'
    },
    boxModes: {
        flex: 1,
        flexDirection: 'row'
    },
    boxMode: {
        backgroundColor: '#979797',
        color: 'white',
        borderRadius: 10,
        width: 80,
        height: 15,
        textAlign: 'center',
        marginRight: 3,
        marginLeft: 3,
        fontSize: 10
    }
})

export default BoxCard