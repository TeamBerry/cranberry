import React, { useContext, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, KeyboardAvoidingView, ToastAndroid,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Config from 'react-native-config';
import { connect } from 'react-redux';
import { useTheme } from '../../shared/theme.context';
import { getUser } from '../../redux/selectors';

import BackIcon from '../../../assets/icons/back-icon.svg';
import FormTextInput from '../../components/form-text-input.component';
import BxActionComponent from '../../components/bx-action.component';
import BxLoadingIndicator from '../../components/bx-loading-indicator.component';
import AuthContext from '../../shared/auth.context';
import { AuthSubject } from '../../models/session.model';

const ChangePasswordScreen = (props: { navigation, user: AuthSubject }) => {
  const { navigation, user } = props;
  const { colors } = useTheme();
  const [isUpdating, setUpdating] = useState(false);
  const { signOut } = useContext(AuthContext);

  const styles = StyleSheet.create({
    headerContainer: {
      paddingVertical: 20,
      paddingHorizontal: 10,
      borderColor: '#191919',
      borderStyle: 'solid',
      borderBottomWidth: 1,
      backgroundColor: colors.background,
    },
    headerStyle: {
      height: 20,
      elevation: 0,
      shadowOpacity: 0,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    settingTitle: {
      color: colors.textColor,
      marginLeft: 30,
      fontWeight: '700',
    },
    formContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 40,
    },
    form: {
      flex: 1,
      width: 320,
      paddingBottom: 20,
    },
  });

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.headerStyle}>
          <Pressable
            onPress={() => navigation.pop()}
          >
            <BackIcon width={20} height={20} fill={colors.textColor} />
          </Pressable>
          <Text style={styles.settingTitle}>Change your password</Text>
        </View>
      </View>
      { user ? (
        <KeyboardAvoidingView style={styles.formContainer}>
          <Formik
            initialValues={{ oldPassword: '', newPassword: '', newPasswordConfirm: '' }}
            validationSchema={
                        yup.object().shape({
                          oldPassword: yup
                            .string()
                            .min(8, 'Your password cannot have less than 8 symbols.')
                            .required('Your old password is required.'),
                          newPassword: yup
                            .string()
                            .min(8, 'Your password cannot have less than 8 symbols.')
                            .required('Your new password is required.'),
                          newPasswordConfirm: yup
                            .string()
                            .min(8, 'Your password cannot have less than 8 symbols.')
                            .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
                            .required('You must confirm your new password.'),
                        })
                    }
            onSubmit={async (values) => {
              setUpdating(true);
              try {
                // Test
                await axios.post(`${Config.API_URL}/auth/login`, { mail: user.mail, password: values.oldPassword });
                // Update Password
                await axios.put(`${Config.API_URL}/auth`, { password: values.newPassword });
                ToastAndroid.show('Your password has been updated', 3000);
                signOut();
              } catch (error) {
                if (error.message === 'INVALID_CREDENTIALS') {
                  ToastAndroid.show('Your old password is incorrect.', 4000);
                } else {
                  ToastAndroid.show('An unexpected error occurred. Please try again', 5000);
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
                    value={values.oldPassword}
                    onChangeText={handleChange('oldPassword')}
                    onBlur={() => setFieldTouched('oldPassword')}
                    placeholder="Your old password"
                    secureTextEntry
                    returnKeyType="next"
                  />
                  {touched.oldPassword && errors.oldPassword && <Text style={{ fontSize: 12, color: '#EB172A' }}>{errors.oldPassword}</Text>}
                </View>
                <View style={{ marginBottom: 20 }}>
                  <FormTextInput
                    value={values.newPassword}
                    onChangeText={handleChange('newPassword')}
                    onBlur={() => setFieldTouched('newPassword')}
                    placeholder="Your new password (min. 8 characters)"
                    secureTextEntry
                    returnKeyType="next"
                  />
                  {touched.newPassword && errors.newPassword && <Text style={{ fontSize: 12, color: '#EB172A' }}>{errors.newPassword}</Text>}
                </View>
                <View style={{ marginBottom: 20 }}>
                  <FormTextInput
                    value={values.newPasswordConfirm}
                    onChangeText={handleChange('newPasswordConfirm')}
                    onBlur={() => setFieldTouched('newPasswordConfirm')}
                    placeholder="Confirm your new password"
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                  {touched.newPasswordConfirm && errors.newPasswordConfirm && <Text style={{ fontSize: 12, color: '#EB172A' }}>{errors.newPasswordConfirm}</Text>}
                </View>
                {!isUpdating ? (
                  <>
                    <Text style={{ color: colors.textSystemColor, fontSize: 11, textAlign: 'center' }}>
                      This operation cannot be undone. Once your password is reset, you will be disconnected.
                    </Text>
                    <Pressable onPress={() => handleSubmit()} disabled={!isValid}>
                      <BxActionComponent options={{ text: 'Change my password' }} />
                    </Pressable>
                  </>
                ) : (
                  <BxLoadingIndicator />
                )}
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      ) : (
        <BxLoadingIndicator />
      )}
    </>
  );
};

export default connect((state) => getUser(state))(ChangePasswordScreen);
