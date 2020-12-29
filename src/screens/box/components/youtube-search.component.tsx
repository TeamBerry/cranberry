import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, Pressable,
} from 'react-native';
import axios from 'axios';
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
import BackIcon from '../../../../assets/icons/back-icon.svg';
import ErrorIcon from '../../../../assets/icons/error-icon.svg';

export interface Video {
    _id?: string,
    name: string,
    link: string;
    duration?: string;
}

const YoutubeSearch = (props: {
    box: Box,
    berryCount: number,
    permissions: Array<Permission>,
    user: AuthSubject,
    onCancel: () => void,
}) => {
  const {
    box, berryCount, permissions, user, onCancel,
  } = props;

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: colors.backgroundSecondaryColor,
    },
    inputSpace: {
      backgroundColor: colors.backgroundSecondaryAlternateColor,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    resultsSpace: {
      backgroundColor: colors.backgroundAlternateColor,
      height: '88%',
    },
  });

  const _searchInput = useRef(null);
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
    setBoxOptions(box.options);
  }, [box.playlist]);

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

  const resetSearch = () => {
    setSearchValue(null);
    setSearchResults([]);
    _searchInput.current.clear();
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
    <View style={styles.container}>
      <View style={styles.inputSpace}>
        <Pressable onPress={onCancel} style={{ marginRight: 15 }}>
          <BackIcon width={20} height={20} fill={colors.textColor} />
        </Pressable>
        <TextInput
          ref={_searchInput}
          style={{
            flex: 1, height: 40, backgroundColor: 'transparent', color: colors.textColor,
          }}
          placeholder="Search YouTube for videos to add"
          placeholderTextColor={colors.textSystemColor}
          onChangeText={(text) => setSearchValue(text)}
          value={searchValue}
          onSubmitEditing={search}
          autoCorrect={false}
          autoFocus
          underlineColorAndroid="transparent"
        />
        {searchValue && searchValue.length > 0 ? (
          <Pressable onPress={resetSearch}>
            <ErrorIcon width={20} height={20} fill={colors.textColor} />
          </Pressable>
        ) : null}
        {boxOptions?.berries && box?.creator?._id !== user?._id ? (
          <Pressable style={{ flex: 0, justifyContent: 'center' }} onPress={() => showBerriesHelper(!isBerriesHelperShown)}>
            <BerryCounter count={berryCount} />
          </Pressable>
        ) : null}
      </View>
      <Collapsible collapsed={!isBerriesHelperShown}>
        <BerryHelper box={box} permissions={permissions} />
      </Collapsible>
      <View style={styles.resultsSpace}>
        {searchCooldown ? (
          <View style={{ paddingHorizontal: 10 }}>
            <CountdownIndicator time={5000} text="Next search available in a few seconds." />
          </View>
        ) : null}
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

export default YoutubeSearch;
