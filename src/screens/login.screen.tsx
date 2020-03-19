import React from "react";
import { Text, Image, StyleSheet, View, Button, KeyboardAvoidingView } from "react-native";
import FormTextInput from "../components/form-text-input.component";
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export class LoginScreen extends React.Component<{ navigation }> {

    readonly state = {
        email: '',
        password: ''
    }

    onEmailChange(email: string) {
        this.setState({email})
    }

    onPasswordChange(password: string) {
        this.setState({password})
    }

    login() {
        console.log('LOGIN: ', this.state.email, this.state.password)
        axios.post(`https://araza.berrybox.tv/auth/login`,
            {
                mail: this.state.email,
                password: this.state.password
            }
        ).then(async (response) => {
            await AsyncStorage.setItem('BBOX-token', response.data.bearer)
            await AsyncStorage.setItem('BBOX-expires_at', response.data.expiresIn)
            await AsyncStorage.setItem('BBOX-user', JSON.stringify(response.data.subject))
        }).catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
            >
                <Image
                    source={require('./../assets/berrybox-logo-master.png')}
                    style={styles.image}
                ></Image>
                <View style={styles.form}>
                    <FormTextInput
                        value={this.state.email}
                        onChangeText={(email) => this.onEmailChange(email)}
                        placeholder='Email address'
                        autoCorrect={false}
                        keyboardType='email-address'
                        returnKeyType='next'
                    ></FormTextInput>
                    <FormTextInput
                        value={this.state.password}
                        onChangeText={(password) => this.onPasswordChange(password)}
                        placeholder='Password'
                        secureTextEntry={true}
                        returnKeyType='done'
                        onSubmitEditing={() => this.login()}
                    ></FormTextInput>
                    <Button
                        title="Log in"
                        onPress={() => this.login()}
                    />
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        width: '80%'
    },
    image: {
        height: 250,
        width: 250,
    }
})