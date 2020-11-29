import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView, StyleSheet, View, Text, TouchableOpacity, Pressable, ScrollView, BackHandler,
} from 'react-native';
import { Switch, IconButton, Snackbar } from 'react-native-paper';
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import Config from 'react-native-config';

import FormTextInput from '../components/form-text-input.component';
import RandomIcon from '../../assets/icons/random-icon.svg';
import ReplayIcon from '../../assets/icons/replay-icon.svg';
import BerriesIcon from '../../assets/icons/coin-enabled-icon.svg';
import LockIcon from '../../assets/icons/lock-icon.svg';
import DurationRestrictionIcon from '../../assets/icons/duration-limit-icon.svg';
import BxLoadingIndicator from '../components/bx-loading-indicator.component';
import BxActionComponent from '../components/bx-action.component';
import { useTheme } from '../shared/theme.context';
import Box from '../models/box.model';

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 15,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titlePage: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 30,
    marginTop: '1%',
    marginBottom: 10,
    paddingLeft: 10,
  },
  container: {
    flex: 1,
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

const EditBoxScreen = ({ route, navigation }) => {
  const { boxToken } = route.params;
  const [isUpdating, setUpdating] = useState(false);
  const [isUpdated, setUpdated] = useState(false);
  const [box, setBox] = useState<Box>();
  const { colors } = useTheme();

  useEffect(() => {
    const bootstrap = async () => {
      const box = await axios.get(`${Config.API_URL}/boxes/${boxToken}`);
      setBox(box.data);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.pop();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const updateBox = async (boxInputData: { name: string, private: boolean, options: BoxOptions}) => {
    setUpdating(true);
    try {
      const box = await axios.put(`${Config.API_URL}/boxes/${boxToken}`, boxInputData);
      setUpdated(true);
      setUpdating(false);
      setBox(box.data);
    } catch (error) {
      console.error('ERROR: ', error);
      setUpdating(false);
    }
  };

  if (!box) {
    return <BxLoadingIndicator />;
  }

  return (
    <>
      <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.titlePage, { color: colors.textColor }]}>Update your box</Text>
        <TouchableOpacity
          onPress={() => navigation.pop()}
        >
          <IconButton
            icon="close"
            color={colors.textColor}
          />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior="height"
      >
        <ScrollView>
          <Formik
            initialValues={{
              name: box.name,
              private: box.private,
              random: box.options.random,
              loop: box.options.loop,
              berries: box.options.berries,
              videoMaxDurationLimit: box.options.videoMaxDurationLimit.toString(),
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
            onSubmit={(values) => updateBox({
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
                <Text style={styles.sectionTitle}>Information</Text>
                <View style={styles.modeContainer}>
                  <Text style={[styles.modeTitle, { color: colors.textSecondaryColor }]}>Box Name</Text>
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
                        <LockIcon width={20} height={20} fill={colors.textColor} />
                      </View>
                      <Text style={[styles.modeTitle, { color: colors.textSecondaryColor }]}>Access Restriction</Text>
                    </View>
                    <Switch
                      value={values.private}
                      onValueChange={(value) => setFieldValue('private', value)}
                      color="#009AEB"
                    />
                  </View>
                  <Text style={{ color: colors.textSystemColor }}>
                    Your box will not appear publicly. You may grant access by inviting users directly.
                  </Text>
                </View>
                <View style={{
                  borderBottomColor: '#777777',
                  borderBottomWidth: 1,
                }}
                />
                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={styles.modeContainer}>
                  <View style={styles.modeSpace}>
                    <View style={styles.modeDefinition}>
                      <View style={{ paddingRight: 5 }}>
                        <RandomIcon width={20} height={20} fill={colors.textColor} />
                      </View>
                      <Text style={[styles.modeTitle, { color: colors.textSecondaryColor }]}>Pick Videos at Random</Text>
                    </View>
                    <Switch
                      value={values.random}
                      onValueChange={(value) => setFieldValue('random', value)}
                      color="#009AEB"
                    />
                  </View>
                  <Text style={{ color: colors.textSystemColor }}>
                    Videos will be played randomly from the queue.
                  </Text>
                </View>
                <View style={styles.modeContainer}>
                  <View style={styles.modeSpace}>
                    <View style={styles.modeDefinition}>
                      <View style={{ paddingRight: 5 }}>
                        <ReplayIcon width={20} height={20} fill={colors.textColor} />
                      </View>
                      <Text style={[styles.modeTitle, { color: colors.textSecondaryColor }]}>Loop Queue</Text>
                    </View>
                    <Switch
                      value={values.loop}
                      onValueChange={(value) => setFieldValue('loop', value)}
                      color="#009AEB"
                    />
                  </View>
                  <Text style={{ color: colors.textSystemColor }}>Played videos will be automatically requeued.</Text>
                </View>
                <View style={styles.modeContainer}>
                  <View style={styles.modeSpace}>
                    <View style={styles.modeDefinition}>
                      <View style={{ paddingRight: 5 }}>
                        <BerriesIcon width={20} height={20} fill={colors.textColor} />
                      </View>
                      <Text style={[styles.modeTitle, { color: colors.textSecondaryColor }]}>Berries System</Text>
                    </View>
                    <Switch
                      value={values.berries}
                      onValueChange={(value) => setFieldValue('berries', value)}
                      color="#009AEB"
                    />
                  </View>
                  <Text style={{ color: colors.textSystemColor }}>
                    Your users will be able to collect Berries while they are in your box. They will then be able to spend
                    the berries to skip a video or select the next video to play.
                  </Text>
                </View>
                <View style={styles.modeContainer}>
                  <View style={styles.modeSpace}>
                    <View style={styles.modeDefinition}>
                      <View style={{ paddingRight: 5 }}>
                        <DurationRestrictionIcon width={20} height={20} fill={colors.textColor} />
                      </View>
                      <Text style={[styles.modeTitle, { color: colors.textSecondaryColor }]}>Duration Restriction</Text>
                    </View>
                  </View>
                  <Text style={{ color: colors.textSystemColor }}>
                    Videos that exceed the set limit (in minutes) will not be accepted into the queue. Specifying 0 or
                    nothing will disable this restriction.
                  </Text>
                  <View style={{ paddingVertical: 5 }}>
                    <FormTextInput
                      value={values.videoMaxDurationLimit}
                      onChangeText={handleChange('videoMaxDurationLimit')}
                      onBlur={() => setFieldTouched('videoMaxDurationLimit')}
                      placeholder="Set the duration restriction (in minutes)"
                      autoCorrect={false}
                      returnKeyType="next"
                      keyboardType="numeric"
                    />
                    {touched.videoMaxDurationLimit && errors.videoMaxDurationLimit && <Text style={{ fontSize: 12, color: '#EB172A' }}>{errors.videoMaxDurationLimit}</Text>}
                  </View>
                </View>
                {!isUpdating ? (
                  <Pressable onPress={() => handleSubmit()} disabled={!isValid}>
                    <BxActionComponent options={{ text: 'Save Modifications' }} />
                  </Pressable>
                ) : (
                  <BxLoadingIndicator />
                )}
                <Snackbar
                  visible={isUpdated}
                  onDismiss={() => setUpdated(false)}
                  duration={2000}
                  style={{
                    backgroundColor: '#090909',
                    borderLeftColor: '#0CEBC0',
                    borderLeftWidth: 10,
                  }}
                >
                  <Text style={{ color: 'white' }}>Your box has been updated.</Text>
                </Snackbar>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default EditBoxScreen;
