import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';

import { Text } from '~/components/ui/text';

export default function NotFoundScreen() {
  return (
    <View className='justify-center flex-1 gap-6 p-safe-offset-6'>
      <View className='gap-3'>
        <Text className='text-3xl font-bold'>
          Oops! Essa página não existe.
        </Text>

        <Text className='text-muted-foreground'>
          A página que você está tentando acessar não existe ou foi removida.
        </Text>
      </View>


      <Link href='/' asChild>
        <Button>
          <Text>
            Voltar para a página inicial
          </Text>
        </Button>
      </Link>
    </View >
  );
}
