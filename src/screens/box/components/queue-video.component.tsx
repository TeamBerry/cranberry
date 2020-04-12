import React, { useState, useRef } from "react"
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Animated } from "react-native"
import { SyncPacket, QueueItem } from "@teamberry/muscadine"
import { Box } from "../../../models/box.model"
import Collapsible from 'react-native-collapsible'
import ProfilePicture from '../../../components/profile-picture.component'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'

export type Props = {
    item: QueueItem
}

const QueueVideo = ({ item }: Props) => {
    const _swipeRef = useRef(null)

    const renderLeftActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [0, 40],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })

        return (
            <RectButton
                style={{ backgroundColor: 'red' }}
                onPress={closeSwipe}
            >
                <Text>LOL</Text>
            </RectButton>
        )
    }

    const renderRightActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })

        return (
            <RectButton
                style={{ backgroundColor: 'green' }}
                onPress={closeSwipe}
            >
                <Text>LEL</Text>
            </RectButton>
        )
    }

    const closeSwipe = () => {
        _swipeRef.current.close()
    }

    return (
        <Swipeable
            ref={_swipeRef}
            friction={2}
            leftThreshold={40}
            rightThreshold={80}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
        >
        <View style={styles.queueVideo}>
            <Image
                style={[item.isPreselected ? styles.preselectedVideo : {}, { width: 88.89, height: 60 }]}
                source={{uri: `https://i.ytimg.com/vi/${item.video.link}/hqdefault.jpg`}}
            />
            <View style={{ paddingLeft: 10, width: 240 }}>
                <Text style={styles.queueVideoName} numberOfLines={2}>
                    <Text style={styles.nextVideoIndicator}>{item.isPreselected ? 'NEXT: ' : null}</Text>
                    {item.video.name}
                </Text>
                <View style={{ paddingLeft: 5, flex: 1, flexDirection: 'row' }}>
                    <ProfilePicture userId={item.submitted_by._id} size={20}/>
                    <Text style={{paddingLeft: 5, color: '#BBBBBB'}}>{item.submitted_by.name}</Text>
                </View>
            </View>
            </View>
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    queueVideo: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#191919',
        borderStyle: 'solid',
        flex: 1,
        flexDirection: 'row'
    },
    queueVideoName: {
        fontFamily: 'Montserrat-Regular',
        color: 'white',
    },
    preselectedVideo: {
        borderColor: '#EBBA17',
        borderWidth: 2
    },
    nextVideoIndicator: {
        fontFamily: 'Montserrat-SemiBold',
        color: '#EBBA17'
    }
})

export default QueueVideo