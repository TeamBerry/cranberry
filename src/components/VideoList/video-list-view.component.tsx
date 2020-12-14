/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React, { PureComponent, ReactElement } from 'react';
import { FlatList, FlatListProps } from 'react-native';
import VideoListRow from './video-list-row.component';

type VideoListViewProps = {
    onRowOpen?: (key, rows) => void,
    onRowClose?: (key, rows) => void,
    renderItem: (rowData, rowMap) => ReactElement,
    renderHiddenItem: (rowData, rowMap) => ReactElement
}

class VideoListView extends PureComponent<VideoListViewProps & FlatListProps<any>, {}> {
    openRowKey = null;

    _rows = {};

    componentDidUpdate() {
      this.closeAllRows();
    }

    onRowOpen(key) {
      if (this.openRowKey && this.openRowKey !== key) {
        this.closeUniqueRow();
      }
      this.openRowKey = key;
    }

    onRowPress() {
      if (this.openRowKey) {
        this.closeUniqueRow();
        this.openRowKey = null;
      }
    }

    closeAllRows() {
      Object.keys(this._rows).forEach((rowKey) => {
        if (this._rows[rowKey]) {
          this._rows[rowKey].closeRow();
        }
      });
    }

    closeUniqueRow() {
      const rowRef = this._rows[this.openRowKey];
      if (rowRef && rowRef.closeRow) {
        this._rows[this.openRowKey].closeRow();
      }
    }

    renderItem(rowData, rowMap) {
      const VisibleComponent = this.props.renderItem(rowData, rowMap);
      const HiddenComponent = this.props.renderHiddenItem && this.props.renderHiddenItem(rowData, rowMap);
      const { item } = rowData;
      const key = item._id;

      return (
        <VideoListRow
          ref={(row) => { this._rows[key] = row; }}
          onRowPress={() => this.onRowPress()}
          onRowOpen={() => this.onRowOpen(key)}
          onRowClose={() => this.props.onRowClose && this.props.onRowClose(key, this._rows)}
        >
          {VisibleComponent}
          {HiddenComponent}
        </VideoListRow>
      );
    }

    render() {
      return (
        <FlatList
          {...this.props}
          renderItem={(item) => this.renderItem(item, item.index)}
        />
      );
    }
}

export default VideoListView;
