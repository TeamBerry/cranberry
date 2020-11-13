import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, FlatList, RefreshControl, BackHandler, Pressable, Modal, ScrollView,
} from 'react-native';
import SideMenu from 'react-native-side-menu-updated';
import AsyncStorage from '@react-native-community/async-storage';
import { FAB } from 'react-native-paper';
import axios from 'axios';
import Config from 'react-native-config';

import CustomMenu from '../components/custom-menu.component';
import BoxCard from '../components/box-card.component';
import ProfilePicture from '../components/profile-picture.component';
import BxLoadingIndicator from '../components/bx-loading-indicator.component';
import UserIcon from '../../assets/icons/user-icon.svg';
import Box from '../models/box.model';
import FeaturedBoxCard from '../components/featured-box-card.component';

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
    color: 'white',
    paddingLeft: 10,
  },
  fab: {
    position: 'absolute',
    marginRight: 16,
    marginBottom: 30,
    right: 0,
    bottom: 0,
    backgroundColor: '#009AEB',
  },
  boxOption: {
    height: 80,
    backgroundColor: '#009AEB',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 10,
    flex: 0,
    justifyContent: 'space-around',
  },
  boxOptionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
  },
  boxOptionHelp: {
    color: '#FFFFFF',
  },
  boxesSection: {
    marginVertical: 5,
  },
  sectionSeparator: {
    backgroundColor: '#404040',
    height: 2,
  },
});

const HomeScreen = ({ navigation }) => {
  const [hasLoadedBoxes, setBoxLoading] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isBoxMenuOpen, setBoxMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [boxes, setBoxes] = useState([] as Array<Box>);
  const [featuredBoxes, setFeaturedBoxes] = useState([] as Array<Box>);
  const _boxListRef = useRef(null);

  const getBoxes = async () => {
    try {
      setBoxLoading(false);
      const boxesResults = await axios.get(`${Config.API_URL}/boxes`);

      setFeaturedBoxes(boxesResults.data.filter((box: Box) => box.featured));
      setBoxes(boxesResults.data.filter((box: Box) => !box.featured));
      setBoxLoading(true);
    } catch (error) {
      setBoxLoading(true);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      getBoxes();
      const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));
      setUser(user);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isBoxMenuOpen) {
        setBoxMenuOpen(false);
        return true;
      }

      if (isMenuOpen) {
        setMenuOpen(false);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isMenuOpen]);

  const onRefresh = () => {
    setBoxes([]);
    getBoxes();
  };

  const scrollToTop = () => {
    if (_boxListRef && _boxListRef.current) {
      _boxListRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  return (
    <>
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
            <Pressable
              onPress={() => setMenuOpen(!isMenuOpen)}
            >
              {user && user.mail ? (
                <ProfilePicture userId={user ? user._id : null} size={30} />
              ) : (
                <UserIcon width={30} height={30} fill="white" />
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.container}>
          <Pressable onPress={() => scrollToTop()}>
            <Text style={styles.titlePage}>Boxes</Text>
          </Pressable>
          {hasLoadedBoxes ? (
            <>
              {boxes.length === 0 && featuredBoxes.length === 0 ? (
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  An error occurred while loading boxes. Please try again.
                </Text>
              ) : (
                <ScrollView
                  ref={_boxListRef}
                  refreshControl={<RefreshControl refreshing={!hasLoadedBoxes} onRefresh={onRefresh} />}
                >
                  <View style={styles.boxesSection}>
                    <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
                      <Text style={{ color: 'white' }}>Top Boxes</Text>
                      <Text style={{ color: '#CCCCCC', fontSize: 11 }}>Featured boxes picked by our staff</Text>
                    </View>
                    <FlatList
                      data={featuredBoxes}
                      renderItem={({ item }) => (
                        <FeaturedBoxCard box={item} onPress={() => navigation.navigate('Box', { boxToken: item._id })} />
                      )}
                      horizontal
                      keyExtractor={(item) => item.name}
                    />
                  </View>
                  <View style={styles.sectionSeparator} />
                  <View style={styles.boxesSection}>
                    <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
                      <Text style={{ color: 'white' }}>Communities</Text>
                      <Text style={{ color: '#CCCCCC', fontSize: 11 }}>Find a box for your needs</Text>
                    </View>
                    <FlatList
                      data={boxes}
                      renderItem={({ item }) => (
                        <BoxCard box={item} onPress={() => navigation.navigate('Box', { boxToken: item._id })} />
                      )}
                      ItemSeparatorComponent={() => <View style={{ backgroundColor: '#404040', height: 1 }} />}
                      keyExtractor={(item) => item.name}
                    />
                  </View>
                </ScrollView>
              )}
            </>
          ) : (
            <BxLoadingIndicator />
          )}
        </View>

        <FAB
          style={styles.fab}
          color="white"
          icon="plus"
          onPress={() => setBoxMenuOpen(!isBoxMenuOpen)}
        />
      </SideMenu>
      <View>
        <Modal
          animationType="slide"
          transparent
          visible={isBoxMenuOpen}
          onRequestClose={() => {
            setBoxMenuOpen(false);
          }}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <Pressable onPress={() => setBoxMenuOpen(false)}>
              <View style={{ width: '100%', height: '100%' }} />
            </Pressable>
            {user && user.mail ? (
              <Pressable onPress={() => { setBoxMenuOpen(false); navigation.push('CreateBox'); }}>
                <View style={styles.boxOption}>
                  <Text style={styles.boxOptionTitle}>Create a Box</Text>
                  <Text style={styles.boxOptionHelp}>Invite your friends and let the music play!</Text>
                </View>
              </Pressable>
            ) : null}
            <Pressable onPress={() => { setBoxMenuOpen(false); navigation.push('JoinBox'); }}>
              <View style={styles.boxOption}>
                <Text style={styles.boxOptionTitle}>Join a Box</Text>
                <Text style={styles.boxOptionHelp}>Have an invite link? Then come here!</Text>
              </View>
            </Pressable>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default HomeScreen;
