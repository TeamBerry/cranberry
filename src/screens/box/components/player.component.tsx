import React, {useState, useEffect, useRef} from "react"
import { ActivityIndicator, Image, AsyncStorage } from "react-native"
import YouTube from 'react-native-youtube'
import { SyncPacket } from "@teamberry/muscadine";

const Player = props => {
    const _youtubeRef = useRef(null);
    const [isLoading, setLoading] = useState(true)
    const [queueItem, setQueueItem] = useState(null as SyncPacket['item'])
    const [isPlayerReady, setPlayerReadiness] = useState(false)

    useEffect(() => {
        props.socket.on('sync', (syncPacket: SyncPacket) => {
            setQueueItem(syncPacket.item)
        })
        setLoading(false)
    }, [queueItem])

    useEffect(() => {
        const getSession = async () => {
            const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));
            props.socket.emit('start', {
                boxToken: props.boxToken,
                userToken: user._id
            })
        }

        getSession();
    }, [])

    useEffect(() => {
        if (queueItem && isPlayerReady) {
            const exactPosition = Math.floor((Date.now() - Date.parse(queueItem.startTime.toString())) / 1000);
            const position = exactPosition <= 2 ? 0 : exactPosition;

            _youtubeRef.current.seekTo(position);
        }
    }, [queueItem, isPlayerReady])

    if (isLoading) {
        return (
            <ActivityIndicator />
        )
    }

    if (queueItem) {
        return (
            <YouTube
                ref={_youtubeRef}
                apiKey=''
                play={true}
                videoId={queueItem.video.link}
                style={{ alignSelf: 'stretch', height: 200 }}
                onReady={() => setPlayerReadiness(true)}
            />
        )
    }

    return (
        <Image
            style={{ width: 400, height: 200 }}
            source={require('./../../../../assets/berrybox-logo-master.png')}
        />
    )
}

export default Player