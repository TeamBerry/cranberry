import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableWithoutFeedback, ScrollView } from "react-native"
import { QueueItem, QueueItemActionRequest } from "@teamberry/muscadine"
import { Box } from "../../../models/box.model"
import QueueVideo from './queue-video.component'
import { SwipeListView } from 'react-native-swipe-list-view'
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from "@react-native-community/async-storage"
import { useBackHandler } from '@react-native-community/hooks'
import axios from "axios"

import ForceNextIcon from '../../../../assets/icons/force-next-icon.svg'
import TrashIcon from '../../../../assets/icons/trash-icon.svg'
import SkipIcon from '../../../../assets/icons/skip-icon.svg'
import AddToLibraryIcon from '../../../../assets/icons/add-to-library-icon.svg'
import CloseIcon from '../../../../assets/icons/error-icon.svg'

export type Props = {
    socket: any,
    box: Box
}

const QueueList = ({ socket, box }: Props) => {
    const [upcomingVideos, setUpcoming] = useState([])
    const [user, setUser] = useState(null)
    const [isAdmin, setAdmin] = useState(false)
    const [selectedVideo, selectVideo] = useState(null)
    const [isSelectorShown, showPlaylistSelector] = useState(false)
    const [userPlaylists, setUserPlaylists] = useState([])

    useBackHandler(() => {
        if (selectedVideo) {
            selectVideo(null)
            return true
        }

        return false
    })

    useEffect(() => {
        const getUser = async () => {
            const session = JSON.parse(await AsyncStorage.getItem('BBOX-user'))
            setUser(session)

            setAdmin(session._id === box?.creator._id)

            const playlistsRequest = await axios.get(`https://araza.berrybox.tv/users/${session._id}/playlists`)
            const playlists = playlistsRequest.data.map(playlist => {
                return {id: playlist._id, name: playlist.name}
            })
            setUserPlaylists(playlists)
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
            selectVideo(null)
            showPlaylistSelector(false)
        }

        buildUpcomingVideos()
    }, box?.playlist)

    const SkipButton = (video: QueueItem) => {
        if (video.startTime === null) {
            return (<></>)
        }

        return (
            <RectButton
                style={[styles.action, styles.rightAction, { marginRight: 15 }]}
                onPress={() => skipVideo()}
            >
                <SkipIcon width={20} height={20} fill={"#FFF"} />
            </RectButton>
        )
    }

    const DeleteButton = (video: QueueItem) => {
        if (!isAdmin) {
            return (<></>)
        }

        if (video.startTime !== null) {
            return (<></>)
        }

        return (
            <RectButton
            style={[styles.action, styles.dangerAction, { marginRight: 15 }]}
            onPress={() => { selectVideo(video) }}
        >
            <TrashIcon width={20} height={20} fill={"#FFF"} />
        </RectButton>
        )
    }

    const ForceNextButton = (video: QueueItem) => {
        if (!isAdmin) {
            return (<></>)
        }

        if (video.startTime !== null) {
            return (<></>)
        }

        return (
            <RectButton
            style={[styles.action, styles.rightAction, { marginRight: 15 }]}
            onPress={() => forceNext(video)}
        >
            <ForceNextIcon width={20} height={20} fill={"#FFF"} />
        </RectButton>
        )
    }

    const AddToPlaylistButton = (video: QueueItem) => {
        return (
            <RectButton style={[styles.action, styles.rightAction]}
                onPress={() => { selectVideo(video); showPlaylistSelector(true)}}
            >
                <AddToLibraryIcon height={20} width={20} fill={"white"} />
            </RectButton>
        )
    }

    const ActionButtons = (video: QueueItem) => {
        return (
            <View style={styles.buttonContainer}>
                <SkipButton {...video} />
                <DeleteButton {...video} />
                <ForceNextButton {...video} />
                <AddToPlaylistButton {...video} />
            </View>
        )
    }

    // Video actions
    const skipVideo = () => {
        socket.emit('sync', { order: 'next', boxToken: box._id })
    }

    const deleteVideo = (video: QueueItem) => {
        const actionRequest: QueueItemActionRequest = {
            boxToken: box._id,
            userToken: user._id,
            item: video._id
        }
        socket.emit('cancel', actionRequest)
        selectVideo(null)
    }

    const forceNext = (video: QueueItem) => {
        const actionRequest: QueueItemActionRequest = {
            boxToken: box._id,
            userToken: user._id,
            item: video._id
        }
        socket.emit('preselect', actionRequest)
        selectVideo(null)
    }

    const addVideoToPlaylist = async (playlist) => {
        await axios.post(`https://araza.berrybox.tv/playlists/${playlist.id}/videos`, { videoId: selectedVideo.video._id })

        selectVideo(null)
        showPlaylistSelector(false)
    }

    const PlaylistSelector = () => {
        if (!isSelectorShown) {
            return (<></>)
        }

        return (
            <View style={{padding: 10}}>
                <View style={{ borderColor: '#DDD', borderBottomWidth: 1, marginBottom: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', marginBottom: 10, fontSize: 18 }}>Choose a playlist</Text>
                    <TouchableWithoutFeedback onPress={() => { selectVideo(null); showPlaylistSelector(false) }}>
                        <CloseIcon width={20} height={20} fill={"#555"} />
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView
                    nestedScrollEnabled={true}
                    style={{paddingTop: 10}}
                >
                    {userPlaylists.map((playlist, index) => (
                        <TouchableOpacity
                            style={{height: 40}}
                            onPress={() => addVideoToPlaylist(playlist)}>
                                <Text>{playlist.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        )
    }

    if (!box) {
        return (<></>)
    }

    if (upcomingVideos.length === 0) {
        return (<Text style={{textAlign: 'center', color: '#BBB', marginHorizontal: 20}}>The Queue is empty.</Text>)
    }

    return (
        <>
        <SwipeListView
            data={upcomingVideos}
            renderItem={(item, rowMap) => {
                if (selectedVideo?._id === item.item._id && !isSelectorShown) {
                    return (
                        <TouchableWithoutFeedback
                            onPress={() => deleteVideo(selectedVideo)}
                        >
                            <View style={[styles.rowFront, styles.deletionConfirmation]}>
                                <TrashIcon width={25} height={25} fill={"#FFF"} />
                                <Text style={{ color: 'white', fontFamily: 'Montserrat-SemiBold' }}>Tap to confirm deletion.</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }

                if (selectedVideo?._id === item.item._id && isSelectorShown) {
                    return (
                        <View style={{borderColor: '#AAA', borderWidth: 2}}>
                            <TouchableWithoutFeedback
                                onPress={() => { selectVideo(null); rowMap[item.index].closeRow() }}
                                onLongPress={() => { selectVideo(null); rowMap[item.index].manuallySwipeRow(-160) }}
                            >
                                <View style={styles.rowFront}>
                                    <QueueVideo {...item} />
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={[{height: 100 + (userPlaylists.length * 30), backgroundColor: '#AAA'}]}>
                                <PlaylistSelector />
                            </View>
                        </View>
                    )
                }

                return (
                    <TouchableWithoutFeedback
                        onPress={() => { selectVideo(null); rowMap[item.index].closeRow() }}
                        onLongPress={() => { selectVideo(null); rowMap[item.index].manuallySwipeRow(-160) }}
                    >
                        <View style={styles.rowFront}>
                            <QueueVideo {...item} />
                        </View>
                    </TouchableWithoutFeedback>
                )
            }}
            renderHiddenItem={(rowData, rowMap) => (
                <TouchableWithoutFeedback onPress={() => { rowMap[rowData.index].closeRow() }}>
                    <View style={styles.rowBack}>
                        <ActionButtons {...rowData.item} />
                    </View>
                </TouchableWithoutFeedback>
            )}
            friction={9}
            disableRightSwipe={true}
            rightOpenValue={isAdmin ? -160 : -60}
            stopRightSwipe={isAdmin ? -160 : -60}
            swipeToOpenPercent={20}
            closeOnRowBeginSwipe={true}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item, index) => index.toString()}
        />
    </>
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
        justifyContent: 'flex-end',
    },
    deletionConfirmation: {
        height: 80,
        backgroundColor: '#B30F4F',
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
    }
})

const areEqual = (prevProps, nextProps) => {
    return JSON.stringify(prevProps.box?.playlist) === JSON.stringify(nextProps.box?.playlist)
}

export default React.memo(QueueList, areEqual)