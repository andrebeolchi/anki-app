import { Tabs } from 'expo-router';
import { LucideHome } from 'lucide-react-native';
import React from 'react';
import { withClassName } from '~/lib/with-classname';

withClassName([LucideHome])

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <LucideHome size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}