import React, { useContext, useState } from "react";
import { Text, Image, StyleSheet, View, Button, KeyboardAvoidingView } from "react-native";
import FormTextInput from "../components/form-text-input.component";
import AuthContext from "../shared/auth.context";
// import AsyncStorage from '@react-native-community/async-storage';


export default function LoginScreen ({navigation}) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onEmailChange = (email: string) => {
        setEmail(email)
    }

    const onPasswordChange = (password: string) => {
        setPassword(password)
    }

    const { signIn } = useContext(AuthContext);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <Image
                source={require('./../../assets/berrybox-logo-master.png')}
                style={styles.image}
            ></Image>
            <View style={styles.form}>
                <FormTextInput
                    value={email}
                    onChangeText={(email) => onEmailChange(email)}
                    placeholder='Email address'
                    autoCorrect={false}
                    keyboardType='email-address'
                    returnKeyType='next'
                ></FormTextInput>
                <FormTextInput
                    value={password}
                    onChangeText={(password) => onPasswordChange(password)}
                    placeholder='Password'
                    secureTextEntry={true}
                    returnKeyType='done'
                    onSubmitEditing={() => signIn({email, password})}
                ></FormTextInput>
                <Button
                    title="Log in"
                    onPress={() => signIn({email, password})}
                />
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#262626',
        paddingTop: 80
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        width: '80%'
    },
    image: {
        height: 200,
        width: 200,
    }
})