/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useState } from 'react';
import {
  Image, KeyboardAvoidingView, StyleSheet, View, Button, Text, TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Snackbar } from 'react-native-paper';
import FormTextInput from '../components/form-text-input.component';
import AuthContext from '../shared/auth.context';
import BxLoadingIndicator from '../components/bx-loading-indicator.component';

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 20,
    paddingLeft: 10,
    backgroundColor: '#262626',
    borderColor: '#191919',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    flexDirection: 'row-reverse',
  },
  headerStyle: {
    height: 20,
    elevation: 0,
    shadowOpacity: 0,
  },
  loginLink: {
    textTransform: 'uppercase',
    color: '#009AEB',
    fontFamily: 'Montserrat-SemiBold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
});

const SignupScreen = ({ navigation }) => {
  const { signUp } = useContext(AuthContext);

  const [isLogging, setLogging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.headerStyle}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.loginLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="height"
      >
        <Image
          source={require('../../assets/berrybox-logo-master.png')}
          style={styles.image}
        />
        <Formik
          initialValues={{ email: '', username: '', password: '' }}
          validationSchema={
                      yup.object().shape({
                        email: yup
                          .string()
                          .email('This mail address is invalid')
                          .required('The mail address is required'),
                        username: yup
                          .string()
                          .min(4, 'Your username cannot have less than 4 characters.')
                          .max(20, 'Your username cannot have more than 20 characters.')
                          .trim()
                          .required('You must choose an username'),
                        password: yup
                          .string()
                          .min(8, 'Your password cannot have less than 8 symbols.')
                          .required('The password is required'),
                      })
                  }
          onSubmit={async (values) => {
            setLogging(true);
            try {
              await signUp({
                email: values.email.trim(),
                username: values.username.trim(),
                password: values.password,
              });
            } catch (error) {
              setLogging(false);
              if (error.message === 'MAIL_ALREADY_EXISTS') {
                setErrorMessage('This mail address is already used.');
              } else if (error.message === 'USERNAME_ALREADY_EXISTS') {
                setErrorMessage('This username is already used.');
              } else {
                setErrorMessage('An unknown error occured.');
              }
            }
          }}
        >
          {({
            handleChange, setFieldTouched, handleSubmit, values, touched, errors, isValid,
          }) => (
            <View style={styles.form}>
              <View style={{ marginBottom: 20 }}>
                <FormTextInput
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                  placeholder="Email address"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.email && errors.email && <Text style={{ fontSize: 12, color: '#EB172A' }}>{errors.email}</Text>}
              </View>
              <View style={{ marginBottom: 20 }}>
                <FormTextInput
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={() => setFieldTouched('username')}
                  placeholder="Username"
                  autoCorrect={false}
                  returnKeyType="next"
                />
                {touched.username && errors.username && <Text style={{ fontSize: 12, color: '#EB172A' }}>{errors.username}</Text>}
              </View>
              <View style={{ marginBottom: 20 }}>
                <FormTextInput
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => setFieldTouched('password')}
                  placeholder="Password"
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                {touched.password && errors.password && <Text style={{ fontSize: 12, color: '#EB172A' }}>{errors.password}</Text>}
              </View>
              {!isLogging ? (
                <Button
                  title="Sign Up"
                  disabled={!isValid}
                  onPress={handleSubmit}
                />
              ) : (
                <BxLoadingIndicator />
              )}
              <Snackbar
                visible={errorMessage}
                onDismiss={() => setErrorMessage(null)}
                duration={2000}
                style={{
                  backgroundColor: '#090909',
                  borderLeftColor: '#EB172A',
                  borderLeftWidth: 10,
                }}
              >
                {errorMessage}
              </Snackbar>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignupScreen;
