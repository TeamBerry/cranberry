import { Permission, QueueItem } from '@teamberry/muscadine';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import BxButtonComponent from '../../../components/bx-button.component';

const QueueVideoActions = (props: {
    item: QueueItem,
    boxToken: string,
    permissions: Array<Permission>,
    berriesEnabled: boolean
}) => {
  const {
    item, boxToken, permissions, berriesEnabled,
  } = props;
  const [deletionConfirmationShown, showDeletionConfirmation] = useState(false);

  const playNext = () => {
    axios.put(`${Config.API_URL}/boxes/${boxToken}/queue/${item._id}/next`);
  };

  const playNow = () => {
    axios.put(`${Config.API_URL}/boxes/${boxToken}/queue/${item._id}/now`);
  };

  const skip = () => {
    axios.put(`${Config.API_URL}/boxes/${boxToken}/queue/skip`);
  };

  const removeVideo = () => {
    if (!deletionConfirmationShown) {
      showDeletionConfirmation(true);
    } else {
      axios.delete(`${Config.API_URL}/boxes/${boxToken}/queue/${item._id}`);
    }
  };

  return (
    <View style={{
      display: 'flex', flexDirection: 'row', alignContent: 'center', paddingVertical: 10, justifyContent: 'space-around',
    }}
    >
      {(item.startTime !== null && item.endTime === null) ? (
        <>
          {permissions.includes('skipVideo') || berriesEnabled ? (
            <Pressable onPress={() => skip()}>
              <BxButtonComponent options={{
                type: 'skip',
                text: permissions.includes('skipVideo') ? 'Skip' : '20 $BC$',
                textDisplay: 'full',
                context: permissions.includes('forcePlay') ? 'primary' : 'berries',
              }}
              />
            </Pressable>
          ) : null}
        </>
      ) : (
        <>
          {!deletionConfirmationShown ? (
            <>
              {permissions.includes('forceNext') || berriesEnabled ? (
                <Pressable onPress={() => playNext()}>
                  <BxButtonComponent options={{
                    type: 'forceNext',
                    text: permissions.includes('forceNext') ? 'Next' : '10 $BC$',
                    textDisplay: 'full',
                    context: permissions.includes('forceNext') ? 'primary' : 'berries',
                  }}
                  />
                </Pressable>
              ) : null}
              {permissions.includes('forcePlay') || berriesEnabled ? (
                <Pressable onPress={() => playNow()}>
                  <BxButtonComponent options={{
                    type: 'forcePlay',
                    text: permissions.includes('forcePlay') ? 'Now' : '30 $BC$',
                    textDisplay: 'full',
                    context: permissions.includes('forcePlay') ? 'primary' : 'berries',
                  }}
                  />
                </Pressable>
              ) : null}
            </>
          ) : null}
          {permissions.includes('removeVideo') ? (
            <>
              {deletionConfirmationShown ? (
                <Pressable onPress={() => showDeletionConfirmation(false)}>
                  <BxButtonComponent options={{
                    type: 'play',
                    text: 'Cancel deletion',
                    textDisplay: 'full',
                    context: 'primary',
                  }}
                  />
                </Pressable>
              ) : null}
              <Pressable onPress={() => removeVideo()}>
                <BxButtonComponent options={{
                  type: 'cancel',
                  text: deletionConfirmationShown ? 'Tap again to confirm' : 'Remove',
                  textDisplay: 'full',
                  context: 'danger',
                }}
                />
              </Pressable>
            </>
          ) : null}
        </>
      )}
    </View>
  );
};

export default QueueVideoActions;
