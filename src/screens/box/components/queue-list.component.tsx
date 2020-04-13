import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, FlatList } from "react-native"
import { QueueItem } from "@teamberry/muscadine"
import { Box } from "../../../models/box.model"
import QueueVideo from './queue-video.component'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import { RectButton } from 'react-native-gesture-handler'
import { Svg, Polygon, Rect } from 'react-native-svg';

export type Props = {
    box: Box
}

const QueueList = ({ box }: Props) => {
    const [upcomingVideos, setUpcoming] = useState([])

    useEffect(() => {
        const buildUpcomingVideos = () => {
            console.log('BUILDING QUEUE', new Date())
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

            // Put the current video first
            const playingvideo = box.playlist.find((item: QueueItem) => item.startTime !== null && item.endTime === null)
            if (playingvideo) {
                upcomingVideos.unshift(playingvideo)
            }

            setUpcoming(upcomingVideos)
        }

        buildUpcomingVideos()
    }, box?.playlist)

    const BoxButtons = () => {
        return (
            <>
                <View style={{width: 160, backgroundColor: 'red'}}>
            <RectButton style={[styles.action, styles.dangerAction]}>
                <Text style={{color: 'white'}}>X</Text>
            </RectButton>
            <RectButton style={[styles.action, styles.rightAction]} >
            <Svg height="30" width="30" style={{scaleX: 0.7, scaleY: 0.7}}>
                <Polygon
                    points="24,20 9,10 9,30"
                    fill="white"
                    />
                <Polygon
                    points="39,20 24,10 24,30"
                    fill="white"
                />
                    </Svg>
                    </RectButton>
                </View>
            </>
        )
    }

    const UserButtons = () => {
        return (
            <RectButton style={[styles.action, styles.rightAction]}>
                <Svg height="33" width="33" style={{scaleX: 0.8, scaleY: 0.8}}>
                    <Rect x="4" y="8" width="32" height="2" fill="white" />
                    <Rect x="4" y="13.5" width="32" height="2" fill="white" />
                    <Rect x="4" y="19" width="16" height="2" fill="white" />
                    <Rect x="4" y="24.5" width="16" height="2" fill="white" />
                    <Rect x="4" y="30" width="16" height="2" fill="white" />
                    <Rect x="22" y="24.5" width="14" height="2" fill="white" />
                    <Rect x="28" y="19" width="2" height="14" fill="white" />
                </Svg>
            </RectButton>
        )
    }

    const actionButtons = () => {
        return (
            <>
                <View style={styles.rowBack}>
                    <BoxButtons />
                    <UserButtons />
                </View>
            </>
        )
    }

    if (!box) {
        return (<></>)
    }

    if (upcomingVideos.length === 0) {
        return (<Text style={{textAlign: 'center', color: '#BBB', marginHorizontal: 20}}>The Queue is empty.</Text>)
    }

    return (
        <SwipeListView
            useFlatList={true}
            data={upcomingVideos}
            renderItem={({ item }) => (
                <View style={styles.rowFront}>
                    <QueueVideo item={item} />
                </View>
            )}
            renderHiddenItem={actionButtons}
            leftOpenValue={80}
            rightOpenValue={-80}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item, index) => index.toString()}
        />
    )
}

const styles = StyleSheet.create({
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#191919'
    },
    action: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginHorizontal: 5
    },
    dangerAction: {
        backgroundColor: '#B30F4F',
    },
    rightAction: {
        backgroundColor: '#AAA',
    },
    actionIcon: {
        width: 30,
        marginHorizontal: 10
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#262626',
        justifyContent: 'center',
    },
    rowBack: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})

const areEqual = (prevProps, nextProps) => {
    return JSON.stringify(prevProps.box?.playlist) === JSON.stringify(nextProps.box?.playlist)
}

export default React.memo(QueueList, areEqual)