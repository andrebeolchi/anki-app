import { Link } from 'expo-router';
import { LucideGlasses, LucidePlus } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { withClassName } from '~/lib/with-classname';
import { useGetDecks } from '~/modules/deck';

withClassName(LucidePlus)

export default function LibraryScreen() {
  const { data: decks } = useGetDecks({ status: 'public' })

  return (
    <View className='flex-1 gap-6 p-6'>
      {decks?.map((deck) => (
        <View key={deck.id} className='gap-3'>
          <View >
            <Text className='text-2xl font-semibold text-card-foreground'>
              {deck.title}
            </Text>
            <Text className='text-sm text-muted-foreground'>
              {deck.description}
            </Text>
          </View>

          <Link
            href={`/decks/${deck.id}`}
            asChild
          >
            <Button
              variant='outline'
              className='flex-row items-center gap-3'
            >
              <LucideGlasses size={16} />
              <Text className='text-card-foreground'>Estudar</Text>
            </Button>
          </Link>
        </View>
      ))}

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