/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

const ProfilePicture = (props: { fileName?: string, size: number, style?: StyleProp<ImageStyle> }) => {
  const { fileName, size, style = {} } = props;
  const [couldLoadPicture, setPictureLoading] = useState(true);

  if (!couldLoadPicture) {
    return (
      <Image
        source={{ uri: 'https://berrybox-user-pictures.s3-eu-west-1.amazonaws.com/profile-pictures/default-picture' }}
        style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      />
    );
  }

  return (
    <Image
      source={{ uri: `https://berrybox-user-pictures.s3-eu-west-1.amazonaws.com/profile-pictures/${fileName}` }}
      onError={() => setPictureLoading(false)}
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
    />
  );
};

export default ProfilePicture;
