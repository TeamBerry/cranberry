import React, { useState, useEffect, useContext } from "react";
import { Text, Image, View, StyleSheet, Platform, StatusBar, AsyncStorage, Button } from "react-native";
import AuthContext from "../shared/auth.context";

const CustomMenu = () => {

    const [user, setUser] = useState(null)

    useEffect(() => {
        const bootstrap = async () => {
            try {
                const user = JSON.parse(await AsyncStorage.getItem('BBOX-user'))
                setUser(user)
            } catch (e) {
                console.error('Session could not be obtained')
            }
        }

        bootstrap();
    }, [])

    const { signOut } = useContext(AuthContext);

    const UserSpace = () => {
        if (!user) {
            return (
                <></>
            )
        }

        return (
            <View>
                <Image
                    style={styles.userImage}
                    source={{uri: `https://berrybox-user-pictures.s3.eu-west-1.amazonaws.com/profile-pictures/${user?.settings.picture}`}}
                />
                <Text style={styles.userName}>{user?.name}</Text>
                    <Button
                        title="Sign out"
                        onPress={() => signOut()}
                    />
            </View>
        )
    }

    return (
        <>
        {/* <View style={{height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight, backgroundColor: '#262626'}}>
                <StatusBar barStyle='dark-content' />
        </View> */}
        <View style={styles.container}>
            <UserSpace />
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#404040',
        height: '100%',
        padding: 20,
        alignItems: 'center'
    },
    userImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
        alignSelf: 'center'
    },
    userName: {
        paddingTop: 10,
        fontSize: 20,
        color: 'white',
        fontFamily: 'Montserrat-SemiBold'
    }
})

export default CustomMenu