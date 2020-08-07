import React, { useState, useEffect, useRef } from 'react';
import {
  TextInput, StyleSheet, KeyboardAvoidingView, View, NativeScrollEvent, Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { Message, FeedbackMessage, SystemMessage } from '@teamberry/muscadine';

import ChatMessage from './chat-message.component';

import DownIcon from '../../../../assets/icons/down-icon.svg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
    justifyContent: 'space-between',
  },
  messageList: {
    paddingTop: 0,
    height: 352,
  },
  chatInput: {
    padding: 10,
    marginBottom: 5,
    height: 40,
    backgroundColor: '#303030',
    borderColor: '#009AEB',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    color: 'white',
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

const ChatTab = (props: { socket: any, boxToken: string }) => {
  const _chatRef = useRef(null);
  const { socket, boxToken } = props;

  const welcomeMessage: FeedbackMessage = {
    contents: 'Welcome to the box!',
    context: 'success',
    source: 'feedback',
    author: null,
    time: new Date(),
    scope: boxToken,
  };

  const [messages, setMessages] = useState([welcomeMessage] as Array<Message | FeedbackMessage | SystemMessage>);
  const [messageInput, setMessageInput] = useState('');
  const [user, setUser] = useState(null);
  const [hasNewMessages, setNewMessageAlert] = useState(false);

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
      setMessages((messages) => [...messages, newMessage]);

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
    const newMessage: Message = new Message({
      author: { _id: user._id },
      contents: messageInput,
      source: 'human',
      scope: boxToken,
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
              color: 'white', marginLeft: 10, marginRight: 10,
            }}
            >
              New Messages
            </Text>
            <DownIcon width={14} height={14} fill="white" />
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return <></>;
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
          <ChatMessage key={index.toString()} message={message} />
        ))}
      </ScrollView>
      <ResumeScrollButton />
      <View style={{ paddingHorizontal: 5 }}>
        <TextInput
          style={styles.chatInput}
          placeholder="Type to chat..."
          placeholderTextColor="#BBB"
          onChangeText={(text) => setMessageInput(text)}
          value={messageInput}
          onSubmitEditing={() => sendMessage()}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatTab;
