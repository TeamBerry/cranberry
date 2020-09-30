import React, { useEffect, useState } from 'react';
import {
  View, Pressable, Text, StyleSheet, BackHandler,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import BackIcon from '../../assets/icons/back-icon.svg';
import BxActionComponent from '../components/bx-action.component';
import BxLoadingIndicator from '../components/bx-loading-indicator.component';
import BrokenLinkIcon from '../../assets/icons/broken-link-icon.svg';

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 15,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ParseLinkScreen = ({ route, navigation }) => {
  const { initialUrl } = route.params;
  const [, setParsingLink] = useState(true);
  const [invalidLinkError, setInvalidLinkError] = useState(false);

  useEffect(() => {
    const parseUrl = async () => {
      if (initialUrl) {
        if (/(box)\/(\w{24})|(i|invite)\/(\w{8})/gmi.test(initialUrl)) {
          try {
            const parseResults = /(box)\/(\w{24})|(i|invite)\/(\w{8})/gmi.exec(initialUrl);

            const scope = parseResults[1] ?? parseResults[3];
            const token = parseResults[2] ?? parseResults[4];

            if (scope === 'i' || scope === 'invite') {
              const matchingBox = await axios.get(`${Config.API_URL}/invites/${token}`);
              navigation.navigate('Box', { boxToken: matchingBox.data.boxToken });
            } else {
              // TODO: Prevent access if the box is private and the user never accessed it
              navigation.navigate('Box', { boxToken: token });
            }
          } catch (error) {
            setInvalidLinkError(true);
          }
        }
      }
      setParsingLink(false);
    };

    parseUrl();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Home');
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
    <>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => navigation.navigate('Home')}
        >
          <BackIcon width={20} height={20} fill="white" />
        </Pressable>
      </View>
      <View style={styles.container}>
        {invalidLinkError ? (
          <>
            <BrokenLinkIcon width={150} height={150} fill="white" />
            <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>The link is invalid or has expired.</Text>
          </>
        ) : (
          <>
            <BxLoadingIndicator />
            <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>Parsing your invite, please wait...</Text>
          </>
        )}
      </View>
      <Pressable
        style={{
          display: 'flex', flex: 0, padding: 20,
        }}
        onPress={() => navigation.navigate('Home')}
      >
        <BxActionComponent options={{ text: 'Cancel' }} />
      </Pressable>
    </>
  );
};

export default ParseLinkScreen;
