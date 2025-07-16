import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '~/components/kit/back-button';
import { Text } from '~/components/ui/text';

export default function DecksLayout() {
  const { bottom, left, right } = useSafeAreaInsets()

  return (
    <Stack
      screenOptions={{
        header: ({ options }) => (
          <View className="flex-row items-center gap-6 p-6 bg-background pt-safe-offset-6">
            <BackButton />

            <Text className='flex-1 text-xl font-medium text-center text-primary'>
              {options?.title}
            </Text>
            
            <View className='w-12'/>
          </View>
        ),
        contentStyle: {
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        },
      }}
    />
  );
}