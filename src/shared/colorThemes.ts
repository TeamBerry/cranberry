const commonColors = {
  primary: '#009AEB',
  // Various
  boxLabelBackground: '#979797',
};

export const lightColors = {
  ...commonColors,
  inputMainColor: '#D0D0D0',
  // Background
  background: '#F0F0F0',
  backgroundSecondaryColor: '#D9D9D9',
  backgroundAlternateColor: '#E0E0E0',
  backgroundSecondaryAlternateColor: '#E9E9E9',
  backgroundInactiveColor: '#B3B3B3',
  backgroundChatColor: '#C2C2C2',
  deepBackground: '#E9E9E9',
  // Text
  textColor: 'black',
  textSecondaryColor: '#1A1A1A',
  textSystemColor: '#444444',
  // States
  inactiveColor: '#8F8F8F',
  successColor: '#0AC29D',
  chipColor: '#C7C7C7',
  // Separators
  videoSeparator: '#D9D9D9',
};

export const darkColors = {
  ...commonColors,
  inputMainColor: '#D0D0D0',
  // Background
  background: '#262626',
  backgroundSecondaryColor: '#404040',
  backgroundAlternateColor: '#111111',
  backgroundSecondaryAlternateColor: '#191919',
  backgroundInactiveColor: '#252525',
  backgroundChatColor: '#303030',
  deepBackground: '#191919',
  // Text
  textColor: 'white',
  textSecondaryColor: '#E6E6E6',
  textSystemColor: '#BBBBBB',
  // States
  inactiveColor: '#CCCCCC',
  successColor: '#0CEBC0',
  chipColor: '#363636',
  // Separators
  videoSeparator: '#3F3F3F',
};

export type Colors = typeof lightColors;
