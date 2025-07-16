import React from 'react'
import { useRouter } from 'expo-router'
import { LucideChevronLeft } from 'lucide-react-native'
import { View } from 'react-native'

import { Button } from '~/components/ui/button'
import { withClassName } from '~/lib/with-classname'

withClassName(LucideChevronLeft)

export const BackButton = () => {
  const router = useRouter()
  const goBack = () => router.canGoBack() && router.back()

  return (
    <View className="items-start">
      <Button variant="outline" size='icon' onPress={goBack}>
        <LucideChevronLeft size={16} className='text-foreground' />
      </Button>
    </View>
  )
}
