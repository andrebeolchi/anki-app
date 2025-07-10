import { LucideLogIn } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';
import { withClassName } from '~/lib/with-classname';

withClassName(LucideLogIn);

export const greetings = () => {
  const hour = new Date().getHours();

  if (hour < 6) return 'Boa madrugada';
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  if (hour < 24) return 'Boa noite';

  return 'Olá';
}

export const Header = () => {
  return (
    <View className='flex-row items-center justify-center p-6 border-b bg-background border-b-border pt-safe-offset-6'>
      <View className='flex-1'>
        <Text className='text-xl font-bold'>
          {greetings()}
        </Text>
      </View>
    </View>
  );
}