import React, { useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { Swiper } from '~/components/kit/card-swiper';
import { Text } from '~/components/ui/text';
import { MotiView } from 'moti';
import { Card, CardContent, CardDescription, CardTitle } from '~/components/ui/card';
import { useGetStudySession } from '~/modules/session';
import { useLocalSearchParams } from 'expo-router';
import { useNavigationOptions } from '~/lib/use-navigation-options';
import { Separator } from '~/components/ui/separator';

const cardDimensions = {
  width: Dimensions.get('window').width - 48,
  height: (Dimensions.get('window').width - 48),
}

const CardItem = ({ question, answer, isFlipped }: { question: string; answer: string; isFlipped: boolean }) => {
  return (
    <>
      <MotiView
        className='absolute'
        style={{ backfaceVisibility: 'hidden', height: cardDimensions.height, width: cardDimensions.width }}
        animate={{ rotateY: isFlipped ? '180deg' : '0deg' }}
      >
        <Card className='aspect-square'>
          <CardContent className='items-center justify-center flex-1 gap-6 pt-6'>
            <CardTitle>
              {question}
            </CardTitle>
          </CardContent>
        </Card>
      </MotiView>

      <MotiView
        style={{ backfaceVisibility: 'hidden', ...cardDimensions }}
        animate={{ rotateY: isFlipped ? '0deg' : '180deg' }}
      >
        <Card className='flex-1 aspect-square'>
          <CardContent className='items-center justify-center flex-1 gap-6 pt-6'>
            <CardDescription>
              {question}
            </CardDescription>

            <Separator />

            <CardTitle>
              {answer}
            </CardTitle>
          </CardContent>
        </Card>
      </MotiView>
    </>
  );
};

export default function DeckCardsScreen() {
  const params = useLocalSearchParams<{ id: string }>();

  const { data: session } = useGetStudySession({ deckId: params?.id });

  useNavigationOptions({ title: session?.deck.title || 'Sessão de Estudos' });

  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped((prev) => !prev);

  if (!session) {
    return (
      <View className='items-center justify-center flex-1'>
        <Text className='text-lg text-muted-foreground'>Loading...</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 p-6'>
      <Swiper
        items={session?.cards}
        renderItem={(item) => (
          <Pressable onPress={() => handleFlip()}>
            <CardItem {...item} isFlipped={isFlipped} />
          </Pressable>
        )}
        onSwipeLeft={(item) => console.log('Swiped left:', item)}
        onSwipeRight={(item) => console.log('Swiped right:', item)}
        swipeThresholdX={cardDimensions.width * 0.2}
        dimensions={cardDimensions}
      />
    </View>
  );
}