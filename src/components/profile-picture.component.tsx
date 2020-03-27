import React, { useState } from "react"
import {Image} from "react-native"

export type Props = {
    userId: string,
    size: number
}

const ProfilePicture = ({userId, size}: Props) => {
    const [couldLoadPicture, setPictureLoading] = useState(true)

    if (!couldLoadPicture) {
        return (
            <Image
                source={{ uri: 'https://berrybox-user-pictures.s3-eu-west-1.amazonaws.com/profile-pictures/default-picture' }}
                style={{width: size, height: size, borderRadius: size/2}}
            />
        )
    }

    return (
        <Image
            source={{ uri: `https://berrybox-user-pictures.s3-eu-west-1.amazonaws.com/profile-pictures/${userId}-picture` }}
            onError={() => setPictureLoading(false)}
            style={{width: size, height: size, borderRadius: size/2}}
        />
    )

}

export default ProfilePicture