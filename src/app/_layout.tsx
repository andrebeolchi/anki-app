import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect } from "react";
import { Appearance, Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/use-color-scheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryProvider } from "~/components/query-provider";
import { StorageProvider } from "~/components/storage";
import { verifyToken } from "~/interfaces/self-api/auth";
import { storage } from "~/components/storage/adapters/mmkv";

export { ErrorBoundary } from "expo-router";

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
    setAndroidNavigationBar(Appearance.getColorScheme() ?? "light");
  }, []);
};

const usePlatformSpecificSetup = Platform.select({
  android: useSetAndroidNavigationBar,
  default: () => {},
});

const Storage = ({ children }: { children: React.ReactNode }) => {
  const onLoadPersistedData = async (data: Record<string, any>) => {
    const isValidToken = await verifyToken(data.session?.tokens?.accessToken);

    return {
      ...data,
      session: {
        ...(isValidToken && data.session),
        isLoading: false,
      },
    };
  };

  const onRehydrate = async () => {
    SplashScreen.hideAsync();
  };

  return (
    <StorageProvider
      adapter={storage({ id: "storage" })}
      onLoadPersistedData={onLoadPersistedData}
      onRehydrate={onRehydrate}
    >
      {children}
    </StorageProvider>
  );
};

export default function RootLayout() {
  usePlatformSpecificSetup();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Storage>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <GestureHandlerRootView>
          <QueryProvider>
            <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
              <Slot />
              <PortalHost />
            </ThemeProvider>
          </QueryProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </Storage>
  );
}
