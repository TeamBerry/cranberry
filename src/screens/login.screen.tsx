import React, { useContext, useState } from 'react';
import {
  Image, StyleSheet, View, Button, KeyboardAvoidingView, Text, TouchableOpacity,
} from 'react-native';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEmailChange = (email: string) => {
    setEmail(email);
  };

  const onPasswordChange = (password: string) => {
    setPassword(password);
  };

  const { signIn } = useContext(AuthContext);

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
        behavior="padding"
      >
        <Image
          source={require('../../assets/berrybox-logo-master.png')}
          style={styles.image}
        />
        <View style={styles.form}>
          <FormTextInput
            value={email}
            onChangeText={(email) => onEmailChange(email)}
            placeholder="Email address"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
          />
          <FormTextInput
            value={password}
            onChangeText={(password) => onPasswordChange(password)}
            placeholder="Password"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={() => signIn({ email, password })}
          />
          <Button
            title="Log in"
            onPress={() => signIn({ email, password })}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
