import React, { useState } from "react"
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from "react-native"
import { SyncPacket } from "@teamberry/muscadine"
import { Box } from "../../../models/box.model"
import Collapsible from 'react-native-collapsible'
import ProfilePicture from './../../../components/profile-picture.component'

export type Props = {
    box: Box,
    currentVideo: SyncPacket['item']
}

const Queue = ({ box, currentVideo }: Props) => {

    const [isCollapsed, setCollapse] = useState(true)

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

    const QueueList = () => {
        if (!box) {
            return (<></>)
        }

        const upcomingVideos = box.playlist.filter((item) => {
            return item.startTime === null
        }).reverse()

        if (upcomingVideos.length === 0) {
            return (
                <Text style={{textAlign: 'center', color: '#BBB', marginHorizontal: 20}}>The Queue is empty.</Text>
            )
        }

        return (
            <FlatList
                data={upcomingVideos}
                renderItem={({ item }) => (
                    <View style={styles.upcomingItem}>
                        <Image
                            style={{ width: 88.89, height: 60 }}
                            source={{uri: `https://i.ytimg.com/vi/${item.video.link}/hqdefault.jpg`}}
                        />
                        <View style={{ paddingLeft: 10, width: 240 }}>
                            <Text style={styles.upcomingItemName} numberOfLines={2}>{item.video.name}</Text>
                            <View style={{ paddingLeft: 5, flex: 1, flexDirection: 'row' }}>
                                <ProfilePicture userId={item.submitted_by._id} size={20}/>
                                <Text style={{paddingLeft: 5, color: '#BBBBBB'}}>{item.submitted_by.name}</Text>
                            </View>
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        )
    }

    return (
        <>
            <View style={styles.currentSpaceContainer}>
                <View style={styles.currentSpace}>
                    <View style={styles.currentSpaceTexts}>
                        <BoxName />
                        <CurrentVideo />
                    </View>
                    <TouchableOpacity
                        onPress={() => setCollapse(!isCollapsed)}
                        style={styles.currentSpaceActions}
                    >
                        <Text>V</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.upcomingSpaceContainer}>
                <Collapsible collapsed={isCollapsed} style={{height: 445}}>
                    <QueueList />
                </Collapsible>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    currentSpaceContainer: {
        height: 50,
        backgroundColor: '#404040',
        color: 'white',
        paddingLeft: 10,
        paddingTop: 5
    },
    currentSpace: {
        flex: 1,
        flexDirection: 'row',
    },
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
    upcomingSpaceContainer: {
        backgroundColor: '#404040',
    },
    upcomingItem: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#262626',
        borderStyle: 'solid',
        flex: 1,
        flexDirection: 'row'
    },
    upcomingItemName: {
        fontFamily: 'Montserrat-Regular',
        color: 'white',
    }
})

export default Queue