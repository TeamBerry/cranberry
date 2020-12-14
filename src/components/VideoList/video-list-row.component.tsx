/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Pressable } from 'react-native';
import Collapsible from 'react-native-collapsible';

type VideoListRowProps = {
    onRowPress: () => void,
    onRowOpen: () => void,
    onRowDidOpen: () => void,
    onRowClose: () => void,
    onRowDidClose: () => void,
}

type VideoListRowState = {
    isOpen: boolean,
}

class VideoListRow extends Component<VideoListRowProps, VideoListRowState> {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  onRowPress() {
    if (!this.state.isOpen) {
      this.openRow();
    } else {
      this.closeRow();
    }
  }

  openRow() {
    console.log('Opening Row');
    this.props.onRowOpen();
    this.setState({ isOpen: true });
  }

  closeRow() {
    console.log('Closing Row');
    this.props.onRowClose();
    this.setState({ isOpen: false });
  }

  render() {
    return (
      <Pressable
        android_ripple={{ color: '#4d4d4d' }}
        onPress={() => { this.onRowPress(); }}
      >
        {React.cloneElement(this.props.children[0], {
          ...this.props.children[0].props,
        })}
        <Collapsible
          collapsed={!this.state.isOpen}
        >
          {React.cloneElement(this.props.children[1], {
            ...this.props.children[1].props,
          })}
        </Collapsible>
      </Pressable>
    );
  }
}

export default VideoListRow;
