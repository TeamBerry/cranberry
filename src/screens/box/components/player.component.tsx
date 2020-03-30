import React, {useState, useEffect, useRef} from "react"
import { ActivityIndicator, Image } from "react-native"
import YouTube from 'react-native-youtube'
import { QueueItem } from "@teamberry/muscadine";

export type PlayerProps = {
    boxKey: string,
    currentItem: QueueItem
}

const Player = (props: PlayerProps) => {
    const _youtubeRef = useRef(null);
    const [isLoading, setLoading] = useState(true)
    const [isPlayerReady, setPlayerReadiness] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [props.currentItem])

    useEffect(() => {
        if (props.currentItem && isPlayerReady) {
            const exactPosition = Math.floor((Date.now() - Date.parse(props.currentItem.startTime.toString())) / 1000);
            const position = exactPosition <= 2 ? 0 : exactPosition;

            _youtubeRef.current.seekTo(position);
        }
    }, [props.currentItem, isPlayerReady])

    if (isLoading) {
        return (
            <ActivityIndicator />
        )
    }

    if (props.currentItem) {
        return (
            <YouTube
                ref={_youtubeRef}
                apiKey={props.boxKey}
                play={true}
                videoId={props.currentItem.video.link}
                style={{ alignSelf: 'stretch', height: 204 }}
                onReady={() => setPlayerReadiness(true)}
                onError={(e) => console.log(e)}
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