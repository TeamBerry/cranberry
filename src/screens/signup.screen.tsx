/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from 'react';
import {
  Image, KeyboardAvoidingView, StyleSheet, View, Button, Text, TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import FormTextInput from '../components/form-text-input.component';
import AuthContext from '../shared/auth.context';

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

  const validate = (values) => {
    const errors: {
            email?: string,
            username?: string,
            password?: string
        } = {};

    if (!values.username) {
      errors.username = 'Required';
    } else if (values.username.length < 4) {
      errors.username = 'Must be 5 characters minimum';
    } else if (values.username.length > 21) {
      errors.username = 'Must be 20 characters or less';
    }

    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'This mail address is invalid';
    }

    if (!values.password) {
      errors.password = 'Required';
    } else if (values.password.length < 7) {
      errors.password = 'Must be 8 characters minimum';
    }

    return errors;
  };

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
        behavior="padding"
      >
        <Image
          source={require('../../assets/berrybox-logo-master.png')}
          style={styles.image}
        />
        <Formik
          initialValues={{ email: '', username: '', password: '' }}
          validate={validate}
          onSubmit={(values) => console.log(values)} // signUp({ email: values.email, username: values.username, password: values.password })}
        >
          {({
            handleChange, handleBlur, handleSubmit, values,
          }) => (
            <View style={styles.form}>
              <FormTextInput
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="Email address"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
              />
              <FormTextInput
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                placeholder="Username"
                autoCorrect={false}
                returnKeyType="next"
              />
              <FormTextInput
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Password"
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              <Button
                title="Sign Up"
                onPress={() => handleSubmit}
              />
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignupScreen;
