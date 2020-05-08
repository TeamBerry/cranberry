import React, { useState, useContext } from "react"
import { Image, KeyboardAvoidingView, StyleSheet, View, Button, Text, TouchableOpacity } from "react-native"
import { Formik } from 'formik';

import FormTextInput from "../components/form-text-input.component"
import AuthContext from "../shared/auth.context"

const SignupScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const onEmailChange = (email: string) => {
        setEmail(email)
    }

    const onPasswordChange = (password: string) => {
        setPassword(password)
    }

    const onUsernameChange = (username: string) => {
        setUsername(username)
    }

    const { signUp } = useContext(AuthContext)

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
                source={require('./../../assets/berrybox-logo-master.png')}
                style={styles.image}
            />
            <View style={styles.form}>
                <FormTextInput
                    value={email}
                    onChangeText={(email) => onEmailChange(email)}
                    placeholder='Email address'
                    autoCorrect={false}
                    keyboardType='email-address'
                    returnKeyType='next'
                />
                <FormTextInput
                    value={username}
                    onChangeText={(username) => onUsernameChange(username)}
                    placeholder='Username'
                    autoCorrect={false}
                    returnKeyType='next'
                />
                <FormTextInput
                    value={password}
                    onChangeText={(password) => onPasswordChange(password)}
                    placeholder='Password'
                    secureTextEntry={true}
                    returnKeyType='done'
                    onSubmitEditing={() => signUp({email, password, username})}
                    />
                <Button
                    title="Sign Up"
                    onPress={() => signUp({email, password, username})}
                />
            </View>
            </KeyboardAvoidingView>
        </>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 20,
        paddingLeft: 10,
        backgroundColor: '#262626',
        borderColor: '#191919',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        flexDirection: 'row-reverse'
    },
    headerStyle: {
        height: 20,
        elevation: 0,
        shadowOpacity: 0
    },
    loginLink: {
        textTransform: 'uppercase',
        color: '#009AEB',
        fontFamily: 'Montserrat-SemiBold'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#262626',
        paddingTop: 40
    },
    form: {
        flex: 1,
        width: 320,
        paddingBottom: 20
    },
    image: {
        height: 150,
        width: 150,
    }
})

export default SignupScreen