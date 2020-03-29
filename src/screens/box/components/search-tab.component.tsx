import React, { useState, useEffect } from "react"
import { Image, View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator } from "react-native"
import axios from "axios"
import AsyncStorage from '@react-native-community/async-storage';
import { VideoSubmissionRequest } from "@teamberry/muscadine";
import { TouchableOpacity } from "react-native-gesture-handler";

const SearchTab = (props: {socket: any, boxToken: string}) => {
    const [searchValue, setSearchValue] = useState('')
    const [youtubeSearchResults, setSearchResults] = useState([])
    const [user, setUser] = useState(null)
    const [hasSearched, setSearched] = useState(false)
    const [isSearching, setSearching] = useState(false)

    useEffect(() => {
        const getSession = async () => {
            const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));
            setUser(user);
        }

        getSession();
    }, [])


    const search = async () => {
        setSearching(true)
        setSearched(false)

        if (searchValue === '') {
            setSearchResults([])
            setSearching(false)
            return
        }

        const youtubeSearchResults = await axios.get(`https://araza.berrybox.tv/search`, {
            params: { value: searchValue },
        })

        const videos = youtubeSearchResults.data.items.map((responseVideo) => {
            return {
                _id: null,
                name: responseVideo.snippet.title,
                link: responseVideo.id.videoId
            }
        })

        setSearchResults(videos)
        setSearching(false)
        setSearched(true)
    }

    const submit = async (link: string) => {
        const submissionPayload: VideoSubmissionRequest = {
            link,
            userToken: user._id,
            boxToken: props.boxToken
        }

        props.socket.emit('video', submissionPayload)
    }

    const SearchList = () => {
        if (isSearching) {
            return <ActivityIndicator />
        }

        if (youtubeSearchResults.length === 0) {
            if (!hasSearched) {
                return <></>
            }

            return (
                <Text>No results.</Text>
            )
        }

        return (
            <>
            <Text style={styles.resultsHelp}>Tap to submit</Text>
            <FlatList
                data={youtubeSearchResults}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => submit(item.link)}
                        >
                        <View style={styles.resultItem}>
                            <Image
                                style={{ width: 88.89, height: 60 }}
                                source={{ uri: `https://i.ytimg.com/vi/${item.link}/hqdefault.jpg` }}
                            />
                            <View style={{ paddingLeft: 10, width: 200 }}>
                                <Text style={{color: 'white', fontFamily: 'Monsterrat-Light'}} numberOfLines={2}>{item.name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                />
            </>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.tabHeader}>Search YouTube</Text>
            <View style={styles.searchSpace}>
                <TextInput
                    style={styles.chatInput}
                    placeholder='Search for videos to add...'
                    placeholderTextColor='#BBB'
                    onChangeText={(text) => setSearchValue(text)}
                    value={searchValue}
                    onSubmitEditing={() => search()}
                ></TextInput>
                <SearchList />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#191919'
    },
    tabHeader: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Montserrat-SemiBold',
        padding: 20
    },
    searchSpace: {
        paddingHorizontal: 10
    },
    chatInput: {
        padding: 10,
        marginBottom: 5,
        height: 40,
        backgroundColor: '#303030',
        borderColor: '#009AEB',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        color: 'white',
    },
    resultsHelp: {
        color: '#BBBBBB',
        textAlign: 'center',
        padding: 10,
        fontFamily: 'Montserrat-Light'
    },
    resultItem: {
        paddingHorizontal: 7,
        paddingVertical: 10,
        flex: 1,
        flexDirection: 'row'
    }
})

export default SearchTab