import React, { useEffect, useState } from 'react';
import {
  View, Pressable, Text, StyleSheet, BackHandler,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import BackIcon from '../../assets/icons/back-icon.svg';
import BxActionComponent from '../components/bx-action.component';
import BxLoadingIndicator from '../components/bx-loading-indicator.component';

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
  },
});

const ParseLinkScreen = ({ route, navigation }) => {
  const { initialUrl } = route.params;
  const [, setParsingLink] = useState(true);
  const [invalidLinkError, setInvalidLinkError] = useState(false);

  useEffect(() => {
    const parseUrl = async () => {
      if (initialUrl) {
        console.log('INITIAL URL GOT: ', initialUrl);
        if (/(box|i)\/(\w{24}|\w{8})/gmi.test(initialUrl)) {
          const parseResults = /(box|i)\/(\w{24}|\w{8})/gmi.exec(initialUrl);

          const scope = parseResults[1];
          const token = parseResults[2];

          if (scope === 'i' || scope === 'invite') {
            try {
              const matchingBox = await axios.get(`${Config.API_URL}/invites/${token}`);
              navigation.navigate('Box', { boxToken: matchingBox.data.boxToken });
            } catch (error) {
              setInvalidLinkError(true);
            }
          } else {
            // TODO: Prevent access if the box is private and the user never accessed it
            navigation.navigate('Box', { boxToken: token });
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
          <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>The link is invalid or has expired.</Text>
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
