import React from "react"
import { StyleSheet, TextInput } from "react-native"

const FormTextInput = props => {
    return (
        <TextInput
            style={styles.textInput}
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#009aeb',
        padding: 10,
        borderRadius: 5
    }
})

export default FormTextInput