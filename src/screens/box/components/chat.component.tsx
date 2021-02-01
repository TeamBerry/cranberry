import React, { useState, useEffect, useRef } from 'react';
import {
  TextInput, StyleSheet, KeyboardAvoidingView, View, NativeScrollEvent, Text, Pressable, ScrollView,
} from 'react-native';

import {
  Message, FeedbackMessage, SystemMessage, Permission,
} from '@teamberry/muscadine';

import Collapsible from 'react-native-collapsible';
import { Socket } from 'socket.io-client';
import ChatMessage from './chat-message.component';

import DownIcon from '../../../../assets/icons/down-icon.svg';
import Box from '../../../models/box.model';
import BerryCounter from './berry-counter.component';
import BerryHelper from './berry-helper.component';
import { useTheme } from '../../../shared/theme.context';
import { AuthSubject } from '../../../models/session.model';
import EmojiBoard from '../../../components/EmojiBoard/emoji-board';

const Chat = (props: {
    socket: Socket,
    box: Box,
    berryCount: number,
    permissions: Array<Permission>,
    user: AuthSubject
}) => {
  const _chatRef = useRef(null);
  const {
    socket, box, berryCount, permissions, user,
  } = props;

  const welcomeMessage: FeedbackMessage = {
    contents: !box.options.berries
      ? 'Welcome to the box!'
      : 'Welcome to the box! Berries are enabled. To see the actions you can unlock, tap on your berry counter next to the chat input.',
    context: 'success',
    source: 'feedback',
    author: null,
    time: new Date(),
    scope: box._id,
  };

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignContent: 'flex-end',
      backgroundColor: colors.backgroundSecondaryAlternateColor,
    },
    messageList: {
      paddingTop: 0,
    },
    chatInput: {
      padding: 10,
      marginBottom: 5,
      height: 40,
      borderRadius: 5,
      flex: 1,
      backgroundColor: colors.backgroundChatColor,
      color: colors.textColor,
    },
    scrollButtonContainer: {
      padding: 7,
      borderRadius: 6,
      margin: 5,
      backgroundColor: colors.backgroundChatColor,
    },
    scrollButton: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const [messages, setMessages] = useState<Array<Message | FeedbackMessage | SystemMessage>>([welcomeMessage]);
  const [messageInput, setMessageInput] = useState('');
  const [hasNewMessages, setNewMessageAlert] = useState(false);
  const [isBerriesHelperShown, showBerriesHelper] = useState(false);
  const [isEmojiBoardShown, showEmojiBoard] = useState(false);

  // Auto Scroll. Use Effect cannot access the refreshed state of the auto scroll without having listener control
  // on the chat socket. useRef is the solution, since the hook has access to it.
  const [isAutoScrollEnabled, setAutoScroll] = useState(true);
  const autoScrollStateRef = useRef(isAutoScrollEnabled);
  useEffect(() => {
    autoScrollStateRef.current = isAutoScrollEnabled;
  }, [isAutoScrollEnabled]);

  useEffect(() => {
    // Connect to socket
    socket.on('chat', (newMessage: Message | FeedbackMessage | SystemMessage) => {
      // eslint-disable-next-line no-shadow
      if (newMessage.source !== 'feedback') {
        setMessages((messages) => [...messages, newMessage]);
      }

      if (autoScrollStateRef.current) {
        if (_chatRef && _chatRef.current) {
          setTimeout(() => _chatRef.current.scrollToEnd({ animated: true }), 200);
        }
      } else {
        setNewMessageAlert(true);
      }
    });
  }, []);

  const handleScroll = (nativeScrollEvent: NativeScrollEvent) => {
    const scrollPosition = nativeScrollEvent.layoutMeasurement.height
          + nativeScrollEvent.contentOffset.y;
    const autoScrollThreshold = nativeScrollEvent.contentSize.height - 20;

    setAutoScroll(scrollPosition >= autoScrollThreshold);
    if (scrollPosition >= autoScrollThreshold) {
      setNewMessageAlert(false);
    }
  };

  const scrollToBottom = () => {
    setAutoScroll(true);
    _chatRef.current.scrollToEnd({});
    setNewMessageAlert(false);
  };

  const sendMessage = () => {
    if (messageInput === '') {
      return;
    }

    const newMessage: Message = new Message({
      author: { _id: user._id },
      contents: messageInput,
      source: 'human',
      scope: box._id,
    });
    socket.emit('chat', newMessage);
    setMessageInput('');
  };

  const ResumeScrollButton = () => {
    if (hasNewMessages) {
      return (
        <Pressable
          onPress={() => scrollToBottom()}
          style={styles.scrollButtonContainer}
        >
          <View style={styles.scrollButton}>
            <DownIcon width={14} height={14} fill={colors.textColor} />
            <Text style={{ color: colors.textColor, marginLeft: 10, marginRight: 10 }}>
              New Messages
            </Text>
            <DownIcon width={14} height={14} fill={colors.textColor} />
          </View>
        </Pressable>
      );
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <ScrollView
        style={styles.messageList}
        ref={_chatRef}
        onScrollBeginDrag={() => setAutoScroll(false)}
        onScrollEndDrag={(e) => handleScroll(e.nativeEvent)}
      >
        {messages.map((message, index) => (
          <ChatMessage key={index.toString()} colorblindMode={user?.settings?.isColorblind} message={message} />
        ))}
      </ScrollView>
      <ResumeScrollButton />
      <View style={{ paddingHorizontal: 5 }}>
        {user && user.mail ? (
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Pressable style={{ flex: 0, justifyContent: 'center' }} onPress={() => showEmojiBoard(!isEmojiBoardShown)}>
              <Text style={{ fontSize: 20, paddingRight: 7 }}>😀</Text>
            </Pressable>
            <TextInput
              style={styles.chatInput}
              placeholder="Type to chat..."
              placeholderTextColor={colors.textSystemColor}
              onChangeText={(text) => setMessageInput(text)}
              value={messageInput}
              onSubmitEditing={() => sendMessage()}
            />
            {user && box?.options?.berries && box?.creator?._id !== user._id ? (
              <Pressable style={{ flex: 0, justifyContent: 'center' }} onPress={() => showBerriesHelper(!isBerriesHelperShown)}>
                <BerryCounter count={berryCount} />
              </Pressable>
            ) : null}
          </View>
        ) : (
          <View style={{ display: 'flex', height: 30 }}>
            <Text style={{ color: colors.textColor, textAlign: 'center' }}>Create an account or log in to chat with everyone!</Text>
          </View>
        )}
      </View>
      <Collapsible collapsed={!isBerriesHelperShown}>
        <BerryHelper box={box} permissions={permissions} />
      </Collapsible>
      <Collapsible collapsed={!isEmojiBoardShown}>
        <EmojiBoard
          selectedEmoji={(emoji) => console.log('EMOJI TO ADD: ', emoji)}
        />
      </Collapsible>
    </KeyboardAvoidingView>
  );
};

export default Chat;
