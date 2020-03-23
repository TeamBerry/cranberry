import React from "react"
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native"
import { Box } from "../models/box.model"

const displayCurrentvideo = (box: Box) => {
    return box.playlist.find(video => video.startTime !== null && video.endTime === null)
}

const BoxCard = (box: Box) => {
    const currentVideo = displayCurrentvideo(box);

    const defaultPicture = 'https://berrybox-user-pictures.s3-eu-west-1.amazonaws.com/profile-pictures/default-picture'

    return (
        <TouchableOpacity>
            <View style={styles.card}>
                <View>
                    {currentVideo ? (<Image
                        style={{ width: 100, height: 100 }}
                        source={{ uri: `https://i.ytimg.com/vi/${currentVideo.video.link}/hqdefault.jpg` }}
                    />) : (<Image
                        style={{ width: 100, height: 100 }}
                        source={{ uri: 'https://berrybox-user-pictures.s3-eu-west-1.amazonaws.com/profile-pictures/default-picture' }}
                    >
                    </Image>)
                    }
                </View>
                <View style={styles.boxInfo}>
                    <Text style={styles.boxTitle} numberOfLines={1}>{box.name}</Text>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Image
                            source={{ uri: `https://berrybox-user-pictures.s3-eu-west-1.amazonaws.com/profile-pictures/${box.creator._id}-picture` }}
                            style={styles.boxCreator}
                        />
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
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        height: 100,
        width: 230,
        flex: 1,
        flexDirection: 'row'
    },
    boxInfo: {
        marginLeft: 10,
        justifyContent: 'space-around'
    },
    boxTitle: {
        fontSize: 20,
        color: '#009AEB',
        fontFamily: 'Montserrat-Regular'
    },
    boxCreator: {
        height: 20,
        width: 20,
        borderRadius: 10
    },
    boxCurrent: {
        color: '#e6e6e6',
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
        height: 20,
        textAlign: 'center',
        marginRight: 3,
        marginLeft: 3
    }
})

export default BoxCard