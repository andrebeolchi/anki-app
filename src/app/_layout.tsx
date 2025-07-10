import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect } from 'react';
import { Appearance, Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/use-color-scheme';
import { PortalHost } from '@rn-primitives/portal';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from '~/components/query-provider';

export { ErrorBoundary } from 'expo-router';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

const useSetAndroidNavigationBar = () => {
  useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? 'light');
  }, []);
}

const usePlatformSpecificSetup = Platform.select({
  android: useSetAndroidNavigationBar,
  default: () => { }
});

export default function RootLayout() {
  usePlatformSpecificSetup();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <GestureHandlerRootView>
        <QueryProvider>
          <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <Slot />
            <PortalHost />
          </ThemeProvider>
        </QueryProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}