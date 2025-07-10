import React, { useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { Swiper } from '~/components/kit/card-swiper';
import { Text } from '~/components/ui/text';
import { MotiView } from 'moti';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

const cardDimensions = {
  width: Dimensions.get('window').width - 48,
  height: (Dimensions.get('window').width - 48),
}

const cards = [
  { question: 'What is the capital of France?', answer: 'Paris.' },
  { question: 'What is the largest planet?', answer: 'Jupiter.' },
  { question: 'Who wrote "To Kill a Mockingbird"?', answer: 'Harper Lee.' },
  { question: 'Boiling point of water?', answer: '100°C at sea level.' },
];

const CardS = ({ children }: { children: React.ReactNode }) => (
  <View className='items-center justify-center w-full gap-3 p-6 border rounded-md bg-card border-border aspect-square'>
    {children}
  </View>
);

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
          <CardHeader>
            <CardDescription>
              {question}
            </CardDescription>
          </CardHeader>

          <CardContent className='items-center justify-center flex-1 gap-6 pt-6'>
            <CardTitle className='text-center'>
              {answer}
            </CardTitle>
          </CardContent>
        </Card>
      </MotiView>
    </>
  );
};

export default function DeckCardsScreen() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped((prev) => !prev);

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

      <Swiper
        items={cards}
        renderItem={(item) => (
          <Pressable onPress={() => handleFlip()}>
            <CardItem {...item} isFlipped={isFlipped} />
          </Pressable>
        )}
        onSwipeLeft={(item) => console.log('Swiped left:', item)}
        onSwipeRight={(item) => console.log('Swiped right:', item)}
        swipeThresholdX={0.1}
        swipeThresholdY={0.1}
        dimensions={cardDimensions}
      />
    </View>
  );
}