import React, {useState, useEffect} from "react"
import { View, Text, ActivityIndicator } from "react-native"
import YouTube from 'react-native-youtube'

const Player = props => {

    const [video, setVideo] = useState(null)

    useEffect(() => {
        props.socket.on('sync', (syncPacket) => {
            console.log('GET SYNC: ', syncPacket)
            setVideo(video => syncPacket.item.video)
        })
    }, [])

    useEffect(() => {
        console.log('CONNECTING TO SYNC')
        props.socket.emit('start', {
            boxToken: '5e6b9281d5b5b131ce107597',
            userToken: 'user-35743736d7sq63f83cx4'
        })
    }, [])

    return (
        <View>
            {video ? (
                <YouTube
                    apiKey='AIzaSyAkgG3bQFJrdHX0PmpHJ4BFeMdz9h_RZZk'
                    videoId={video.link}
                />
            ): (
                <ActivityIndicator></ActivityIndicator>
            )}
        </View>
    )
}

export default Player