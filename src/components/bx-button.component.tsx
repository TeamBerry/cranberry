import React from 'react';
import {
  View, Text, StyleSheet, Pressable,
} from 'react-native';

import PlayIcon from '../../assets/icons/play-later-icon.svg';
import PlayNextIcon from '../../assets/icons/play-next-icon.svg';
import PlayNowIcon from '../../assets/icons/play-now-icon.svg';
import DeleteIcon from '../../assets/icons/trash-icon.svg';
import SkipIcon from '../../assets/icons/skip-icon.svg';
import BerriesIcon from '../../assets/icons/berry-coin-icon.svg';

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    flex: 0,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  buttonPrimary: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  buttonDanger: {
    backgroundColor: '#EB172A',
  },
  buttonIcon: {
    padding: 1,
  },
  buttonBerries: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderColor: '#FF8E52',
    borderWidth: 1,
  },
  buttonText: {
    paddingLeft: 5,
    color: 'white',
  },
});

export interface ButtonOptions {
    /**
     * Type of action of the button. Will determine the icon and the default text
     *
     * @type {('play' | 'replay' | 'cancel' | 'skip')}
     * @memberof ButtonOptions
     */
    type?: 'play' | 'replay' | 'cancel' | 'skip' | 'addToLibrary' | 'forceNext' | 'forcePlay',
    /**
     * Context of the button. Will affect its display
     *
     * @type {('primary' | 'secondary' | 'default' | 'warning' | 'default')}
     * @memberof ButtonOptions
     */
    context?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'default' | 'queue' | 'berries',
    /**
     * Button text. Will default to the type if not specified
     *
     * @type {string}
     * @memberof ButtonOptions
     */
    text?: string,
    /**
     * Whether the text must be displayed in the button or in a tooltip
     *
     * @type {('button' | 'full')}
     * @memberof ButtonOptions
     */
    textDisplay?: 'button' | 'full'
}

const InsertIcon = ({ type }: { type: ButtonOptions['type'] }) => {
  switch (type) {
    case 'play':
      return <PlayIcon width={20} height={20} fill="white" />;
    case 'replay':
      return null;
    case 'cancel':
      return <DeleteIcon width={20} height={20} fill="white" />;
    case 'skip':
      return <SkipIcon width={20} height={20} fill="white" />;
    case 'addToLibrary':
      return null;
    case 'forceNext':
      return <PlayNextIcon width={20} height={20} fill="white" />;
    case 'forcePlay':
      return <PlayNowIcon width={20} height={20} fill="white" />;
    default:
      return null;
  }
};

const parseText = (text: string) => {
  if (text.includes('$BC$')) {
    const parts = /(.*)(\$BC\$)(.*)/gi.exec(text);
    return (
      <>
        <Text style={styles.buttonText}>{parts[1]}</Text>
        <BerriesIcon width={20} height={20} />
        <Text style={styles.buttonText}>{parts[3]}</Text>
      </>
    );
  }

  return (
    <Text style={styles.buttonText}>{text}</Text>
  );
};

const BxButtonComponent = (props: {
    options: Partial<ButtonOptions>,
    onPress: () => void
}) => {
  const { options, onPress } = props;
  const context = options.context ? `button${options.context.charAt(0).toUpperCase() + options.context.slice(1)}` : 'buttonPrimary';

  return (
    <Pressable
      style={[styles.button, styles[context]]}
      onPress={onPress}
      android_ripple={{ color: '#272727' }}
    >
      {options.type ? (
        <View style={styles.buttonIcon}>
          <InsertIcon type={options.type} />
        </View>
      ) : null}
      {options.textDisplay === 'full' ? (
        parseText(options.text)
      ) : null}
    </Pressable>
  );
};

export default BxButtonComponent;
