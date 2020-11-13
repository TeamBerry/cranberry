import React, { useState, useEffect, useRef } from 'react';
import {
  TextInput, StyleSheet, KeyboardAvoidingView, View, NativeScrollEvent, Text, Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import {
  Message, FeedbackMessage, SystemMessage, Permission,
} from '@teamberry/muscadine';

import Collapsible from 'react-native-collapsible';
import ChatMessage from './chat-message.component';

import DownIcon from '../../../../assets/icons/down-icon.svg';
import Box from '../../../models/box.model';
import BerryCounter from './berry-counter.component';
import BerryHelper from './berry-helper.component';
import { useTheme } from '../../../shared/theme.context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messageList: {
    paddingTop: 0,
  },
  chatInput: {
    padding: 10,
    marginBottom: 5,
    height: 40,
    borderColor: '#009AEB',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
  },
  scrollButtonContainer: {
    backgroundColor: '#3f3f3f',
    padding: 7,
    borderRadius: 6,
    margin: 5,
  },
  scrollButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ChatTab = (props: { socket: any, box: Box, berryCount: number, permissions:Array<Permission> }) => {
  const _chatRef = useRef(null);
  const {
    socket, box, berryCount, permissions,
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

  const [messages, setMessages] = useState([welcomeMessage] as Array<Message | FeedbackMessage | SystemMessage>);
  const [messageInput, setMessageInput] = useState('');
  const [user, setUser] = useState(null);
  const [hasNewMessages, setNewMessageAlert] = useState(false);
  const [isBerriesHelperShown, showBerriesHelper] = useState(false);

  // Auto Scroll. Use Effect cannot access the refreshed state of the auto scroll without having listener control
  // on the chat socket. useRef is the solution, since the hook has access to it.
  const [isAutoScrollEnabled, setAutoScroll] = useState(true);
  const autoScrollStateRef = useRef(isAutoScrollEnabled);
  useEffect(() => {
    autoScrollStateRef.current = isAutoScrollEnabled;
  }, [isAutoScrollEnabled]);

  useEffect(() => {
    const getSession = async () => {
      setUser(JSON.parse(await AsyncStorage.getItem('BBOX-user')));
    };

    getSession();

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
        <TouchableWithoutFeedback
          onPress={() => scrollToBottom()}
          style={styles.scrollButtonContainer}
        >
          <View style={styles.scrollButton}>
            <DownIcon width={14} height={14} fill="white" />
            <Text style={{
              color: colors.textColor, marginLeft: 10, marginRight: 10,
            }}
            >
              New Messages
            </Text>
            <DownIcon width={14} height={14} fill="white" />
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.backgroundSecondaryAlternateColor }]}
      behavior="padding"
    >
      <ScrollView
        style={styles.messageList}
        ref={_chatRef}
        onScrollBeginDrag={() => setAutoScroll(false)}
        onScrollEndDrag={(e) => handleScroll(e.nativeEvent)}
      >
        {messages.map((message, index) => (
          <ChatMessage key={index.toString()} message={message} />
        ))}
      </ScrollView>
      <ResumeScrollButton />
      <View style={{ paddingHorizontal: 5 }}>
        {user && user.mail ? (
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TextInput
              style={[styles.chatInput, { backgroundColor: colors.backgroundChatColor, color: colors.textColor }]}
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
    </KeyboardAvoidingView>
  );
};

export default ChatTab;
