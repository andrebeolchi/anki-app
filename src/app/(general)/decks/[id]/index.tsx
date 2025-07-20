import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LucideArrowLeftFromLine, LucideArrowRightFromLine, LucideCheck, LucideUndo2, LucideX } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Pressable,
  View
} from 'react-native';
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list';
import z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Skeleton } from '~/components/ui/skeleton';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { IStudySessionCard } from '~/interfaces/sdk/study';
import { useNavigationOptions } from '~/lib/use-navigation-options';
import { withClassName } from '~/lib/with-classname';
import { useGetStudySession, useSaveStudySession } from '~/modules/session';
import * as Haptics from 'expo-haptics';
import { toast } from '~/components/kit/toast';

withClassName([
  LucideArrowLeftFromLine,
  LucideArrowRightFromLine,
  LucideCheck,
  LucideUndo2,
  LucideX
])

cssInterop(Swiper, {
  cardClassName: {
    target: 'cardStyle'
  },
  flippedCardClassName: {
    target: 'flippedCardStyle'
  },
  regularCardClassName: {
    target: 'regularCardStyle',
  },
  overlayLabelContainerClassName: {
    target: 'overlayLabelContainerStyle'
  }
});


const FrontCard = ({ question }: IStudySessionCard) => (
  <Card className='w-full h-full'>
    <CardContent className="items-center justify-center flex-1 gap-6 pt-6">
      <CardTitle>{question}</CardTitle>
    </CardContent>
  </Card>
)

const BackCard = ({ question, answer }: IStudySessionCard) => {
  return (
    <Card className='w-full h-full'>
      <CardContent className="items-center justify-center flex-1 gap-6 pt-6">
        <CardDescription>{question}</CardDescription>
        <Separator />
        <CardTitle>{answer}</CardTitle>
      </CardContent>

      <CardFooter className="flex flex-row items-center justify-between gap-6 px-4 py-3">
        <View className='flex-row items-center gap-3'>
          <LucideArrowLeftFromLine className="text-muted-foreground" size={16} />
          <Text className="text-xs text-muted-foreground">Errei</Text>
        </View>

        <Separator orientation="vertical" />

        <View className='flex-row items-center gap-3'>
          <Text className="text-xs text-muted-foreground">Acertei</Text>
          <LucideArrowRightFromLine className="text-muted-foreground" size={16} />
        </View>
      </CardFooter>
    </Card >
  );
};

const EmptyState = () => (
  <View className='items-center justify-center flex-1 p-6'>
    <Skeleton className='flex-[8] w-full h-full border border-border' />

    <View className='flex-[2] flex-row items-center justify-between w-full'>
      <View className='p-6 transition-colors border rounded-full border-border bg-card'>
        <LucideX size={24} />
      </View>

      <View className='p-6 transition-colors border rounded-full border-border bg-card'>
        <LucideUndo2 size={24} />
      </View>

      <View className='p-6 transition-colors border rounded-full border-border bg-card'>
        <LucideCheck size={24} />
      </View>
    </View>
  </View>
)

const answerSchema = z.object({
  cardId: z.string(),
  isCorrect: z.boolean()
});

const schema = z.object({
  deckId: z.string(),
  answers: z.record(z.string(), answerSchema)
})

type FormType = z.infer<typeof schema>;

export default function DeckCardsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: session } = useGetStudySession({ deckId: params?.id });

  const [isEndReached, setIsEndReached] = useState<boolean>(false)

  const { setValue, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      deckId: params.id,
      answers: {}
    }
  })

  useEffect(() => {
    setIsEndReached(false);
  }, [session]);

  useNavigationOptions({
    title: session?.deck.title || 'Sessão de Estudos'
  });

  const ref = useRef<SwiperCardRefType>();

  const renderCard = useCallback((card: IStudySessionCard) => <FrontCard {...card} />, []);
  const renderFlippedCard = useCallback((card: IStudySessionCard) => <BackCard {...card} />, []);

  const handleWrongAnswer = useCallback((card: IStudySessionCard) => {
    setValue(`answers.${card.id}`, { cardId: card.id, isCorrect: false });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, [setValue]);

  const handleCorrectAnswer = useCallback((card: IStudySessionCard) => {
    setValue(`answers.${card.id}`, { cardId: card.id, isCorrect: true });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [setValue]);

  const { mutate } = useSaveStudySession({
    onSuccess: () => {
      toast.success("Sessão de estudos salva com sucesso!");
      router.canGoBack() ? router.back() : router.push('/');
    },
    onError: (error) => {
      onSubmitError(error);
    }
  })

  const onSubmit = (data: FormType) => {
    const answers = Object.values(data.answers)

    if (!data.answers || answers.length === 0) {
      toast.error("Você precisa responder pelo menos um cartão.");
      return;
    }

    mutate({
      deckId: data.deckId,
      answers
    });
  }

  const onSubmitError = (error: any) => {
    toast.error("Erro ao salvar sessão de estudos. Tente novamente.");
    console.log(error)
  };

  if (!session) {
    return (
      <EmptyState />
    );
  }

  return (
    <View className='items-center justify-center flex-1 gap-6 p-6'>
      <View className='w-full'>
        <Button onPress={handleSubmit(onSubmit, onSubmitError)}>
          <Text>
            Finalizar estudo
          </Text>
        </Button>
      </View>

      <View className='flex-[8] items-center justify-center'>
        <Swiper
          ref={ref}
          data={session?.cards || []}
          keyExtractor={(item) => item.id}
          cardClassName="w-full h-full"
          renderCard={renderCard}
          onPress={() => ref.current?.flipCard()}
          onSwipedAll={() => setIsEndReached(true)}
          FlippedContent={renderFlippedCard}
          onSwipeRight={(cardIndex) => handleCorrectAnswer(session?.cards[cardIndex])}
          onSwipeLeft={(cardIndex) => handleWrongAnswer(session?.cards[cardIndex])}
          prerenderItems={10}
          disableBottomSwipe
          disableTopSwipe
        />

        {isEndReached && (
          <Text className='absolute -z-10'>
            Não há mais cartões para estudar.
          </Text>
        )}
      </View>

      <View className='flex-[2] flex-row items-center justify-between w-full'>
        <Pressable
          className='p-6 transition-colors border rounded-full border-border bg-card active:bg-destructive group/button'
          onPress={() => ref.current?.swipeLeft()}
        >
          <LucideX size={24} className='group-hover/button:text-destructive-foreground' />
        </Pressable>

        <Pressable
          className='p-6 transition-colors border rounded-full border-border bg-card active:bg-blue-500 group/button'
          onPress={() => ref.current?.swipeBack()}
        >
          <LucideUndo2 size={24} className='group-hover/button:text-black' />
        </Pressable>

        <Pressable
          className='p-6 transition-colors border rounded-full border-border bg-card active:bg-green-500 group/button'
          onPress={() => ref.current?.swipeRight()}
        >
          <LucideCheck size={24} className='group-hover/button:text-black' />
        </Pressable>
      </View>
    </View>
  );
};