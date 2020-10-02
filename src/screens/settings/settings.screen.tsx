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
    paddingHorizontal: 15,
  },
  form: {
    flex: 1,
    paddingBottom: 20,
    width: '100%',
  },
  linkHelp: {
    marginVertical: 20,
  },
});

const SettingsSceen = ({ navigation }) => (
  <>
    <View style={styles.headerContainer}>
      <Text style={styles.titlePage}>Settings</Text>
      <Pressable
        onPress={() => navigation.pop()}
      >
        <IconButton
          icon="close"
          color="white"
        />
      </Pressable>
    </View>
    <View>
      <View />
    </View>
  </>
);

export default SettingsSceen;
