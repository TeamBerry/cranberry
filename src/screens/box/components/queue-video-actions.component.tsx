import { Permission, QueueItem } from '@teamberry/muscadine';
import React, { useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import BxButtonComponent, { ButtonOptions } from '../../../components/bx-button.component';

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

  const PlayNextButton = () => {
    const type = item.setToNext ? 'play' : 'forceNext';
    let text = '10 $BC$';
    let context: ButtonOptions['context'] = 'berries';

    if (permissions.includes('forceNext')) {
      context = 'primary';
      if (item.setToNext) {
        text = 'Later';
      } else {
        text = 'Next';
      }
    }

    return (
      <BxButtonComponent
        options={{
          type,
          text,
          textDisplay: 'full',
          context,
        }}
        onPress={() => playNext()}
      />
    );
  };

  return (
    <View style={{
      display: 'flex', flexDirection: 'row', alignContent: 'center', paddingVertical: 10, justifyContent: 'space-around',
    }}
    >
      {(item.startTime !== null && item.endTime === null) ? (
        <>
          {permissions.includes('skipVideo') || berriesEnabled ? (
            <BxButtonComponent
              options={{
                type: 'skip',
                text: permissions.includes('skipVideo') ? 'Skip' : '20 $BC$',
                textDisplay: 'full',
                context: permissions.includes('skipVideo') ? 'primary' : 'berries',
              }}
              onPress={() => skip()}
            />
          ) : null}
        </>
      ) : (
        <>
          {!deletionConfirmationShown ? (
            <>
              {permissions.includes('forceNext') || berriesEnabled ? (
                <PlayNextButton />
              ) : null}
              {permissions.includes('forcePlay') || berriesEnabled ? (
                <BxButtonComponent
                  options={{
                    type: 'forcePlay',
                    text: permissions.includes('forcePlay') ? 'Now' : '30 $BC$',
                    textDisplay: 'full',
                    context: permissions.includes('forcePlay') ? 'primary' : 'berries',
                  }}
                  onPress={() => playNow()}
                />
              ) : null}
            </>
          ) : null}
          {permissions.includes('removeVideo') ? (
            <>
              {deletionConfirmationShown ? (
                <BxButtonComponent
                  options={{
                    type: 'play',
                    text: 'Cancel deletion',
                    textDisplay: 'full',
                    context: 'primary',
                  }}
                  onPress={() => showDeletionConfirmation(false)}
                />
              ) : null}
              <BxButtonComponent
                options={{
                  type: 'cancel',
                  text: deletionConfirmationShown ? 'Tap again to confirm' : 'Remove',
                  textDisplay: 'full',
                  context: 'danger',
                }}
                onPress={() => removeVideo()}
              />
            </>
          ) : null}
        </>
      )}
    </View>
  );
};

const isEqual = (prevProps: {
    item: QueueItem,
    boxToken: string,
    permissions: Array<Permission>,
    berriesEnabled: boolean
}, nextProps: {
    item: QueueItem,
    boxToken: string,
    permissions: Array<Permission>,
    berriesEnabled: boolean
}) => (
  prevProps.item.setToNext === nextProps.item.setToNext
        && prevProps.item.startTime === nextProps.item.startTime
        && prevProps.item.stateForcedWithBerries === nextProps.item.stateForcedWithBerries
        && prevProps.permissions === nextProps.permissions
        && prevProps.berriesEnabled === nextProps.berriesEnabled
);

export default React.memo(QueueVideoActions, isEqual);
