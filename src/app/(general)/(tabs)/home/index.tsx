import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';

export default function HomeScreen() {
  const deck = {
    id: 'deck123',
    title: 'Sample Deck',
    description: 'A sample deck of cards for demonstration purposes.',
  }

  return (
    <View className='flex-1 p-6'>
      <View>
        <Text className='text-2xl font-semibold text-card-foreground'>
          {deck.title}
        </Text>
        <Text className='text-sm text-muted-foreground'>
          {deck.description}
        </Text>
      </View>
    </View>
  );
}