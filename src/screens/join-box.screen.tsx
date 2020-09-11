import React, { useState } from 'react';
import {
  KeyboardAvoidingView, StyleSheet, Text, View, Pressable,
} from 'react-native';
import { IconButton, Snackbar } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Config from 'react-native-config';

import FormTextInput from '../components/form-text-input.component';
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

const JoinBoxScreen = ({ navigation }) => {
  const [isChecking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  const checkBox = async (link: string): Promise<boolean> => {
    setChecking(true);
    const inviteParseResults = /(i|invite)\/(\S{8})/gm.exec(link);

    if (!inviteParseResults) {
      setError('The link is invalid.');
      setChecking(false);
      return false;
    }

    try {
      const matchingBox = await axios.get(`${Config.API_URL}/invites/${inviteParseResults[2]}`);
      navigation.navigate('Box', { boxToken: matchingBox.data.boxToken });
      setChecking(false);
      return true;
    } catch (error) {
      setChecking(false);
      setError('This invite is invalid. It might have expired.');
      return false;
    }
  };

  return (
    <>
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        <Formik
          initialValues={{ link: '' }}
          validationSchema={
                yup.object().shape({
                  link: yup
                    .string()
                    .required('The link is requried'),
                })
            }
          onSubmit={(values) => checkBox(values.link)}
        >
          {({
            handleChange, setFieldTouched, handleSubmit, values, touched, errors, isValid,
          }) => (
            <View style={styles.form}>
              <View>
                <FormTextInput
                  value={values.link}
                  onChangeText={handleChange('link')}
                  onBlur={() => setFieldTouched('link')}
                  placeholder="Invite link"
                  autoCorrect={false}
                  returnKeyType="next"
                  autoFocus
                />
                {touched.link && errors.link && <Text style={{ fontSize: 12, color: '#EB172A' }}>{errors.link}</Text>}
                <View style={styles.linkHelp}>
                  <Text style={{ color: '#BBBBBB', fontFamily: 'Montserrat-SemiBold' }}>Invites look like this: </Text>
                  <Text style={{ color: '#AAAAAA' }}>berrybox.tv/invite/Z0dfeDa4</Text>
                  <Text style={{ color: '#AAAAAA' }}>berrybox.tv/i/Z0dfeDa4</Text>
                </View>
              </View>
              {!isChecking ? (
                <Pressable onPress={() => handleSubmit()} disabled={!isValid}>
                  <BxActionComponent options={{ text: 'Join Box' }} />
                </Pressable>
              ) : (
                <BxLoadingIndicator />
              )}
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
      <Snackbar
        visible={error}
        onDismiss={() => setError(null)}
        duration={2000}
        style={{
          backgroundColor: '#090909',
          borderLeftColor: '#EB172A',
          borderLeftWidth: 10,
        }}
      >
        <Text style={{ color: 'white' }}>{error}</Text>
      </Snackbar>
    </>
  );
};

export default JoinBoxScreen;
