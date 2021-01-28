/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import PresenceIndicator from './presence-indicator.component';

const ProfilePicture = (props: { fileName?: string, size: number, style?: StyleProp<ImageStyle>, isOnline?: boolean }) => {
  const {
    fileName, size, style = {}, isOnline,
  } = props;
  const [couldLoadPicture, setPictureLoading] = useState(true);

  if (!couldLoadPicture) {
    return (
      <>
        <Image
          source={{ uri: 'https://berrybox-user-pictures.s3-eu-west-1.amazonaws.com/profile-pictures/default-picture' }}
          style={[{
            width: size, height: size, borderRadius: size / 2, backgroundColor: 'white',
          }, style]}
        />
        { isOnline !== undefined ? (
          <PresenceIndicator status={isOnline} size={size} />
        ) : null}
      </>
    );
  }

  return (
    <>
      <Image
        source={{ uri: `https://berrybox-user-pictures.s3-eu-west-1.amazonaws.com/profile-pictures/${fileName}` }}
        onError={() => setPictureLoading(false)}
        style={[{
          width: size, height: size, borderRadius: size / 2, backgroundColor: 'white',
        }, style]}
      />
      { isOnline !== undefined ? (
        <PresenceIndicator status={isOnline} size={size} />
      ) : null}
    </>
  );
};

export default ProfilePicture;
