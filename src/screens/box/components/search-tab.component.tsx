import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, Pressable,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { VideoSubmissionRequest, QueueItem, Permission } from '@teamberry/muscadine';
import { Snackbar } from 'react-native-paper';
import Config from 'react-native-config';

import Collapsible from 'react-native-collapsible';
import Box from '../../../models/box.model';
import BxLoadingIndicator from '../../../components/bx-loading-indicator.component';
import BerryCounter from './berry-counter.component';
import BerryHelper from './berry-helper.component';
import CountdownIndicator from '../../../components/countdown-indicator.component';
import { useTheme } from '../../../shared/theme.context';
import SearchVideo from './search-video.component';
import { AuthSubject } from '../../../models/session.model';

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
    flex: 1,
  },
});

export interface Video {
    _id?: string,
    name: string,
    link: string;
    duration?: string;
}

const SearchTab = (props: {
    socket: any,
    box: Box,
    berryCount: number,
    permissions: Array<Permission>,
    user: AuthSubject
}) => {
  const {
    socket, box, berryCount, permissions, user,
  } = props;

  const { colors } = useTheme();

  const [searchValue, setSearchValue] = useState('');
  const [youtubeSearchResults, setSearchResults] = useState<Array<Video>>([]);
  const [isSearching, setSearching] = useState(false);
  const [searchCooldown, setSearchCooldown] = useState(false);
  const [error, setError] = useState(false);
  const [videosInQueue, setQueueIds] = useState([]);
  const [boxOptions, setBoxOptions] = useState(box.options);
  const [isBerriesHelperShown, showBerriesHelper] = useState(false);

  useEffect(() => {
    const videoIds = box.playlist.map((queueItem: QueueItem) => queueItem.video.link);
    setQueueIds(videoIds);

    socket.on('box', (box: Box) => {
      setBoxOptions(box.options);
      const videoIds = box.playlist.map((queueItem: QueueItem) => queueItem.video.link);
      setQueueIds(videoIds);
    });
  }, []);

  const search = async () => {
    if (searchCooldown) {
      return;
    }

    if (searchValue === '') {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      setError(false);
      setSearchCooldown(true);
      const youtubeSearchRequest = await axios.get(`${Config.API_URL}/search`, {
        params: { value: searchValue },
      });

      setSearchResults(youtubeSearchRequest.data);
      setSearching(false);
      setTimeout(() => setSearchCooldown(false), 5000);
    } catch (error) {
      setSearching(false);
      setSearchCooldown(false);
      setError(true);
    }
  };

  const addToQueue = async (video: Video, flag?: VideoSubmissionRequest['flag']) => {
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
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondaryAlternateColor }]}>
      <Collapsible collapsed={!isBerriesHelperShown}>
        <BerryHelper box={box} permissions={permissions} />
      </Collapsible>
      <View style={styles.searchSpace}>
        {user && user.mail ? (
          <>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <TextInput
                style={[styles.chatInput, { backgroundColor: colors.backgroundChatColor, color: colors.textColor }]}
                placeholder="Search YouTube for videos to add..."
                placeholderTextColor={colors.textSystemColor}
                onChangeText={(text) => setSearchValue(text)}
                value={searchValue}
                onSubmitEditing={() => search()}
              />
              {boxOptions?.berries && box?.creator?._id !== user?._id ? (
                <Pressable style={{ flex: 0, justifyContent: 'center' }} onPress={() => showBerriesHelper(!isBerriesHelperShown)}>
                  <BerryCounter count={berryCount} />
                </Pressable>
              ) : null}
            </View>
            {searchCooldown ? (
              <CountdownIndicator time={5000} text="Next search available in a few seconds." />
            ) : null}
            <View style={{ height: '88%' }}>
              {isSearching ? (
                <BxLoadingIndicator />
              ) : (
                <FlatList
                  data={youtubeSearchResults}
                  ItemSeparatorComponent={() => <View style={{ backgroundColor: colors.videoSeparator, height: 1 }} />}
                  ListEmptyComponent={() => <Text style={{ textAlign: 'center', color: colors.inactiveColor }}>No results.</Text>}
                  ListFooterComponent={() => <Text style={{ textAlign: 'center', color: colors.inactiveColor, marginHorizontal: 20 }}>●</Text>}
                  renderItem={({ item }) => (
                    <SearchVideo
                      video={item}
                      isAlreadyInQueue={videosInQueue.indexOf(item.link) !== -1}
                      berriesEnabled={box.options.berries}
                      permissions={permissions}
                      onPress={addToQueue}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </View>
          </>
        ) : (
          <View style={{ display: 'flex', height: 90, justifyContent: 'center' }}>
            <Text style={{ color: colors.textColor, textAlign: 'center' }}>
              Create an account or log in to search for videos
              and add them to the queue.
            </Text>
          </View>
        )}
      </View>
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
        <Text style={{ color: 'white' }}>Something wrong happened. Try again?</Text>
      </Snackbar>
    </View>
  );
};

export default SearchTab;
