import { Redirect } from "expo-router";

import { useAuth } from "~/components/auth";

import SignInScreen from "./(anon)/sign-in";

export default function GeneralLayout() {
  const { user } = useAuth();

  console.log(user);

  if (!user) {
    return <SignInScreen />;
  }

  return <Redirect href="/deck/1" />;
}
