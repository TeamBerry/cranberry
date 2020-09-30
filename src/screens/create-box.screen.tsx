import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView, StyleSheet, View, Text, TouchableOpacity, Pressable, ScrollView,
} from 'react-native';
import { Switch, IconButton, Snackbar } from 'react-native-paper';
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-community/async-storage';
import Config from 'react-native-config';
import { useTranslation } from 'react-i18next';

import FormTextInput from '../components/form-text-input.component';
import RandomIcon from '../../assets/icons/random-icon.svg';
import ReplayIcon from '../../assets/icons/replay-icon.svg';
import BerriesIcon from '../../assets/icons/coin-enabled-icon.svg';
import LockIcon from '../../assets/icons/lock-icon.svg';
import DurationRestrictionIcon from '../../assets/icons/duration-limit-icon.svg';
import BxLoadingIndicator from '../components/bx-loading-indicator.component';
import BxActionComponent from '../components/bx-action.component';

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
    backgroundColor: '#262626',
  },
  form: {
    paddingBottom: 50,
    paddingHorizontal: 15,
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
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#DDDDDD',
  },
  modeHelper: {
    color: '#BBBBBB',
  },
  sectionTitle: {
    fontSize: 20,
    paddingTop: 10,
    fontFamily: 'Montserrat-SemiBold',
    color: '#009AEB',
  },
});

export type BoxOptions = {
    random: boolean,
    loop: boolean,
    berries: boolean,
    videoMaxDurationLimit: number
}

const CreateBoxScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isCreating, setCreating] = useState(false);
  const [box, setBox] = useState(null);
  const { t } = useTranslation();

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
        <Text style={styles.titlePage}>{t('createBox')}</Text>
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
        behavior="height"
      >
        <ScrollView>
          <Formik
            initialValues={{
              name: '', private: false, random: false, loop: false, berries: true, videoMaxDurationLimit: '0',
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
                videoMaxDurationLimit: yup
                  .number()
                  .positive('The duration cannot be negative.')
                  .integer()
                  .typeError('You must specify a number.')
                  .default(0),
              })
            }
            onSubmit={(values) => createBox({
              name: values.name,
              private: values.private,
              options: {
                random: values.random,
                loop: values.loop,
                berries: values.berries,
                videoMaxDurationLimit: parseInt(values.videoMaxDurationLimit, 10),
              },
            })}
          >
            {({
              handleChange, setFieldTouched, setFieldValue, handleSubmit, values, touched, errors, isValid,
            }) => (
              <View style={styles.form}>
                <Text style={styles.sectionTitle}>{t('information')}</Text>
                <View style={styles.modeContainer}>
                  <Text style={styles.modeTitle}>{t('boxName')}</Text>
                  <FormTextInput
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={() => setFieldTouched('name')}
                    placeholder={t('boxName')}
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
                      <Text style={styles.modeTitle}>{t('private')}</Text>
                    </View>
                    <Switch
                      value={values.private}
                      onValueChange={(value) => setFieldValue('private', value)}
                      color="#009AEB"
                    />
                  </View>
                  <Text style={styles.modeHelper}>
                    {t('privateHelp')}
                  </Text>
                </View>
                <View style={{
                  borderBottomColor: '#777777',
                  borderBottomWidth: 1,
                }}
                />
                <Text style={styles.sectionTitle}>{t('settings')}</Text>
                <View style={styles.modeContainer}>
                  <View style={styles.modeSpace}>
                    <View style={styles.modeDefinition}>
                      <View style={{ paddingRight: 5 }}>
                        <RandomIcon width={20} height={20} fill="white" />
                      </View>
                      <Text style={styles.modeTitle}>{t('random')}</Text>
                    </View>
                    <Switch
                      value={values.random}
                      onValueChange={(value) => setFieldValue('random', value)}
                      color="#009AEB"
                    />
                  </View>
                  <Text style={styles.modeHelper}>
                    {t('randomHelp')}
                  </Text>
                </View>
                <View style={styles.modeContainer}>
                  <View style={styles.modeSpace}>
                    <View style={styles.modeDefinition}>
                      <View style={{ paddingRight: 5 }}>
                        <ReplayIcon width={20} height={20} fill="white" />
                      </View>
                      <Text style={styles.modeTitle}>{t('loop')}</Text>
                    </View>
                    <Switch
                      value={values.loop}
                      onValueChange={(value) => setFieldValue('loop', value)}
                      color="#009AEB"
                    />
                  </View>
                  <Text style={styles.modeHelper}>{t('loopHelp')}</Text>
                </View>
                <View style={styles.modeContainer}>
                  <View style={styles.modeSpace}>
                    <View style={styles.modeDefinition}>
                      <View style={{ paddingRight: 5 }}>
                        <BerriesIcon width={20} height={20} fill="white" />
                      </View>
                      <Text style={styles.modeTitle}>{t('berries')}</Text>
                    </View>
                    <Switch
                      value={values.berries}
                      onValueChange={(value) => setFieldValue('berries', value)}
                      color="#009AEB"
                    />
                  </View>
                  <Text style={styles.modeHelper}>
                    {t('berriesHelp')}
                  </Text>
                </View>
                <View style={styles.modeContainer}>
                  <View style={styles.modeSpace}>
                    <View style={styles.modeDefinition}>
                      <View style={{ paddingRight: 5 }}>
                        <DurationRestrictionIcon width={20} height={20} fill="white" />
                      </View>
                      <Text style={styles.modeTitle}>{t('durationRestriction')}</Text>
                    </View>
                  </View>
                  <Text style={styles.modeHelper}>
                    {t('durationRestrictionHelp')}
                  </Text>
                  <View style={{ paddingVertical: 5 }}>
                    <FormTextInput
                      value={values.videoMaxDurationLimit}
                      onChangeText={handleChange('videoMaxDurationLimit')}
                      onBlur={() => setFieldTouched('videoMaxDurationLimit')}
                      placeholder={t('durationRestriction')}
                      autoCorrect={false}
                      returnKeyType="next"
                      keyboardType="numeric"
                    />
                    {touched.videoMaxDurationLimit && errors.videoMaxDurationLimit && <Text style={{ fontSize: 12, color: '#EB172A' }}>{errors.videoMaxDurationLimit}</Text>}
                  </View>
                </View>
                {!isCreating ? (
                  <Pressable onPress={() => handleSubmit()} disabled={!isValid}>
                    <BxActionComponent options={{ text: t('createBox') }} />
                  </Pressable>
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
                  <Text style={{ color: 'white' }}>Your box has been created. Hang tight! We&apos;re redirecting you to it...</Text>
                </Snackbar>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default CreateBoxScreen;
