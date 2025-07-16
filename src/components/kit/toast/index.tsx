import React from 'react'

import * as Haptics from 'expo-haptics'
import { LucideCheckCircle2, LucideCircleAlert, LucideCircleX, LucideInfo, LucideProps } from 'lucide-react-native'
import { ForwardRefExoticComponent, ReactNode } from 'react'
import { Text, View } from 'react-native'
import ToastPrimitive, { ToastProps, ToastShowParams } from 'react-native-toast-message'

import { withClassName } from '~/lib/with-classname'

type Icon = ForwardRefExoticComponent<LucideProps>

interface ToastPropsProps {
  icon?: Icon
  disableHaptics?: boolean
  children?: ReactNode
}

interface ToastOptionsWithProps extends ToastShowParams {
  props: ToastPropsProps
}

interface BaseComponentProps extends Omit<ToastShowParams, 'props'>, ToastPropsProps {
  text1?: string
  text2?: string
  children?: ReactNode
}

const BaseToastIcon = ({ name: Icon }: { name: Icon }) => {
  withClassName(Icon)

  return <Icon size={24} className='text-card-foreground' />
}

const BaseToast = ({ icon, text1, text2, children }: BaseComponentProps) => (
  <View className="flex-row items-center w-10/12 gap-4 p-4 border rounded-md shadow bg-background border-border shadow-black/10">
    {icon && <BaseToastIcon name={icon} />}

    {!!(text1 || text2) && (
      <View className="flex-col flex-1 gap-1">
        {text1 && <Text className="flex-1 font-medium text-card-foreground">{text1}</Text>}
        {text2 && <Text className="flex-1 text-sm text-muted-foreground">{text2}</Text>}
      </View>
    )}

    {children}
  </View>
)

const ToastAdapter = ({ props, ...rest }: ToastOptionsWithProps) => <BaseToast {...rest} {...props} />

const toastConfig = {
  custom: ToastAdapter,
  success: ToastAdapter,
  error: ToastAdapter,
  warning: ToastAdapter,
  info: ToastAdapter,
}

export const ToastProvider = (props: ToastProps) => <ToastPrimitive {...props} position="bottom" config={toastConfig} />

export const toast = {
  ...ToastPrimitive,

  show: (params: ToastOptionsWithProps): void => {
    const toastType = params.type as keyof typeof toast

    if (toastType === 'custom') {
      return toast.custom(params.props.children, params)
    }

    if (toast?.[toastType] && params?.type !== 'show') {
      const standardType = toastType as 'success' | 'error' | 'info' | 'warning'
      return toast[standardType](params?.text1 ?? '', params)
    }

    return ToastPrimitive.show(params)
  },

  success: (text: string, { icon = LucideCheckCircle2, ...props }: BaseComponentProps = {}) =>
    ToastPrimitive.show({
      type: 'success',
      text1: text,
      onShow: () => !props?.disableHaptics && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
      props: {
        ...props,
        icon,
      },
    }),

  error: (text: string, { icon = LucideCircleX, ...props }: BaseComponentProps = {}) =>
    ToastPrimitive.show({
      type: 'error',
      text1: text,
      onShow: () => !props?.disableHaptics && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
      props: {
        ...props,
        icon,
      },
    }),

  warning: (text: string, { icon = LucideCircleAlert, ...props }: BaseComponentProps = {}) =>
    ToastPrimitive.show({
      type: 'warning',
      text1: text,
      onShow: () => !props?.disableHaptics && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
      props: {
        ...props,
        icon,
      },
    }),

  info: (text: string, { icon = LucideInfo, ...props }: BaseComponentProps = {}) =>
    ToastPrimitive.show({
      type: 'info',
      text1: text,
      onShow: () => !props?.disableHaptics && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
      props: {
        ...props,
        icon,
      },
    }),

  custom: (children: ReactNode, options?: ToastOptionsWithProps) =>
    ToastPrimitive.show({
      ...options,
      type: 'custom',
      onShow: () => !options?.props?.disableHaptics && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
      props: {
        ...options?.props,
        children,
      },
    }),
}
