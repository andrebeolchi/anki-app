import '~/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useLayoutEffect } from 'react';
import { Appearance, Platform } from 'react-native';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalHost } from '@rn-primitives/portal';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';

import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { QueryProvider } from '~/components/query-provider';
import { ToastProvider } from '~/components/kit/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import ptbr from "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale(ptbr);

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
  const { bottom, top } = useSafeAreaInsets()

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <GestureHandlerRootView>
        <KeyboardProvider>
          <QueryProvider>
            <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
              <Stack screenOptions={{ headerShown: false }} />
              <ToastProvider bottomOffset={bottom + 16} topOffset={top + 16} />
              <PortalHost />
            </ThemeProvider>
          </QueryProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ThemeProvider >
  );
}