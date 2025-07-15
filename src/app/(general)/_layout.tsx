import { Slot } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { AuthHeader } from '~/components/kit/auth-header';

export default function GeneralLayout() {
  return (
    <View className='flex-1 bg-background'>
      <AuthHeader />

      <View className='flex-1'>
        <Slot />
      </View>
    </View>
  );
}
