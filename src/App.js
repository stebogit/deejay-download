import React from 'react';
import Calendar from './components/screens/Calendar';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ThemeProvider} from 'react-native-elements';
// https://oblador.github.io/react-native-vector-icons/
import {theme} from './constants';
import {StyleSheet} from 'react-native';
import Logo from './components/Logo';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <Stack.Navigator initialRouteName="Episodes">
          <Stack.Screen
            name="Episodes"
            options={{
              headerRight: (props) => <Logo {...props} containerStyle={styles.logo} />,
            }}
            component={Calendar}
          />
        </Stack.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  logo: {
    marginRight: 18,
  },
});
