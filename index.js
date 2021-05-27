import { AppRegistry, Platform } from 'react-native';
import './i18n';
import App from './App';

AppRegistry.registerComponent('cranberry', () => App);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('cranberry', { rootTag });
}
