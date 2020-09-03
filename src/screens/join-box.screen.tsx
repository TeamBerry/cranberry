import React from 'react';
import {
  StyleSheet, Text, View, Pressable,
} from 'react-native';
import { IconButton } from 'react-native-paper';

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 15,
    paddingLeft: 10,
    backgroundColor: '#262626',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titlePage: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 30,
    marginTop: '1%',
    marginBottom: 10,
    color: 'white',
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#262626',
    paddingTop: 40,
  },
  form: {
    flex: 1,
    width: 320,
    paddingBottom: 20,
  },
  image: {
    height: 150,
    width: 150,
  },
  modeContainer: {
    marginVertical: 20,
  },
  modeSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeDefinition: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
  },
  modeHelper: {
    color: '#BBBBBB',
  },
});

const JoinBoxScreen = ({ navigation }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.titlePage}>Join a box</Text>
    <Pressable
      onPress={() => navigation.pop()}
    >
      <IconButton
        icon="close"
        color="white"
      />
    </Pressable>
  </View>
);

export default JoinBoxScreen;
