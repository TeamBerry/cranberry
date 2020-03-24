const commonColors = {
    primary: '#009AEB',
    // Various
    boxLabelBackground: '#979797'
}

export const lightTheme = {
    dark: false,
    colors: {
        ...commonColors,
        inputMainColor: '#D0D0D0',
        // Background
        background: 'white',
        backgroundSecondaryColor: '#D9D9D9',
        backgroundInactiveColor: '#B3B3B3',
        // Text
        textColor: 'black',
        textSecondaryColor: '#1A1A1A',
        textSystemColor: '#444444',
        // States
        inactiveColor: '#8F8F8F'
    }
}

export const darkTheme = {
    dark: true,
    colors: {
        ...commonColors,
        inputMainColor: '#D0D0D0',
        // Background
        background: '#262626',
        backgroundSecondaryColor: '#404040',
        backgroundInactiveColor: '#252525',
        // Text
        textColor: 'white',
        textSecondaryColor: '#E6E6E6',
        textSystemColor: '#BBBBBB',
        // States
        inactiveColor: '#CCCCCC'
    }
}