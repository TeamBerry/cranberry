import React from 'react';
import {
  LogBox,
} from 'react-native';
import { Provider } from 'react-redux';
import { enableScreens } from 'react-native-screens';
// eslint-disable-next-line import/extensions
import store from './src/redux/store';

import Root from './src/Root';
import { ThemeProvider } from './src/shared/theme.context';

enableScreens();

export default function App() {
  LogBox.ignoreAllLogs();

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </Provider>
  );
}
