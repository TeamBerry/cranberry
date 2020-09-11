import React, { useContext, useState } from 'react';
import {
  Image, StyleSheet, View, KeyboardAvoidingView, Text, TouchableOpacity, Pressable,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Snackbar } from 'react-native-paper';
import FormTextInput from '../components/form-text-input.component';
import AuthContext from '../shared/auth.context';
import BxLoadingIndicator from '../components/bx-loading-indicator.component';
import BxActionComponent from '../components/bx-action.component';

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
    justifyContent: 'space-between',
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

export default function LoginScreen({ navigation }) {
  const { signIn } = useContext(AuthContext);

  const [isLogging, setLogging] = useState(false);
  const [loginError, setError] = useState(false);

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.headerStyle}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.loginLink}>New Account</Text>
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
          initialValues={{ email: '', password: '' }}
          validationSchema={
                      yup.object().shape({
                        email: yup
                          .string()
                          .email('This mail address is invalid')
                          .required('The mail address is required'),
                        password: yup
                          .string()
                          .required('The password is required'),
                      })
                  }
          onSubmit={async (values) => {
            setLogging(true);
            try {
              await signIn({ email: values.email, password: values.password });
            } catch (error) {
              setLogging(false);
              setError(true);
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
                <Pressable onPress={() => handleSubmit()} disabled={!isValid}>
                  <BxActionComponent options={{ text: 'Log in' }} />
                </Pressable>
              ) : (
                <BxLoadingIndicator />
              )}
              <Snackbar
                visible={loginError}
                onDismiss={() => setError(false)}
                duration={2000}
                style={{
                  backgroundColor: '#090909',
                  borderLeftColor: '#EB172A',
                  borderLeftWidth: 10,
                }}
              >
                <Text style={{ color: 'white' }}>Your credentials are invalid. Please try again.</Text>
              </Snackbar>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </>
  );
}
