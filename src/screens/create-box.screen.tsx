import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView, StyleSheet, View, Button, Text, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Switch, Button as IconButton, Snackbar } from 'react-native-paper';
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
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

  const createBox = async (boxInputData: { name: string, options: { random: boolean, loop: boolean, berries: boolean}}) => {
    setCreating(true);
    const box = await axios.post('https://araza.berrybox.tv/boxes', {
      creator: user._id,
      name: boxInputData.name,
      description: null,
      lang: 'en',
      open: true,
      options: boxInputData.options,
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
        <Formik
          initialValues={{
            name: '', random: false, loop: false, berries: true,
          }}
          validationSchema={
              yup.object().shape({
                name: yup
                  .string()
                  .required('The box name is required'),
                random: yup
                  .boolean(),
                loop: yup
                  .boolean(),
                berries: yup
                  .boolean(),
              })
            }
          onSubmit={(values) => createBox({ name: values.name, options: { random: values.random, loop: values.loop, berries: values.berries } })}
        >
          {({
            handleChange, setFieldTouched, setFieldValue, handleSubmit, values, touched, errors, isValid,
          }) => (
            <View style={styles.form}>
              <View>
                <FormTextInput
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={() => setFieldTouched('name')}
                  placeholder="Box Name"
                  autoCorrect={false}
                  returnKeyType="next"
                />
                {touched.name && errors.name && <Text style={{ fontSize: 12, color: '#EB172A' }}>{errors.name}</Text>}
              </View>
              <View style={styles.modeContainer}>
                <View style={styles.modeSpace}>
                  <Text style={styles.modeTitle}>Random</Text>
                  <Switch
                    value={values.random}
                    onValueChange={(value) => setFieldValue('random', value)}
                    color="#009AEB"
                  />
                </View>
                <Text style={styles.modeHelper}>When a video ends, the next one will be picked randomly from the upcoming pool of videos.</Text>
              </View>
              <View style={styles.modeContainer}>
                <View style={styles.modeSpace}>
                  <Text style={styles.modeTitle}>Loop</Text>
                  <Switch
                    value={values.loop}
                    onValueChange={(value) => setFieldValue('loop', value)}
                    color="#009AEB"
                  />
                </View>
                <Text style={styles.modeHelper}>The system will automatically requeue old videos.</Text>
              </View>
              <View style={styles.modeContainer}>
                <View style={styles.modeSpace}>
                  <Text style={styles.modeTitle}>Berries</Text>
                  <Switch
                    value={values.berries}
                    onValueChange={(value) => setFieldValue('berries', value)}
                    color="#009AEB"
                  />
                </View>
                <Text style={styles.modeHelper}>Your users will be able to collect Berries while they are in your box. They will then be able to spend the berries to skip a video or select the next video to play.</Text>
              </View>
              {!isCreating ? (
                <Button
                  title="Create Box"
                  disabled={!isValid}
                  onPress={handleSubmit}
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
                Your box has been created. Hang tight! We&apos;re redirecting you to it...
              </Snackbar>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </>
  );
};

export default CreateBoxScreen;
