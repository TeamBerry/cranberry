import React, {useState, useEffect} from "react"
import { View, Text, ActivityIndicator, Image } from "react-native"
import YouTube from 'react-native-youtube'

const Player = props => {

    const [isLoading, setLoading] = useState(true)
    const [video, setVideo] = useState(null)

    useEffect(() => {
        props.socket.on('sync', (syncPacket) => {
            console.log('GET SYNC PACKET: ', syncPacket)
            setVideo(syncPacket.item.video)
        })
        setLoading(false)
    }, [video])

    useEffect(() => {
        console.log('CONNECTING TO SYNC...')
        props.socket.emit('start', {
            boxToken: props.boxToken,
            userToken: '5e715f673640b31cb895238f'
        })
    }, [])

    if (isLoading) {
        return (
            <ActivityIndicator />
        )
    }

    return (
        <View>
            {video ? (
                <YouTube
                    apiKey=''
                    play={true}
                    videoId={video.link}
                    style={{ alignSelf: 'stretch', height: 200 }}
                />
                // <Image
                //     style={{ width: 400, height: 200 }}
                //     source={{ uri: `https://i.ytimg.com/vi/${video.link}/hqdefault.jpg` }}
                // />
            ): (
                <Image
                    style={{ width: 400, height: 200 }}
                    source={require('./../../../../assets/berrybox-logo-master.png')}
                />
            )}
        </View>
    )
}

export default Player