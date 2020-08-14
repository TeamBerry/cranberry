import React, { useState, useEffect } from 'react';
import {
  Image, View, Text, StyleSheet, TextInput, FlatList,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { VideoSubmissionRequest, QueueItem } from '@teamberry/muscadine';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Snackbar } from 'react-native-paper';
import Config from 'react-native-config';

import Box from '../../../models/box.model';
import DurationIndicator from '../../../components/duration-indicator.component';
import BxLoadingIndicator from '../../../components/bx-loading-indicator.component';

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
    flex: 1,
    flexDirection: 'row',
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

const SearchTab = (props: {socket: any, box: Box}) => {
  const [searchValue, setSearchValue] = useState('');
  const [youtubeSearchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const [hasSearched, setSearched] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [videosInQueue, setQueueIds] = useState([]);

  const { socket, box } = props;

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
      const youtubeSearchResults = await axios.get(`${Config.API_URL}/search`, {
        params: { value: searchValue },
      });

      setSearchResults(youtubeSearchResults.data);
      setSearched(true);
    } catch (error) {
      setError(true);
    }
    setSearching(false);
  };

  const submit = async (link: string) => {
    const submissionPayload: VideoSubmissionRequest = {
      link,
      userToken: user._id,
      boxToken: box._id,
    };

    socket.emit('video', submissionPayload);
    setSubmitted(true);
  };

  const SearchVideo = ({ video, isAlreadyInQueue }) => (
    <View style={styles.resultItem}>
      <View>
        <Image
          style={[{ width: 140, height: 78.75 }, isAlreadyInQueue ? styles.inQueueVideo : null]}
          source={{ uri: `https://i.ytimg.com/vi/${video.link}/hqdefault.jpg` }}
        />
        <DurationIndicator duration={video.duration} withBorder={isAlreadyInQueue} />
      </View>
      <View style={{
        paddingLeft: 10,
        width: 200,
        display: 'flex',
        justifyContent: 'center',
      }}
      >
        <Text style={{ color: 'white', fontFamily: 'Monsterrat-Light' }} numberOfLines={3}>
          {isAlreadyInQueue ? (<Text style={styles.inQueueIndicator}>Already in Queue: </Text>) : null}
          {video.name}
        </Text>
      </View>
    </View>
  );

  const SearchList = () => {
    if (isSearching) {
      return <BxLoadingIndicator />;
    }

    if (youtubeSearchResults.length === 0) {
      if (!hasSearched) {
        return <></>;
      }

      return (
        <Text>No results.</Text>
      );
    }

    return (
      <FlatList
        data={youtubeSearchResults}
        ItemSeparatorComponent={() => <View style={{ backgroundColor: '#3f3f3f', height: 1 }} />}
        renderItem={(item) => {
          const video = item.item;
          const isAlreadyInQueue = videosInQueue.indexOf(video.link) !== -1;
          if (!isAlreadyInQueue) {
            return (
              <TouchableWithoutFeedback
                onPress={() => submit(video.link)}
              >
                <SearchVideo video={video} isAlreadyInQueue={false} />
              </TouchableWithoutFeedback>
            );
          }
          return (
            <SearchVideo video={video} isAlreadyInQueue />
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSpace}>
        <TextInput
          style={styles.chatInput}
          placeholder="Search YouTube for videos to add..."
          placeholderTextColor="#BBB"
          onChangeText={(text) => setSearchValue(text)}
          value={searchValue}
          onSubmitEditing={() => search()}
        />
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
