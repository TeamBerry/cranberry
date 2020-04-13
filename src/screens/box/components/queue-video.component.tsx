import React, { useRef, useEffect } from "react"
import { StyleSheet, Text, View, Image } from "react-native"
import { QueueItem } from "@teamberry/muscadine"
import ProfilePicture from '../../../components/profile-picture.component'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'
import { Svg, Polygon, Rect } from 'react-native-svg';

export type Props = {
    item: QueueItem
}


const QueueVideo = ({ item }: Props) => {
    const _swipeRef = useRef(null)

    useEffect(() => {
        console.log(`COMPONENT ${item._id} HAS RENDERED.`)
    })

    const renderLeftActions = (progress, dragX) => {
        // const scale = dragX.interpolate({
        //     inputRange: [0, 80],
        //     outputRange: [0, 1],
        //     extrapolate: 'clamp'
        // })

        return (
            <>
            <RectButton
                style={[styles.action, styles.leftAction]}
                onPress={closeSwipe}
            >
                <Text style={{color: 'white'}}>X</Text>
            </RectButton>
            <RectButton
                style={[styles.action, styles.rightAction]}
                onPress={closeSwipe}
            >
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
            </>
        )
    }

    const renderRightActions = (progress, dragX) => {
        // const scale = dragX.interpolate({
        //     inputRange: [-80, 0],
        //     outputRange: [1, 0],
        //     extrapolate: 'clamp'
        // })

        return (
            <RectButton
                style={[styles.action, styles.rightAction]}
                onPress={closeSwipe}
            >
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

    const closeSwipe = () => {
        _swipeRef.current.close()
    }

    return (
        <Swipeable
            ref={_swipeRef}
            friction={3}
            leftThreshold={40}
            rightThreshold={40}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
        >
            <View style={styles.queueVideo}>
                <Image
                    style={[
                        item.isPreselected ? styles.preselectedVideo : {},
                        item.startTime ? styles.currentVideo : {},
                        { width: 88.89, height: 60 }
                    ]}
                    source={{uri: `https://i.ytimg.com/vi/${item.video.link}/default.jpg`}}
                    />
                <View style={{ paddingLeft: 10, width: 240 }}>
                    <Text style={styles.queueVideoName} numberOfLines={2}>
                        <Text style={styles.nextVideoIndicator}>{item.isPreselected ? 'NEXT: ' : null}</Text>
                        <Text style={styles.currentVideoIndicator}>{item.startTime !== null ? 'PLAYING: ' : null}</Text>
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
        flex: 1,
        flexDirection: 'row',
    },
    queueVideoName: {
        fontFamily: 'Montserrat-Regular',
        color: 'white',
    },
    preselectedVideo: {
        borderColor: '#EBBA17',
        borderWidth: 2
    },
    currentVideo: {
        borderColor: '#009AEB',
        borderWidth: 2
    },
    currentVideoIndicator: {
        fontFamily: 'Montserrat-SemiBold',
        color: '#009AEB'
    },
    nextVideoIndicator: {
        fontFamily: 'Montserrat-SemiBold',
        color: '#EBBA17'
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
    leftAction: {
        backgroundColor: '#B30F4F',
    },
    rightAction: {
        backgroundColor: '#AAA',
    },
    actionIcon: {
        width: 30,
        marginHorizontal: 10
    },
})

const areEqual = (prevProps: Props, nextProps: Props) => {
    return prevProps.item.isPreselected === nextProps.item.isPreselected
}

export default React.memo(QueueVideo, areEqual)