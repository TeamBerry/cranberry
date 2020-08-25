import React from 'react';
import {
  View, Text, StyleSheet, Image,
} from 'react-native';
import { Message, FeedbackMessage, SystemMessage } from '@teamberry/muscadine';
import Config from 'react-native-config';

export type Props = {
    message: Message | FeedbackMessage | SystemMessage
}

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
    color: '#BBBBBB',
  },
  feedbackMessage: {
    color: '#BBBBBB',
    borderLeftWidth: 3,
    borderStyle: 'solid',
    paddingLeft: 9,
  },
  systemMessage: {
    color: '#BBBBBB',
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
    color: 'white',
    paddingLeft: 4,
  },
  userBadge: {
    height: 16,
    width: 16,
    paddingTop: 3,
  },
});

const ChatMessage = ({ message }: Props) => {
  const AuthorRender = (message: Message) => {
    if (message.author) {
      const { name, color } = message.author as Message['author'];
      return (<Text style={[styles.author, { color }]}>{name}</Text>);
    }
    return null;
  };

  const SystemMessageRender = (message: SystemMessage) => {
    const type = `${message.context}SystemContext`;

    return (
      <View style={[styles.message, styles.systemMessage, styles[type]]}>
        <Text style={{ color: '#BBBBBB' }}>{message.contents}</Text>
      </View>
    );
  };

  const FeedbackMessageRender = (message: FeedbackMessage) => {
    const type = `${message.context}FeedbackContext`;

    return (
      <View style={[styles.message, styles.feedbackMessage, styles[type]]}>
        <Text style={{ color: '#BBBBBB' }}>{message.contents}</Text>
        <Text style={styles.feedbackAlert}>Only you can see this message.</Text>
      </View>
    );
  };

  const ChatBadge = () => {
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
      <Text style={styles.userMessage}>
        {message.author._id === Config.ADMIN_ID ? (
          <Image
            style={{ width: 16, height: 16 }}
            source={require('../../../../assets/badges/staff-badge.png')}
          />
        ) : null}
        <ChatBadge />
        {AuthorRender(message as Message)}
        {`: ${message.contents}`}
      </Text>
    </View>
  );
};

export default ChatMessage;
