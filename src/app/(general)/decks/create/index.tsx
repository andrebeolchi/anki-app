import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';

import z from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '~/components/kit/form-field';
import { Textarea } from '~/components/ui/textarea';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { LucidePlus, LucideTrash2 } from 'lucide-react-native';
import { withClassName } from '~/lib/with-classname';
import { ActivityIndicator, TextInput, View } from 'react-native';
import { Switch } from '~/components/ui/switch';
import { toast } from '~/components/kit/toast';
import { focusAfterRender } from '~/lib/focus-after-render';
import { useNavigationOptions } from '~/lib/use-navigation-options';
import { useCreateDeck } from '~/modules/deck';
import { useRouter } from 'expo-router';

withClassName([LucidePlus, LucideTrash2]);

const cardsSchema = z.object({
  question: z.string().min(1, 'A pergunta é obrigatória'),
  answer: z.string().min(1, 'A resposta é obrigatória'),
})

const createDeckFormSchema = z.object({
  title: z.string({ error: 'O título é obrigatório' }).min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  status: z.enum(['public', 'private']),
  cards: z.array(cardsSchema).min(1, 'O baralho deve conter pelo menos uma carta'),
})

type TCreateDeckForm = z.infer<typeof createDeckFormSchema>;

export default function CreateDeckScreen() {
  const router = useRouter();
  useNavigationOptions({ title: 'Criar Baralho' })

  const { control, watch, handleSubmit } = useForm<TCreateDeckForm>({
    resolver: zodResolver(createDeckFormSchema),
    defaultValues: {
      status: 'private',
    }
  })

  const cards = useFieldArray({
    control,
    name: 'cards',
    rules: {
      minLength: 1,
      required: true,
      validate: (value) => value.every(card => card.question && card.answer)
    },
  })

  const questionRefs = useRef<(TextInput | null)[]>([]);
  const answerRefs = useRef<(TextInput | null)[]>([]);

  const prependNewCard = () => {
    if (cards?.fields?.length === 0) {
      cards.append({ question: '', answer: '' });
      return
    }

    const lastCard = watch(`cards.0`);

    const isQuestionEmpty = !lastCard?.question?.trim();
    const isAnswerEmpty = !lastCard?.answer?.trim();

    if (isQuestionEmpty) {
      toast.warning('Preencha a pergunta antes de adicionar um novo cartão.');
      return focusAfterRender(questionRefs.current[0]);
    }

    if (isAnswerEmpty && !isQuestionEmpty) {
      toast.warning('Preencha a resposta antes de adicionar um novo cartão.');
      return focusAfterRender(answerRefs.current[0]);
    }

    cards.prepend({ question: '', answer: '' });
  };

  const { mutateAsync, status } = useCreateDeck({
    onSuccess: () => {
      toast.success('Baralho criado com sucesso!');
      router?.canGoBack() ? router.back() : router.push('/');
    },
    onError: (error) => {
      toast.error(error?.message || 'Erro ao criar o baralho');
    },
  })

  const onFormSubmit = (data: TCreateDeckForm) => mutateAsync(data)

  const onFormError = (errors: any) => {
    const allIssues = Object.values(errors).flatMap((field: any) => {
      if (field?.message) return [field.message];
      if (Array.isArray(field)) return field.map((f: any) => f?.message);
      return [];
    });

    toast.error(allIssues[0] || 'Erro ao criar o baralho');
  };

  return (
    <View className='flex-1'>
      <KeyboardAwareScrollView
        ScrollViewComponent={ScrollView}
        className='bg-muted'
        contentContainerClassName='p-6 gap-6'
      >
        <Card>
          <CardHeader>
            <CardTitle>
              Detalhes do Baralho
            </CardTitle>

            <CardDescription>
              Forneça um título e descrição para o seu novo baralho de flashcards.
            </CardDescription>
          </CardHeader>

          <CardContent className="gap-6">
            <FormField
              control={control}
              name="title"
              label="Título"
              render={({ field: { onChange, value, ...props } }) => (
                <Input
                  {...props}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <FormField
              control={control}
              name="description"
              label="Descrição"
              render={({ field: { value, onBlur, onChange } }) => (
                <Textarea
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
            />

            <FormField
              control={control}
              name="status"
              label="Status"
              render={({ field: { value, onChange } }) => (
                <View className='flex-row items-center gap-3'>
                  <Text className='flex-1 text-muted-foreground'>
                    Permitir que outros estudem este baralho
                  </Text>

                  <Switch
                    checked={value === 'public'}
                    onCheckedChange={(checked) => onChange(checked ? 'public' : 'private')}
                  />
                </View>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex-row items-center justify-between'>
            <CardTitle>
              Cartões ({cards.fields.length})
            </CardTitle>
            <Button
              variant="outline"
              className='flex-row items-center gap-3'
              onPress={() => prependNewCard()}
            >
              <LucidePlus size={20} className='text-muted-foreground' />
              <Text>Adicionar Cartão</Text>
            </Button>
          </CardHeader>

          <CardContent className='gap-6'>
            {cards.fields?.map((card, index) => (
              <View
                key={card.id}
                className='gap-6 p-3 border rounded-md border-border bg-card'
              >
                <View className='flex-row items-center justify-between gap-3'>
                  <Text className='flex-1 text-lg font-semibold' numberOfLines={1}>
                    {card.question || 'Rascunho'}
                  </Text>

                  {cards?.fields?.length > 1 && (
                    <Button
                      size="icon"
                      variant="destructive"
                      onPress={() => cards.remove(index)}
                    >
                      <LucideTrash2 size={18} className='text-destructive-foreground' />
                    </Button>
                  )}
                </View>

                <FormField
                  control={control}
                  name={`cards.${index}.question`}
                  label="Pergunta"
                  render={({ field: { value, onBlur, onChange, ...props } }) => (
                    <Textarea
                      {...props}
                      autoFocus={cards?.fields?.length > 1 && index === 0}
                      ref={(ref) => questionRefs.current[index] = ref}
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                    />
                  )}
                />

                <FormField
                  control={control}
                  name={`cards.${index}.answer`}
                  label="Resposta"
                  render={({ field: { value, onBlur, onChange, ...props } }) => (
                    <Textarea
                      {...props}
                      ref={(ref) => answerRefs.current[index] = ref}
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                    />
                  )}
                />
              </View>
            ))}
          </CardContent>
        </Card>
      </KeyboardAwareScrollView>

      <View className='gap-3 p-6 border-t border-border bg-card'>
        <Button
          onPress={handleSubmit(onFormSubmit, onFormError)}
        >
          {status === 'pending' && <ActivityIndicator />}
          {status !== 'pending' && <Text>Salvar Baralho</Text>}
        </Button>

        <Text className='text-xs text-center text-muted-foreground'>
          Após salvar, você poderá editar o baralho a qualquer momento.
        </Text>
      </View>
    </View>
  );
}
