import React from 'react'
import { Control, Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form'
import { View } from 'react-native'

import { cn } from '~/lib/utils'

import { Label } from '~/components/ui/label'
import { Skeleton } from '~/components/ui/skeleton'


type FormFieldProps<T extends FieldValues, K extends FieldPath<T>> = {
  label: string
  name: K
  isLoading?: boolean
  control: Control<T>
  render: ControllerProps<T, K>['render']
  skeletonClassName?: string
}

export const FormField = <T extends FieldValues, K extends FieldPath<T>>({
  label,
  name,
  isLoading,
  control,
  render,
  skeletonClassName = 'h-12',
}: FormFieldProps<T, K>) => (
  <View className="gap-1">
    <Label>{label}</Label>

    {isLoading && <Skeleton className={cn('h-12', skeletonClassName)} />}

    {!isLoading && <Controller control={control} name={name} render={render} />}
  </View>
)
