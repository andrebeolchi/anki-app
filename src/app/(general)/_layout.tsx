import { Slot } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Header } from '~/components/kit/header';

export default function GeneralLayout() {
  return (
    <View className='flex-1 pt-0 bg-background pb-safe-offset-6 px-safe'>
      <Header />

      <View className='flex-1'>
        <Slot />
      </View>
    </View>
  );
}
