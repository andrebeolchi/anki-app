import { Slot } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { AuthHeader } from '~/components/kit/auth-header';

export default function GeneralLayout() {
  return (
    <View className='flex-1 pt-0 bg-background pb-safe-offset-6 px-safe'>
      <AuthHeader />

      <View className='flex-1'>
        <Slot />
      </View>
    </View>
  );
}
