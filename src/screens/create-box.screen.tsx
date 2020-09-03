import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView, StyleSheet, View, Button, Text, TouchableOpacity,
} from 'react-native';
import { Switch, IconButton, Snackbar } from 'react-native-paper';
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-community/async-storage';
import Config from 'react-native-config';

import FormTextInput from '../components/form-text-input.component';
import RandomIcon from '../../assets/icons/random-icon.svg';
import ReplayIcon from '../../assets/icons/replay-icon.svg';
import BerriesIcon from '../../assets/icons/coin-enabled-icon.svg';
import LockIcon from '../../assets/icons/lock-icon.svg';
import BxLoadingIndicator from '../components/bx-loading-indicator.component';

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

export type BoxOptions = {
    random: boolean,
    loop: boolean,
    berries: boolean
}

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

  const createBox = async (boxInputData: { name: string, private: boolean, options: BoxOptions}) => {
    setCreating(true);
    const box = await axios.post(`${Config.API_URL}/boxes`, {
      creator: user._id,
      name: boxInputData.name,
      description: null,
      lang: 'en',
      open: true,
      private: boxInputData.private,
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
            name: '', private: false, random: false, loop: false, berries: true,
          }}
          validationSchema={
              yup.object().shape({
                name: yup
                  .string()
                  .required('The box name is required'),
                private: yup
                  .boolean(),
                random: yup
                  .boolean(),
                loop: yup
                  .boolean(),
                berries: yup
                  .boolean(),
              })
            }
          onSubmit={(values) => createBox({
            name: values.name,
            private: values.private,
            options: { random: values.random, loop: values.loop, berries: values.berries },
          })}
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
                  <View style={styles.modeDefinition}>
                    <View style={{ paddingRight: 5 }}>
                      <LockIcon width={20} height={20} fill="white" />
                    </View>
                    <Text style={styles.modeTitle}>Access Restriction</Text>
                  </View>
                  <Switch
                    value={values.private}
                    onValueChange={(value) => setFieldValue('private', value)}
                    color="#009AEB"
                  />
                </View>
                <Text style={styles.modeHelper}>Your box will not appear in the home page. You will only be able to grant access by sharing its link directly.</Text>
              </View>
              <View style={styles.modeContainer}>
                <View style={styles.modeSpace}>
                  <View style={styles.modeDefinition}>
                    <View style={{ paddingRight: 5 }}>
                      <RandomIcon width={20} height={20} fill="white" />
                    </View>
                    <Text style={styles.modeTitle}>Pick Videos at Random</Text>
                  </View>
                  <Switch
                    value={values.random}
                    onValueChange={(value) => setFieldValue('random', value)}
                    color="#009AEB"
                  />
                </View>
                <Text style={styles.modeHelper}>
                  When a video ends, the next one will be picked randomly from the upcoming pool of videos.
                </Text>
              </View>
              <View style={styles.modeContainer}>
                <View style={styles.modeSpace}>
                  <View style={styles.modeDefinition}>
                    <View style={{ paddingRight: 5 }}>
                      <ReplayIcon width={20} height={20} fill="white" />
                    </View>
                    <Text style={styles.modeTitle}>Loop Queue</Text>
                  </View>
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
                  <View style={styles.modeDefinition}>
                    <View style={{ paddingRight: 5 }}>
                      <BerriesIcon width={20} height={20} fill="white" />
                    </View>
                    <Text style={styles.modeTitle}>Berries System</Text>
                  </View>
                  <Switch
                    value={values.berries}
                    onValueChange={(value) => setFieldValue('berries', value)}
                    color="#009AEB"
                  />
                </View>
                <Text style={styles.modeHelper}>
                  Your users will be able to collect Berries while they are in your box. They will then be able to spend
                  the berries to skip a video or select the next video to play.
                </Text>
              </View>
              {!isCreating ? (
                <Button
                  title="Create Box"
                  disabled={!isValid}
                  onPress={() => handleSubmit()}
                />
              ) : (
                <BxLoadingIndicator />
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
