import { Link } from 'expo-router';
import { LucidePlus } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '~/components/ui/text';
import { withClassName } from '~/lib/with-classname';

withClassName(LucidePlus)

export default function LibraryScreen() {
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

      <Link
        href="/decks/create"
        asChild
      >
        <Pressable className='absolute p-6 rounded-full bottom-6 right-6 bg-primary'>
          <LucidePlus size={24} className='text-primary-foreground' />
        </Pressable>
      </Link>
    </View>
  );
}