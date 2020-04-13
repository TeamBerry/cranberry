import React, { useRef } from "react"
import { StyleSheet, Text, View, Image } from "react-native"
import { QueueItem } from "@teamberry/muscadine"
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
            inputRange: [0, 80],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })

        return (
            <RectButton
                style={styles.leftAction}
                onPress={closeSwipe}
            >
                <Text>DELETE</Text>
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
                style={styles.rightAction}
                onPress={closeSwipe}
            >
                <Text style={{color: 'white'}}>ADD</Text>
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
            leftThreshold={80}
            rightThreshold={40}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
        >
            <View style={styles.queueVideo}>
                <Image
                    style={[item.isPreselected ? styles.preselectedVideo : {}, { width: 88.89, height: 60 }]}
                    source={{uri: `https://i.ytimg.com/vi/${item.video.link}/default.jpg`}}
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
    },
    leftAction: {
        backgroundColor: '#B30F4F',
        width: 80,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightAction: {
        backgroundColor: '#2D2D2D',
        width: 80,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
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