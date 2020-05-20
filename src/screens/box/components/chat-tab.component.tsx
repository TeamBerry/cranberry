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
  const [isAutoScrollEnabled, setAutoScroll] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      setUser(JSON.parse(await AsyncStorage.getItem('BBOX-user')));
    };

    getSession();
  }, []);

  useEffect(() => {
    props.socket.on('chat', (newMessage: Message | FeedbackMessage | SystemMessage) => {
      // eslint-disable-next-line no-shadow
      setMessages((messages) => [...messages, newMessage]);
      if (isAutoScrollEnabled) {
        setTimeout(() => _chatRef.current.scrollToEnd({}), 200);
      }
    });
  }, []);

  // TODO: If the scroll is at bottom, set auto scroll back to true
  const handleScroll = (nativeScrollEvent: NativeScrollEvent) => {
    console.log(nativeScrollEvent);
    setAutoScroll(true);
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
