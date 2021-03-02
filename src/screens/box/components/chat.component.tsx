import React, { useState, useEffect, useRef } from 'react';
import {
  TextInput, StyleSheet, KeyboardAvoidingView, View, NativeScrollEvent, Text, Pressable, ScrollView, BackHandler,
} from 'react-native';
import runes from 'runes2';

import {
  Message, FeedbackMessage, SystemMessage, Permission,
} from '@teamberry/muscadine';

import Collapsible from 'react-native-collapsible';
import { Socket } from 'socket.io-client';
import ChatMessage from './chat-message.component';
import DownIcon from '../../../../assets/icons/down-icon.svg';
import SendMessage from '../../../../assets/icons/send-message-icon.svg';
import EmojiBoard from '../../../components/EmojiBoard/emoji-board';
import EmojiIcon from '../../../../assets/icons/toggle-emoji-icon.svg';
import KeyboardIcon from '../../../../assets/icons/toggle-keyboard-icon.svg';

import Box from '../../../models/box.model';
import BerryCounter from './berry-counter.component';
import BerryHelper from './berry-helper.component';
import { useTheme } from '../../../shared/theme.context';
import { AuthSubject } from '../../../models/session.model';

const Chat = (props: {
    socket: Socket,
    box: Box,
    berryCount: number,
    permissions: Array<Permission>,
    user: AuthSubject
}) => {
  const _chatRef = useRef(null);
  const _chatInputRef = useRef(null);
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
    inputContainer: {
      marginBottom: 5,
      height: 40,
      borderRadius: 5,
      flex: 1,
      backgroundColor: colors.backgroundChatColor,
      display: 'flex',
      flexDirection: 'row',
    },
    chatInput: {
      padding: 10,
      flex: 1,
      color: colors.textColor,
    },
    emojiTogglerContainer: {
      paddingHorizontal: 7,
      justifyContent: 'center',
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
    sendMessageButton: {
      backgroundColor: '#009AEB',
      width: 40,
      height: 40,
      borderRadius: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
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

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isEmojiBoardShown || isBerriesHelperShown) {
        showBerriesHelper(false);
        showEmojiBoard(false);
        return true;
      }

      return false;
    });

    return () => backHandler.remove();
  }, [isBerriesHelperShown, isEmojiBoardShown]);

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

    if (_chatInputRef && _chatInputRef.current) {
      _chatInputRef.current.blur();
    }
    showEmojiBoard(false);
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

  const addEmojiToChat = (emoji: string) => {
    setMessageInput((value) => `${value}${emoji}`);
  };

  const shortBackspace = () => {
    setMessageInput((messageInput) => runes(messageInput).slice(0, -1).join(''));
  };

  const longBackspace = () => {
    setMessageInput('');
  };

  const toggleEmojiBoard = () => {
    showBerriesHelper(false);

    if (_chatInputRef && _chatInputRef.current) {
      if (isEmojiBoardShown) {
        _chatInputRef.current.focus();
      } else {
        _chatInputRef.current.blur();
      }
    }

    showEmojiBoard(!isEmojiBoardShown);
  };

  const toggleBerriesHelper = () => {
    showEmojiBoard(false);

    showBerriesHelper(!isBerriesHelperShown);
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
      {user && user.mail ? (
        <>
          <View style={{ display: 'flex', flexDirection: 'row', paddingHorizontal: 5 }}>
            {user && box?.options?.berries && box?.creator?._id !== user._id ? (
              <Pressable style={{ flex: 0, justifyContent: 'center', marginRight: 5 }} onPress={() => toggleBerriesHelper()}>
                <BerryCounter count={berryCount} />
              </Pressable>
            ) : null}
            <View style={styles.inputContainer}>
              <TextInput
                ref={_chatInputRef}
                style={styles.chatInput}
                placeholder="Type to chat..."
                placeholderTextColor={colors.textSystemColor}
                onChangeText={(text) => setMessageInput(text)}
                value={messageInput}
                onSubmitEditing={() => sendMessage()}
                onFocus={() => showEmojiBoard(false)}
              />
              <Pressable onPress={() => toggleEmojiBoard()} style={styles.emojiTogglerContainer}>
                {isEmojiBoardShown ? (
                  <KeyboardIcon height={20} width={20} fill={colors.textColor} />
                ) : (
                  <EmojiIcon height={20} width={20} fill={colors.textColor} />
                )}
              </Pressable>
            </View>
            { messageInput.length > 0 ? (
              <Pressable
                onPress={() => sendMessage()}
                style={styles.sendMessageButton}
              >
                <SendMessage width={20} height={20} fill={colors.textColor} />
              </Pressable>
            ) : null}
          </View>
          <Collapsible collapsed={!isBerriesHelperShown}>
            <BerryHelper box={box} permissions={permissions} />
          </Collapsible>
          <Collapsible collapsed={!isEmojiBoardShown}>
            <EmojiBoard
              selectedEmoji={addEmojiToChat}
              shortBackspace={shortBackspace}
              longBackspace={longBackspace}
            />
          </Collapsible>
        </>
      ) : (
        <View style={{ display: 'flex', height: 30, paddingHorizontal: 5 }}>
          <Text style={{ color: colors.textColor, textAlign: 'center' }}>Create an account or log in to chat with everyone!</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default Chat;
