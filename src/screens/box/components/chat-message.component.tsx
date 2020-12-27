import React from 'react';
import {
  View, Text, StyleSheet, Image,
} from 'react-native';
import { Message, FeedbackMessage, SystemMessage } from '@teamberry/muscadine';
import Config from 'react-native-config';
import { useTheme } from '../../../shared/theme.context';

const styles = StyleSheet.create({
  message: {
    paddingVertical: 3,
    marginVertical: 3,
  },
  author: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#BBBBBB',
  },
  feedbackAlert: {
    fontSize: 8,
  },
  feedbackMessage: {
    borderLeftWidth: 3,
    borderStyle: 'solid',
    paddingLeft: 9,
  },
  systemMessage: {
    borderLeftWidth: 3,
    borderStyle: 'solid',
    paddingLeft: 9,
  },
  successSystemContext: {
    borderLeftColor: '#0CEBC0',
  },
  infoSystemContext: {
    borderLeftColor: '#009AEB',
  },
  errorSystemContext: {
    borderLeftColor: '#B30F4F',
  },
  warningSystemContext: {
    borderLeftColor: 'yellow',
  },
  berriesSystemContext: {
    borderLeftColor: '#FF8E52',
    color: '#FF8E52',
  },
  successFeedbackContext: {
    borderLeftColor: '#0CEBC0',
    backgroundColor: 'rgba(12, 235, 192, 0.075)',
  },
  infoFeedbackContext: {
    borderLeftColor: '#009AEB',
    backgroundColor: 'rgba(0, 154, 235, 0.075)',
  },
  errorFeedbackContext: {
    borderLeftColor: '#B30F4F',
    backgroundColor: 'rgba(235, 23, 42, 0.075)',
  },
  warningFeedbackContext: {
    borderLeftColor: 'yellow',
    backgroundColor: 'rgba(252, 196, 13, 0.075)',
  },
  userMessage: {
    paddingLeft: 4,
  },
  userBadge: {
    height: 16,
    width: 16,
    paddingTop: 3,
  },
});

const ChatMessage = (props: { message: Message | FeedbackMessage | SystemMessage, colorblindMode: boolean }) => {
  const { message, colorblindMode } = props;
  const { colors } = useTheme();

  const AuthorRender = (message: Message) => {
    if (message.author) {
      const { name, color } = message.author as Message['author'];
      return (<Text style={[styles.author, { color: colorblindMode ? colors.textColor : color }]}>{name}</Text>);
    }
    return null;
  };

  const SystemMessageRender = (message: SystemMessage) => {
    const type = `${message.context}SystemContext`;

    return (
      <View style={[styles.message, styles.systemMessage, styles[type], { color: colors.textSystemColor }]}>
        <Text style={{ color: colors.textSystemColor }}>{message.contents}</Text>
      </View>
    );
  };

  const FeedbackMessageRender = (message: FeedbackMessage) => {
    const type = `${message.context}FeedbackContext`;

    return (
      <View style={[styles.message, styles.feedbackMessage, styles[type], { color: colors.textSystemColor }]}>
        <Text style={{ color: colors.textSystemColor }}>{message.contents}</Text>
        <Text style={[styles.feedbackAlert, { color: colors.textSystemColor }]}>Only you can see this message.</Text>
      </View>
    );
  };

  const RoleBadge = () => {
    switch (message.author.role) {
      case 'vip':
        return (
          <Image
            style={{ width: 16, height: 16 }}
            source={require('../../../../assets/badges/vip-badge.png')}
          />
        );

      case 'admin':
        return (
          <Image
            style={{ width: 16, height: 16 }}
            source={require('../../../../assets/badges/creator-badge.png')}
          />
        );

      case 'moderator':
        return (
          <Image
            style={{ width: 16, height: 16 }}
            source={require('../../../../assets/badges/moderator-badge.png')}
          />
        );

      default:
        return null;
    }
  };

  if (message.source === 'system') {
    return (SystemMessageRender(message as SystemMessage));
  }

  if (message.source === 'feedback') {
    return (FeedbackMessageRender(message as FeedbackMessage));
  }

  return (
    <View style={styles.message}>
      <Text style={[styles.userMessage, { color: colors.textColor }]}>
        {message.author._id === Config.ADMIN_ID ? (
          <Image
            style={{ width: 16, height: 16 }}
            source={require('../../../../assets/badges/staff-badge.png')}
          />
        ) : null}
        <RoleBadge />
        {message.author._id && message.author.badge ? (
          <Image source={{ uri: message.author.badge }} style={{ width: 16, height: 16, marginHorizontal: 2 }} />
        ) : null}
        {AuthorRender(message as Message)}
        {`: ${message.contents}`}
      </Text>
    </View>
  );
};

export default ChatMessage;
