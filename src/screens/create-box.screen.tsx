import React, {useState} from "react";
import { Image, KeyboardAvoidingView, StyleSheet, View, Button, Text, TouchableOpacity } from "react-native"
import FormTextInput from "../components/form-text-input.component"
import { Switch } from "react-native-paper";

const CreateBoxScreen = ({ navigation }) => {
    const [name, setName] = useState('')
    const [isRandom, setRandom] = useState(false)
    const [isLoop, setLoop] = useState(false)

    return (
        <>
            <View style={styles.headerContainer}>
                <View style={styles.headerStyle}>
                    <TouchableOpacity
                        onPress={() => navigation.pop()}
                    >
                    </TouchableOpacity>
                    <Text style={styles.titlePage}>New box</Text>
                </View>
            </View>
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
            >
            <View style={styles.form}>
                <FormTextInput
                    value={name}
                    onChangeText={setName}
                    placeholder='Box Name'
                    autoCorrect={false}
                    returnKeyType='next'
                    />
                    <View style={styles.modeContainer}>
                    <View style={styles.modeSpace}>
                        <Text style={styles.modeTitle}>Random</Text>
                        <Switch
                            value={isRandom}
                            onValueChange={setRandom}
                            color='#009AEB'
                        />
                    </View>
                        <Text style={styles.modeHelper}>When a video ends, the next one will be picked randomly from the upcoming pool of videos.</Text>
                    </View>
                    <View style={styles.modeContainer}>
                    <View style={styles.modeSpace}>
                        <Text style={styles.modeTitle}>Loop</Text>
                        <Switch
                            value={isLoop}
                            onValueChange={setLoop}
                            color='#009AEB'
                        />
                    </View>
                    <Text style={styles.modeHelper}>The system will automatically requeue old videos.</Text>
                    </View>
                <Button
                    title="Create Box"
                    onPress={() => console.log('BOX')}
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
        flexDirection: 'row'
    },
    headerStyle: {
        height: 20,
        elevation: 0,
        shadowOpacity: 0
    },
    titlePage: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 30,
        marginTop: '1%',
        marginBottom: 10,
        color: 'white',
        paddingLeft: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
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
    },
    modeContainer: {
        marginVertical: 20
    },
    modeSpace: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modeTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat-SemiBold',
        color: 'white'
    },
    modeHelper: {
        color: '#BBBBBB'
    }
})

export default CreateBoxScreen