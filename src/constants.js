import {StyleSheet} from 'react-native';

// https://github.com/react-native-elements/react-native-elements/blob/next/src/config/colors.js
const originalColors = {
  primary: '#2089dc',
  secondary: '#8F0CE8',
  grey0: '#393e42',
  grey1: '#43484d',
  grey2: '#5e6977',
  grey3: '#86939e',
  grey4: '#bdc6cf',
  grey5: '#e1e8ee',
  greyOutline: '#bbb',
  searchBg: '#303337',
  success: '#52c41a',
  error: '#ff190c',
  warning: '#faad14',
  disabled: 'hsl(208, 8%, 90%)',
  // Darker color if hairlineWidth is not thin enough
  divider: StyleSheet.hairlineWidth < 1 ? '#bcbbc1' : 'rgba(0, 0, 0, 0.12)',
  platform: {
    ios: {
      primary: '#007aff',
      secondary: '#5856d6',
      success: '#4cd964',
      error: '#ff3b30',
      warning: '#ffcc00',
    },
    android: {
      primary: '#2196f3',
      secondary: '#9C27B0',
      success: '#4caf50',
      error: '#f44336',
      warning: '#ffeb3b',
    },
  },
};

// https://react-native-elements.github.io/react-native-elements/docs/customization
export const theme = {
  Button: {
    raised: true,
  },
  colors: {
    primary: '#749bff',
    secondary: '#efb3fc',
    // secondary: '#ee81df',
    muted: '#bdc6cf',
  },
};
