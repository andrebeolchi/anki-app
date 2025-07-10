import * as React from 'react';
import { View } from 'react-native';
import { cn } from '~/lib/utils';

export const Skeleton = ({ className, ...props }: React.ComponentProps<typeof View>) => (
  <View className={cn('rounded-md bg-secondary dark:bg-muted animate-pulse', className)} {...props} />
)