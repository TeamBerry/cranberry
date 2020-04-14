import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, FlatList } from "react-native"
import { QueueItem, QueueItemActionRequest } from "@teamberry/muscadine"
import { Box } from "../../../models/box.model"
import QueueVideo from './queue-video.component'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import { RectButton } from 'react-native-gesture-handler'
import { Svg, Polygon, Rect } from 'react-native-svg';
import AsyncStorage from "@react-native-community/async-storage"

import ForceNextIcon from '../../../../assets/icons/force-next-icon.svg'
import TrashIcon from '../../../../assets/icons/trash-icon.svg'
import SkipIcon from '../../../../assets/icons/skip-icon.svg'
import AddToLibraryIcon from '../../../../assets/icons/add-to-library-icon.svg'

export type Props = {
    socket: any,
    box: Box
}

const QueueList = ({ socket, box }: Props) => {
    const [upcomingVideos, setUpcoming] = useState([])
    const [user, setUser] = useState(null)
    const [isAdmin, setAdmin] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            const session = JSON.parse(await AsyncStorage.getItem('BBOX-user'))
            setUser(session)

            setAdmin(session._id === box?.creator._id)
        }
        getUser()
    }, [])

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

    const BoxButtons = (item: QueueItem) => {
        if (!isAdmin) {
            return (<></>)
        }

        if (item.startTime !== null) {
            return (
                <View style={styles.buttonContainer}>
                    <RectButton
                        style={[styles.action, styles.rightAction]}
                        onPress={() => skipVideo(item)}
                    >
                        <SkipIcon width={20} height={20} fill={"#FFF"} />
                    </RectButton>
                </View>
            )
        }

        return (
            <>
                <View style={styles.buttonContainer}>
                    <RectButton
                        style={[styles.action, styles.dangerAction, { marginRight: 15 }]}
                        onPress={() => deleteVideo(item)}
                    >
                        <TrashIcon width={20} height={20} fill={"#FFF"} />
                    </RectButton>
                    <RectButton
                        style={[styles.action, styles.rightAction]}
                        onPress={() => forceNext(item)}
                    >
                        <ForceNextIcon width={20} height={20} fill={"#FFF"} />
                    </RectButton>
                </View>
            </>
        )
    }

    const UserButtons = (item) => {
        return (
            <View style={styles.buttonContainer}>
                <RectButton style={[styles.action, styles.rightAction]}>
                    <AddToLibraryIcon height={20} width={20} fill={"white"} />
                </RectButton>
            </View>
        )
    }

    const actionButtons = (item) => {
        return (
            <>
                <View style={styles.rowBack}>
                    <BoxButtons {...item.item} />
                    <UserButtons {...item.item} />
                </View>
            </>
        )
    }

    // Video actions
    const skipVideo = (item) => {
        socket.emit('sync', { order: 'next', boxToken: box._id })
    }

    const deleteVideo = (item) => {
        const actionRequest: QueueItemActionRequest = {
            boxToken: box._id,
            userToken: user._id,
            item: item._id
        }
        socket.emit('cancel', actionRequest)
    }

    const forceNext = (item: QueueItem) => {
        const actionRequest: QueueItemActionRequest = {
            boxToken: box._id,
            userToken: user._id,
            item: item._id
        }
        console.log(actionRequest)
        socket.emit('preselect', actionRequest)
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
            leftOpenValue={isAdmin ? 110 : 0}
            rightOpenValue={-60}
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
    buttonContainer: {
        height: 80,
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 15
    },
    action: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
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