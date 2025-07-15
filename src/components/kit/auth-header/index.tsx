import { useRouter } from 'expo-router';
import { LucideLogOut } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { Text } from '~/components/ui/text';
import { withClassName } from '~/lib/with-classname';
import { useGetAuthUser, useLogout } from '~/modules/auth';

withClassName(LucideLogOut);

export const greetings = () => {
  const hour = new Date().getHours();

  if (hour < 6) return 'Boa madrugada,';
  if (hour < 12) return 'Bom dia,';
  if (hour < 18) return 'Boa tarde,';
  if (hour < 24) return 'Boa noite,';

  return 'Olá,';
}

export const AuthHeader = () => {
  const router = useRouter();
  const { data: user } = useGetAuthUser();

  const { mutateAsync, status } = useLogout({
    onSuccess: () => {
      router.navigate('/');
    }
  });

  const handleLogout = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      console.log(error);
    }
  }

  const LogoutIcon = status === 'pending' ? ActivityIndicator : LucideLogOut;

  return (
    <View className='flex-row items-center justify-center p-6 border-b bg-background border-b-border pt-safe-offset-6'>
      <View className='flex-1'>
        <Text className='text-sm'>
          {greetings()}
        </Text>

        <Text className='font-bold' numberOfLines={1}>
          {user?.name}
        </Text>
      </View>

      <Pressable
        onPress={() => handleLogout()}
        disabled={status === 'pending'}
      >
        <LogoutIcon size={20} className='text-primary' />
      </Pressable>
    </View>
  );
}