import { Tabs } from 'expo-router';
import { LucideHome, LucideLibrarySquare } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { AuthHeader } from '~/components/kit/auth-header';
import { useNavigationOptions } from '~/lib/use-navigation-options';
import { withClassName } from '~/lib/with-classname';

withClassName([LucideHome, LucideLibrarySquare])

export default function TabLayout() {
  useNavigationOptions({
    headerShown: false,
  })

  return (
    <View className='flex-1 bg-background'>
      <AuthHeader />

      <View className='flex-1'>
        <Tabs screenOptions={{ headerShown: false }}>
          <Tabs.Screen
            name="home/index"
            options={{
              title: 'Início',
              tabBarIcon: (props) => <LucideHome {...props} />,
            }}
          />

          <Tabs.Screen
            name="library/index"
            options={{
              title: 'Biblioteca',
              tabBarIcon: (props) => <LucideLibrarySquare {...props} />,
            }}
          />
        </Tabs>
      </View>
    </View >
  );
}