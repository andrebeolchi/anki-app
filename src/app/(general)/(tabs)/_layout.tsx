import { Tabs } from 'expo-router';
import { LucideHome, LucideLibrarySquare } from 'lucide-react-native';
import React from 'react';
import { withClassName } from '~/lib/with-classname';

withClassName([LucideHome, LucideLibrarySquare])

export default function TabLayout() {
  return (
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
  );
}