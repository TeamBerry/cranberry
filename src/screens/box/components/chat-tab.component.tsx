import React, { useState, useEffect, useRef } from 'react';
import {
  TextInput, StyleSheet, KeyboardAvoidingView, View, NativeScrollEvent,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

import { Message, FeedbackMessage, SystemMessage } from '@teamberry/muscadine';

import ChatMessage from './chat-message.component';

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
});

const ChatTab = (props: { socket: any, boxToken: string }) => {
  const _chatRef = useRef(null);

  const welcomeMessage: FeedbackMessage = {
    contents: 'Welcome to the box!',
    context: 'success',
    source: 'feedback',
    author: null,
    time: new Date(),
    scope: props.boxToken,
  };

  const [messages, setMessages] = useState([welcomeMessage] as Array<Message | FeedbackMessage | SystemMessage>);
  const [messageInput, setMessageInput] = useState('');
  const [user, setUser] = useState(null);

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
    props.socket.on('chat', (newMessage: Message | FeedbackMessage | SystemMessage) => {
      // eslint-disable-next-line no-shadow
      setMessages((messages) => [...messages, newMessage]);

      if (autoScrollStateRef.current) {
        setTimeout(() => _chatRef.current.scrollToEnd({}), 200);
      }
    });
  }, []);

  const handleScroll = (nativeScrollEvent: NativeScrollEvent) => {
    const scrollPosition = nativeScrollEvent.layoutMeasurement.height
          + nativeScrollEvent.contentOffset.y;
    const autoScrollThreshold = nativeScrollEvent.contentSize.height - 20;

    setAutoScroll(scrollPosition >= autoScrollThreshold);
  };

  const sendMessage = () => {
    const newMessage: Message = new Message({
      author: user._id,
      contents: messageInput,
      source: 'human',
      scope: props.boxToken,
    });
    props.socket.emit('chat', newMessage);
    setMessageInput('');
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
          <ChatMessage key={index} message={message} />
        ))}
      </ScrollView>
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
