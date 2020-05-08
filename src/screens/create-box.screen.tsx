import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView, StyleSheet, View, Button, Text, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Switch, Button as IconButton, Snackbar } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import FormTextInput from '../components/form-text-input.component';

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
  modeTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
  },
  modeHelper: {
    color: '#BBBBBB',
  },
});

const CreateBoxScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [isRandom, setRandom] = useState(false);
  const [isLoop, setLoop] = useState(false);
  const [user, setUser] = useState(null);
  const [isCreating, setCreating] = useState(false);
  const [box, setBox] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'));
      setUser(user);
    };

    getSession();
  }, []);

  const createBox = async () => {
    setCreating(true);
    const box = await axios.post('https://araza.berrybox.tv/boxes', {
      creator: user._id,
      name,
      description: null,
      lang: 'en',
      open: true,
      options: {
        random: isRandom,
        loop: isLoop,
      },
    });
    setBox(box.data);
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.titlePage}>New box</Text>
        <TouchableOpacity
          onPress={() => navigation.pop()}
        >
          <IconButton
            icon="close"
            mode="text"
            color="white"
          />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        <View style={styles.form}>
          <FormTextInput
            value={name}
            onChangeText={setName}
            placeholder="Box Name"
            autoCorrect={false}
            returnKeyType="next"
          />
          <View style={styles.modeContainer}>
            <View style={styles.modeSpace}>
              <Text style={styles.modeTitle}>Random</Text>
              <Switch
                value={isRandom}
                onValueChange={setRandom}
                color="#009AEB"
              />
            </View>
            <Text style={styles.modeHelper}>When a video ends, the next one will be picked randomly from the upcoming pool of videos.</Text>
          </View>
          <View style={styles.modeContainer}>
            <View style={styles.modeSpace}>
              <Text style={styles.modeTitle}>Loop</Text>
              <Switch
                value={isLoop}
                onValueChange={setLoop}
                color="#009AEB"
              />
            </View>
            <Text style={styles.modeHelper}>The system will automatically requeue old videos.</Text>
          </View>
          {!isCreating ? (
            <Button
              title="Create Box"
              onPress={() => createBox()}
            />
          ) : (
            <ActivityIndicator />
          )}
          <Snackbar
            visible={box}
            onDismiss={() => navigation.navigate('Box', { boxToken: box._id })}
            duration={2000}
            style={{
              backgroundColor: '#090909',
              borderLeftColor: '#0CEBC0',
              borderLeftWidth: 10,

            }}
          >
            You created a box! Redirecting...
          </Snackbar>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default CreateBoxScreen;
