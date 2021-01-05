/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  View, Pressable, Text, StyleSheet,
} from 'react-native';
import axios, { AxiosResponse } from 'axios';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import Config from 'react-native-config';
import BxActionComponent from './bx-action.component';
import BxLoadingIndicator from './bx-loading-indicator.component';
import FormTextInput from './form-text-input.component';
import { useTheme } from '../shared/theme.context';
import Box from '../models/box.model';

import RandomIcon from '../../assets/icons/random-icon.svg';
import ReplayIcon from '../../assets/icons/replay-icon.svg';
import BerriesIcon from '../../assets/icons/coin-enabled-icon.svg';
import LockIcon from '../../assets/icons/lock-icon.svg';
import DurationRestrictionIcon from '../../assets/icons/duration-limit-icon.svg';
import { AuthSubject } from '../models/session.model';
import { BoxOptions } from '../screens/create-box.screen';

type BoxFormProps = {
    box?: Box, user: AuthSubject, onSuccess: (updatedBox: Box) => void, onError: (error) => void
}

const BoxForm = ({
  box = {
    _id: null,
    description: '',
    options: {
      random: false,
      loop: false,
      berries: true,
      videoMaxDurationLimit: 0,
    },
    creator: null,
    lang: 'en',
    open: true,
    name: '',
    private: false,
  }, user, onSuccess, onError,
}: BoxFormProps) => {
  const { colors } = useTheme();
  const [isUpserting, setUpserting] = useState(false);

  const styles = StyleSheet.create({
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

  const upsertBox = async (boxInputData: { name: string, private: boolean, options: BoxOptions}) => {
    setUpserting(true);
    try {
      let updatedBox: AxiosResponse<Box>;
      if (box._id) {
        updatedBox = await axios.put(`${Config.API_URL}/boxes/${box._id}`, {
          _id: box._id, ...boxInputData, acl: box.acl, description: box.description, lang: box.lang,
        });
      } else {
        updatedBox = await axios.post(`${Config.API_URL}/boxes`, {
          creator: user._id, ...boxInputData, description: null, lang: 'en', open: true,
        });
      }
      setUpserting(false);
      onSuccess(updatedBox.data);
    } catch (error) {
      setUpserting(false);
      onError(error);
    }
  };

  return (
    <ScrollView>
      <Formik
        initialValues={{
          name: box.name ?? '',
          private: box.private ?? false,
          random: box.options.random ?? false,
          loop: box.options.loop ?? false,
          berries: box.options.berries ?? true,
          videoMaxDurationLimit: box.options.videoMaxDurationLimit.toString() ?? '0',
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
                  .integer()
                  .min(0, 'The duration cannot be negative.')
                  .typeError('You must specify a number.')
                  .default(0),
              })
            }
        onSubmit={(values) => upsertBox({
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
                autoFocus
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
                Your box will not appear publicly. You may grant access by sharing invite links.
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
            {!isUpserting ? (
              <Pressable onPress={() => handleSubmit()} disabled={!isValid}>
                <BxActionComponent options={{ text: box._id ? 'Save Modifications' : 'Create Box' }} />
              </Pressable>
            ) : (
              <BxLoadingIndicator />
            )}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default BoxForm;
