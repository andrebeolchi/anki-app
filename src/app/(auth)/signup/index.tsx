import { Link, useRouter } from 'expo-router';
import { Eye, EyeClosed } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { withClassName } from '~/lib/with-classname';

import { useSignup } from '~/modules/auth';

[Eye, EyeClosed].forEach(withClassName)

export default function SignupScreen() {
  const router = useRouter()
  const { mutateAsync, status } = useSignup()

  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')


  const [hidePassword, setHidePassword] = useState<boolean>(true)
  const HidePasswordIcon = hidePassword ? Eye : EyeClosed

  const handleSignup = async () => {
    try {
      await mutateAsync({ email, name, password })
      router.navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View className='items-center justify-center flex-1 gap-6 p-safe-offset-6 bg-muted'>
      <View className='w-full p-6 border rounded-lg bg-background border-border gap-9'>
        <View>
          <Text className='text-3xl font-bold text-center text-primary'>
            Tinnki
          </Text>
          <Text className='text-lg text-center text-muted-foreground'>
            Crie uma nova conta
          </Text>
        </View>

        <View className='gap-3'>
          <View className='gap-1'>
            <Label>Nome</Label>
            <Input
              autoComplete='name'
              autoCapitalize='none'
              onChangeText={setName}
            />
          </View>

          <View className='gap-1'>
            <Label>Email</Label>
            <Input
              keyboardType='email-address'
              autoCapitalize='none'
              onChangeText={setEmail}
            />
          </View>

          <View className='gap-1'>
            <Label>Senha</Label>

            <View>
              <Input
                onChangeText={setPassword}
                autoCapitalize='none'
                secureTextEntry={hidePassword}
                className='pr-12'
              />
              <Pressable
                className='absolute -translate-y-1/2 right-4 top-1/2'
                onPress={() => setHidePassword(!hidePassword)}
              >
                <HidePasswordIcon className='text-muted-foreground' size={24} />
              </Pressable>
            </View>
          </View>
        </View>

        <View className='gap-3'>
          <Button
            onPress={handleSignup}
            disabled={!email || !password || status === 'pending'}
          >
            {status === 'pending' && (
              <ActivityIndicator size={16} />
            )}

            {status !== 'pending' && (
              <Text>
                Cadastrar
              </Text>
            )}
          </Button>

          <View className='items-center'>
            <Link asChild href='/login'>
              <Text>
                Já tem uma conta? <Text className='underline'>Entrar</Text>
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </View >
  );
}
