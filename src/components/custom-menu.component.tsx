import React, { useState, useEffect } from "react";
import { Text, Image, View, StyleSheet, Platform, StatusBar, AsyncStorage } from "react-native";

const CustomMenu = () => {

    const [user, setUser] = useState(null)

    useEffect(() => {
        const bootstrap = async () => {
            try {
                const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'))
                console.log(user)
                setUser(user)
            } catch (e) {
                console.error('Session could not be obtained')
            }
        }

        bootstrap();
    }, [])

    return (
        <>
        <View style={{height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight, backgroundColor: '#262626'}}>
                <StatusBar barStyle='dark-content' />
        </View>
            <View style={styles.container}>
                <View>
                <Image
                    style={styles.userImage}
                    source={{uri: `https://berrybox-user-pictures.s3.eu-west-1.amazonaws.com/profile-pictures/${user?.settings.picture}`}}
                />
                    <Text style={styles.userName}>{user.name}</Text>
                </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#404040',
        height: '100%',
        padding: 20
    },
    userImage: {
        height: 50,
        width: 50,
        borderRadius: 25
    },
    userName: {
        fontSize: 20,
        color: 'white'
    }
})

export default CustomMenu