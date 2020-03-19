import React from "react";
import { Text, Image, StyleSheet, View, Button } from "react-native";
import FormTextInput from "../components/form-text-input.component";

export class LoginScreen extends React.Component<{ navigation }> {

    readonly state = {
        email: '',
        password: ''
    }

    onEmailChange(email: string) {
        this.setState({email})
    }

    onPasswordChange(password: string) {
        this.setState(password)
    }

    login() {
        console.log('LOGIN')
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={require('./../assets/berrybox-logo-master.png')}
                    style={styles.image}
                ></Image>
                <View style={styles.form}>
                    <FormTextInput
                        value={this.state.email}
                        onChangeText={this.onEmailChange}
                        placeholder='Email address'
                    ></FormTextInput>
                    <FormTextInput
                        value={this.state.password}
                        onChangeText={this.onPasswordChange}
                        placeholder='Password'
                    ></FormTextInput>
                    <Button
                        title="Log in"
                        onPress={() => this.login}
                    />
                </View>
            </View>
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
        height: 200,
        width: 200,
    }
})