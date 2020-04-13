import React, { useRef, useEffect } from "react"
import { StyleSheet, Text, View, Image } from "react-native"
import { QueueItem } from "@teamberry/muscadine"
import ProfilePicture from '../../../components/profile-picture.component'
import { SwipeRow } from 'react-native-swipe-list-view'

export type Props = {
    item: QueueItem
}


const QueueVideo = ({ item }: Props) => {
    return (
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
    }
})

export default QueueVideo