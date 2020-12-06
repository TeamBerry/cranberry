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
import { useTheme } from '../shared/theme.context';
import BxActionComponent from '../components/bx-action.component';
import { AuthSubject } from '../models/session.model';
import UnlockIcon from '../../assets/icons/unlock-icon.svg';

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
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
  },
  titlePage: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 30,
    marginTop: '1%',
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
    height: 2,
  },
});

const HomeScreen = ({ navigation }) => {
  const [hasLoadedBoxes, setBoxLoading] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isBoxMenuOpen, setBoxMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthSubject>(null);
  const [boxes, setBoxes] = useState<Array<Box>>([]);
  const [featuredBoxes, setFeaturedBoxes] = useState<Array<Box>>([]);
  const _boxListRef = useRef(null);
  const { colors } = useTheme();

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
      setUser(JSON.parse(await AsyncStorage.getItem('BBOX-user')));
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
    setFeaturedBoxes([]);
    getBoxes();
  };

  return (
    <>
      <SideMenu
        menu={<CustomMenu user={user} />}
        isOpen={isMenuOpen}
        bounceBackOnOverdraw={false}
        onChange={(isOpen: boolean) => setMenuOpen(isOpen)}
        autoClosing
      >
        {/* <View style={{height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight, backgroundColor: '#262626'}}>
                <StatusBar barStyle='dark-content' />
            </View> */}

        <View style={[styles.headerContainer,
          { backgroundColor: colors.background, borderColor: colors.backgroundSecondaryAlternateColor }]}
        >
          <View style={styles.headerStyle}>
            <Pressable
              onPress={() => setMenuOpen(!isMenuOpen)}
            >
              {user && user.mail ? (
                <ProfilePicture userId={user ? user._id : null} size={30} />
              ) : (
                <UserIcon width={30} height={30} fill={colors.textColor} />
              )}
            </Pressable>
          </View>
        </View>

        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {hasLoadedBoxes ? (
            <>
              {boxes.length === 0 && featuredBoxes.length === 0 ? (
                <View style={{ padding: 40 }}>
                  <Text style={{ color: colors.textColor, textAlign: 'center' }}>
                    An error occurred while loading boxes. Please try again.
                  </Text>
                  <Pressable onPress={() => onRefresh()}>
                    <BxActionComponent options={{ text: 'Retry' }} />
                  </Pressable>
                </View>
              ) : (
                <ScrollView
                  ref={_boxListRef}
                  refreshControl={<RefreshControl refreshing={!hasLoadedBoxes} onRefresh={onRefresh} />}
                >
                  <Text style={[styles.titlePage, { color: colors.textColor }]}>Boxes</Text>
                  <View style={styles.boxesSection}>
                    <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
                      <Text style={{ color: colors.textColor }}>Top Boxes</Text>
                      <Text style={{ color: colors.inactiveColor, fontSize: 11 }}>Featured boxes picked by our staff</Text>
                    </View>
                    <FlatList
                      data={featuredBoxes}
                      renderItem={({ item }) => (
                        <FeaturedBoxCard box={item} onPress={() => navigation.navigate('Box', { boxToken: item._id })} />
                      )}
                      horizontal
                      keyExtractor={(item) => item._id}
                    />
                  </View>
                  <View style={[styles.sectionSeparator, { backgroundColor: colors.backgroundSecondaryAlternateColor }]} />
                  <View style={styles.boxesSection}>
                    <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
                      <Text style={{ color: colors.textColor }}>Communities</Text>
                      <Text style={{ color: colors.inactiveColor, fontSize: 11 }}>
                        Find a box for your needs.
                      </Text>
                      <View style={{
                        display: 'flex', flexDirection: 'row', alignItems: 'center',
                      }}
                      >
                        <UnlockIcon width={10} height={10} fill={colors.inactiveColor} />
                        <Text style={{ color: colors.inactiveColor, fontSize: 11 }}>
                          Private boxes you have access to will appear with this icon.
                        </Text>
                      </View>
                    </View>
                    {boxes.map((box, index) => (
                      <React.Fragment key={box._id.toString()}>
                        <BoxCard
                          box={box}
                          onPress={() => navigation.navigate('Box', { boxToken: box._id })}
                          isUnlocked={box.private && user && box.creator._id !== user._id}
                        />
                        {index < boxes.length - 1 ? (
                          <View style={{ height: 1, backgroundColor: colors.backgroundSecondaryColor }} />
                        ) : null}
                      </React.Fragment>
                    ))}
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
