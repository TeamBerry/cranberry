import React, {useState, useEffect} from "react"
import { View, Text, ActivityIndicator, Image } from "react-native"
import YouTube from 'react-native-youtube'

const Player = props => {

    const [video, setVideo] = useState(null)

    useEffect(() => {
        props.socket.on('sync', (syncPacket) => {
            console.log('GET SYNC PACKET: ', syncPacket)
            setVideo(video => syncPacket.item.video)
        })
    }, [video])

    useEffect(() => {
        console.log('CONNECTING TO SYNC...')
        props.socket.emit('start', {
            boxToken: props.boxToken,
            userToken: 'user-35743736d7sq63f83cx4'
        })
    }, [])

    return (
        <View>
            {video ? (
                // <YouTube
                //     apiKey=''
                //     videoId={video.link}
                // />
                <Image
                        style={{ width: 400, height: 200 }}
                        source={{ uri: `https://i.ytimg.com/vi/${video.link}/hqdefault.jpg` }}
                    />
            ): (
                <ActivityIndicator></ActivityIndicator>
            )}
        </View>
    )
}

export default Player