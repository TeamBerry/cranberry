/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  BackHandler, NativeEventSubscription, Pressable,
} from 'react-native';
import Collapsible from 'react-native-collapsible';

type VideoListRowProps = {
    onRowPress: () => void,
    onRowOpen: () => void,
    onRowClose: () => void,
}

type VideoListRowState = {
    isOpen: boolean,
}

class VideoListRow extends Component<VideoListRowProps, VideoListRowState> {
    backHandler: NativeEventSubscription = null;

    constructor(props) {
      super(props);
      this.state = {
        isOpen: false,
      };
    }

    componentDidMount() {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (this.state.isOpen) {
          this.closeRow();
          return true;
        }
        return false;
      });
    }

    componentWillUnmount() {
      this.backHandler.remove();
    }

    onRowPress() {
      if (!this.state.isOpen) {
        this.openRow();
      } else {
        this.closeRow();
      }
    }

    openRow() {
      this.props.onRowOpen();
      this.setState({ isOpen: true });
    }

    closeRow() {
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
