import { Redirect } from 'expo-router'
import React, { useEffect } from 'react'

import { setAuthorizationHeader } from '~/interfaces/sdk'
import { useGetAuthUser } from '~/modules/auth'

export default function GeneralLayout() {
  const { data } = useGetAuthUser()

  useEffect(() => {
    data?.token && setAuthorizationHeader(data?.token);
  }, []);

  if (!data) {
    return <Redirect href='/login' />
  }

  return <Redirect href='/deck/1' />
}
