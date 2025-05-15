// App.js
import React from 'react';
import { StyleSheet, ImageBackground, StatusBar } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import GalleryScreen from './screens/GalleryScreen';
import PicturesScreen from './screens/PicturesScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TransparentNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',    // make the nav container transparent
  },
};

export default function App() {
  return (
    <ImageBackground
      source={require('./assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <NavigationContainer theme={TransparentNavTheme}>
        <Tab.Navigator
          // keep each screen's view transparent
          sceneContainerStyle={{ backgroundColor: 'transparent' }}
          screenOptions={{
            headerTitleAlign: 'center',
            // reserve header space but make it see‑through
            headerStyle: {
              backgroundColor: 'transparent',
              elevation: 0,         // remove Android shadow
              shadowOpacity: 0,     // remove iOS shadow
            },
            headerTitleStyle: { 
              color: '#fff',
              fontSize: 28,
              fontWeight: 'bold',
            },

            // make the bottom tabs see‑through
            tabBarStyle: {
              backgroundColor: 'transparent',
              position: 'absolute',
              borderTopWidth: 0,
              elevation: 0,
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#ddd',
          }}
        >
          <Tab.Screen
            name="Gallery"
            component={GalleryScreen}
            options={{ title: 'Movie Manager' }}
          />
          <Tab.Screen
            name="Pictures"
            component={PicturesScreen}
            options={{ title: 'Pictures' }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
