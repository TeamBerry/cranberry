import React, { useState, useEffect } from 'react';
import {
  Image, View, Text, StyleSheet, TextInput, FlatList, Pressable,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { VideoSubmissionRequest, QueueItem, Permission } from '@teamberry/muscadine';
import { Snackbar } from 'react-native-paper';
import Config from 'react-native-config';

import Box from '../../../models/box.model';
import DurationIndicator from '../../../components/duration-indicator.component';
import BxLoadingIndicator from '../../../components/bx-loading-indicator.component';
import BxButtonComponent from '../../../components/bx-button.component';
import BerryCounter from './berry-counter.component';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#191919',
  },
  searchSpace: {
    paddingHorizontal: 10,
    paddingTop: 10,
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
    flex: 1,
  },
  resultsHelp: {
    color: '#BBBBBB',
    textAlign: 'center',
    padding: 10,
    fontFamily: 'Montserrat-Light',
  },
  resultItem: {
    paddingHorizontal: 7,
    paddingVertical: 10,
    flexDirection: 'column',
  },
  inQueueIndicator: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#0CEBC0',
  },
  inQueueVideo: {
    borderColor: '#0CEBC0',
    borderWidth: 2,
  },
});

export interface Video {
    _id?: string,
    name: string,
    link: string;
    duration?: string;
}

const SearchTab = (props: {socket: any, box: Box, berryCount: number, permissions: Array<Permission>}) => {
  const {
    socket, box, berryCount, permissions,
  } = props;

  const [searchValue, setSearchValue] = useState('');
  const [youtubeSearchResults, setSearchResults] = useState([] as Array<Video>);
  const [user, setUser] = useState(null);
  const [hasSearched, setSearched] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [videosInQueue, setQueueIds] = useState([]);
  const [boxOptions, setBoxOptions] = useState(box.options);

  useEffect(() => {
    const getSession = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));
      setUser(user);
    };

    if (user === null) {
      getSession();
    }

    const videoIds = box.playlist.map((queueItem: QueueItem) => queueItem.video.link);
    setQueueIds(videoIds);

    socket.on('box', (box: Box) => {
      setBoxOptions(box.options);
      const videoIds = box.playlist.map((queueItem: QueueItem) => queueItem.video.link);
      setQueueIds(videoIds);
    });
  }, []);

  const search = async () => {
    setSearching(true);
    setSearched(false);
    setError(false);

    if (searchValue === '') {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    try {
      const youtubeSearchRequest = await axios.get(`${Config.API_URL}/search`, {
        params: { value: searchValue },
      });

      setSearchResults(youtubeSearchRequest.data);
      setSearched(true);
    } catch (error) {
      setError(true);
    }
    setSearching(false);
  };

  const SearchVideo = ({ video, isAlreadyInQueue }) => {
    const addToQueue = async (flag?: VideoSubmissionRequest['flag']) => {
      try {
        await axios.post(`${Config.API_URL}/boxes/${box._id}/queue/video`, {
          link: video.link,
          flag,
        } as Partial<VideoSubmissionRequest>);
      } catch (error) {
        setError(true);
      }
    };

    return (
      <View style={styles.resultItem}>
        <View style={{ flex: 0, flexDirection: 'row' }}>
          <View style={{ paddingRight: 10 }}>
            <Image
              style={[{ width: 140, height: 78.75 }, isAlreadyInQueue ? styles.inQueueVideo : null]}
              source={{ uri: `https://i.ytimg.com/vi/${video.link}/hqdefault.jpg` }}
            />
            <DurationIndicator duration={video.duration} withBorder={isAlreadyInQueue} />
          </View>
          <View style={{
            flex: 1,
            justifyContent: 'center',
          }}
          >
            <Text style={{ color: 'white', fontFamily: 'Monsterrat-Light' }} numberOfLines={3}>
              {isAlreadyInQueue ? (<Text style={styles.inQueueIndicator}>Already in Queue: </Text>) : null}
              {video.name}
            </Text>
          </View>
        </View>
        <View style={{
          display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', padding: 10,
        }}
        >
          {!isAlreadyInQueue ? (
            <>
              {permissions.includes('addVideo') || box.options.berries ? (
                <Pressable onPress={() => { addToQueue(); }}>
                  <BxButtonComponent options={{
                    type: 'play',
                    text: 'Queue',
                    textDisplay: 'full',
                  }}
                  />
                </Pressable>
              ) : null}
            </>
          ) : null}
          <>
            {(permissions.includes('forceNext') && (isAlreadyInQueue || (!isAlreadyInQueue && permissions.includes('addVideo'))))
                || box.options.berries ? (
                  <Pressable onPress={() => { addToQueue('next'); }}>
                    <BxButtonComponent options={{
                      type: 'forceNext',
                      text: permissions.includes('forceNext') ? 'Play Next' : 'Play Next (10 Berries)',
                      textDisplay: 'full',
                      context: permissions.includes('forceNext') ? 'primary' : 'berries',
                    }}
                    />
                  </Pressable>
              ) : null}
            {(permissions.includes('forcePlay') && (isAlreadyInQueue || (!isAlreadyInQueue && permissions.includes('addVideo'))))
                        || box.options.berries ? (
                          <Pressable onPress={() => { addToQueue('now'); }}>
                            <BxButtonComponent options={{
                              type: 'forcePlay',
                              text: permissions.includes('forcePlay') ? 'Play Now' : 'Play Now (50 Berries)',
                              textDisplay: 'full',
                              context: permissions.includes('forcePlay') ? 'primary' : 'berries',
                            }}
                            />
                          </Pressable>
              ) : null}
          </>
        </View>
      </View>
    );
  };

  const SearchList = () => {
    if (isSearching) {
      return <BxLoadingIndicator />;
    }

    if (youtubeSearchResults.length === 0) {
      if (!hasSearched) {
        return null;
      }

      return (
        <Text>No results.</Text>
      );
    }

    return (
      <FlatList
        data={youtubeSearchResults}
        ItemSeparatorComponent={() => <View style={{ backgroundColor: '#3f3f3f', height: 1 }} />}
        renderItem={({ item }) => (
          <SearchVideo video={item} isAlreadyInQueue={videosInQueue.indexOf(item.link) !== -1} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSpace}>
        {user ? (
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TextInput
              style={styles.chatInput}
              placeholder="Search YouTube for videos to add..."
              placeholderTextColor="#BBB"
              onChangeText={(text) => setSearchValue(text)}
              value={searchValue}
              onSubmitEditing={() => search()}
            />
            {boxOptions?.berries && box?.creator?._id !== user?._id ? (
              <BerryCounter count={berryCount} />
            ) : null}
          </View>
        ) : null}
        <View style={{ height: '88%' }}>
          <SearchList />
        </View>
      </View>
      <Snackbar
        visible={isSubmitted}
        duration={1500}
        style={{
          backgroundColor: '#090909',
          borderLeftColor: '#0CEBC0',
          borderLeftWidth: 10,
        }}
        onDismiss={() => setSubmitted(false)}
      >
        Video submitted successfully!
      </Snackbar>
      <Snackbar
        visible={error}
        duration={5000}
        style={{
          backgroundColor: '#090909',
          borderLeftColor: '#B30F4F',
          borderLeftWidth: 10,
        }}
        onDismiss={() => setError(false)}
        action={{
          label: 'retry',
          onPress: () => search(),
        }}
      >
        Something wrong happened. Try again?
      </Snackbar>
    </View>
  );
};

export default SearchTab;
