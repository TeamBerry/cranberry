import React, { useState, useRef, useEffect, useCallback } from "react"
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Animated } from "react-native"
import { SyncPacket, QueueItem } from "@teamberry/muscadine"
import { Box } from "../../../models/box.model"
import Collapsible from 'react-native-collapsible'
import { Svg, Polygon } from 'react-native-svg';
import QueueVideo from './queue-video.component'

export type Props = {
    box: Box
}

const QueueList = ({ box }: Props) => {
    const [upcomingVideos, setUpcoming] = useState([])

    useEffect(() => {
        const buildUpcomingVideos = () => {
            console.log('BUILDING THIS SHIT')
            if (!box) {
                return
            }

            if (box!.playlist!.length === 0) {
                return
            }

            const upcomingVideos = box.playlist.filter((item) => {
                return item.startTime === null
            }).reverse()

            // Put the preslected video first
            const preselectedVideoIndex = upcomingVideos.findIndex((item: QueueItem) => item.isPreselected)
            if (preselectedVideoIndex !== -1) {
                const preselectedVideo = upcomingVideos[preselectedVideoIndex]
                upcomingVideos.splice(preselectedVideoIndex, 1)
                upcomingVideos.unshift(preselectedVideo)
            }

            setUpcoming(upcomingVideos)
        }

        buildUpcomingVideos()
    }, box?.playlist)

    if (!box) {
        return (<></>)
    }

    if (upcomingVideos.length === 0) {
        return (<Text style={{textAlign: 'center', color: '#BBB', marginHorizontal: 20}}>The Queue is empty.</Text>)
    }

    return (
        <FlatList
            data={upcomingVideos}
            renderItem={({ item }) => (
                <QueueVideo item={item}/>
            )}
            initialNumToRender={6}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item, index) => index.toString()}
        />
    )
}

const styles = StyleSheet.create({
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#191919'
    }
})

export default QueueList