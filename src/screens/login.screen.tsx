import React, { useContext, useState } from 'react';
import {
  Image, StyleSheet, View, KeyboardAvoidingView, Text, Pressable,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Snackbar } from 'react-native-paper';
import FormTextInput from '../components/form-text-input.component';
import AuthContext from '../shared/auth.context';
import BxLoadingIndicator from '../components/bx-loading-indicator.component';
import BxActionComponent from '../components/bx-action.component';

import BackIcon from '../../assets/icons/back-icon.svg';
import { useTheme } from '../shared/theme.context';

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderColor: '#191919',
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },
  headerStyle: {
    height: 20,
    elevation: 0,
    shadowOpacity: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    height: 100,
    width: 100,
  },
});

export default function LoginScreen({ navigation }) {
  const { signIn } = useContext(AuthContext);
  const { colors } = useTheme();

  const [isLogging, setLogging] = useState(false);
  const [loginError, setError] = useState(false);

  return (
    <>
      <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
        <View style={styles.headerStyle}>
          <Pressable
            onPress={() => navigation.navigate('Home')}
          >
            <BackIcon width={20} height={20} fill={colors.textColor} />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.loginLink}>New Account</Text>
          </Pressable>
        </View>
      </View>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior="height"
      >
        <Image
          source={require('../../assets/berrybox-logo-master.png')}
          style={styles.image}
        />
        <Text style={{
          fontSize: 16,
          color: colors.textColor,
          fontFamily: 'Montserrat',
          textAlign: 'left',
          padding: 20,
        }}
        >
          Welcome back!
        </Text>
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
                  autoFocus
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
                <View style={{ padding: 5, display: 'flex', flexDirection: 'row' }}>
                  <Text style={{ color: colors.textSystemColor, marginRight: 2 }}>
                    New to Berrybox?
                  </Text>
                  <Pressable onPress={() => navigation.navigate('SignUp')}>
                    <Text style={{ color: '#009AEB', fontWeight: '700' }}>Sign Up</Text>
                  </Pressable>
                </View>
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
