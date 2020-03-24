import React, { useEffect, useState } from "react"
import { AsyncStorage, Image, StyleSheet, View, Text } from "react-native"

const CustomHeader = props => {

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
            <View style={styles.container}>
                <Image
                    style={styles.userImage}
                    source={{uri: `https://berrybox-user-pictures.s3.eu-west-1.amazonaws.com/profile-pictures/${user?.settings.picture}`}}
                />
                {/* <Image
                    style={styles.userImage}
                    source={require('./../assets/berrybox-logo-master.png')}
                /> */}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        flex: 0,
        justifyContent: 'center',
        backgroundColor: '#262626',
        paddingHorizontal: 10
    },
    userImage: {
        height: 30,
        width: 30,
        borderRadius: 15
    }
})

export default CustomHeader