import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, RefreshControl,
} from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import SideMenu from 'react-native-side-menu';
import AsyncStorage from '@react-native-community/async-storage';
import { FAB } from 'react-native-paper';
import axios from 'axios';
import Config from 'react-native-config';

import CustomMenu from '../components/custom-menu.component';
import BoxCard from '../components/box-card.component';
import ProfilePicture from '../components/profile-picture.component';
import BxLoadingIndicator from '../components/bx-loading-indicator.component';

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    backgroundColor: '#262626',
    borderColor: '#191919',
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },
  headerStyle: {
    height: 30,
    elevation: 0,
    shadowOpacity: 0,
  },
  userImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#262626',
  },
  titlePage: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 30,
    marginTop: '1%',
    marginBottom: 10,
    color: 'white',
    paddingLeft: 10,
  },
  card: {
    borderBottomWidth: 1,
    borderColor: '#404040',
    borderStyle: 'solid',
    paddingVertical: 10,
  },
  fab: {
    position: 'absolute',
    marginRight: 16,
    marginBottom: 30,
    right: 0,
    bottom: 0,
    backgroundColor: '#009AEB',
  },
});

const HomeScreen = ({ navigation }) => {
  const [error, setError] = useState(null);
  const [hasLoadedBoxes, setBoxLoading] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [boxes, setBoxes] = useState([]);

  const getBoxes = async () => {
    try {
      setBoxLoading(false);
      setError(null);
      const boxesResults = await axios.get(`${Config.API_URL}/boxes`);
      setBoxes(boxesResults.data);
      setBoxLoading(true);
    } catch (error) {
      setError(error.message);
      setBoxLoading(true);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));
      setUser(user);
      getBoxes();
    };

    bootstrap();
  }, []);

  const onRefresh = () => {
    setBoxes([]);
    getBoxes();
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <SideMenu
      menu={<CustomMenu />}
      isOpen={isMenuOpen}
      bounceBackOnOverdraw={false}
      onChange={(isOpen: boolean) => setMenuOpen(isOpen)}
      autoClosing
    >
      {/* <View style={{height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight, backgroundColor: '#262626'}}>
                <StatusBar barStyle='dark-content' />
            </View> */}

      <View style={styles.headerContainer}>
        <View style={styles.headerStyle}>
          <TouchableOpacity
            onPress={() => toggleMenu()}
          >
            <ProfilePicture userId={user ? user._id : null} size={30} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.titlePage}>Boxes</Text>
        {hasLoadedBoxes ? (
          <FlatList
            data={boxes}
            refreshControl={<RefreshControl refreshing={!hasLoadedBoxes} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                style={styles.card}
                onPress={() => navigation.navigate('Box', { boxToken: item._id })}
              >
                <BoxCard box={item} />
              </TouchableWithoutFeedback>
            )}
            keyExtractor={(item) => item.name}
          />
        ) : (
          <BxLoadingIndicator />
        )}
      </View>

      <FAB
        style={styles.fab}
        color="white"
        icon="plus"
        onPress={() => navigation.push('CreateBox')}
      />
    </SideMenu>
  );
};

export default HomeScreen;
