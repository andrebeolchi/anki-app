import { TokenResponse } from "expo-auth-session";
import { LucideLogOut } from "lucide-react-native";
import { ActivityIndicator } from "react-native";

import { login, logout, refreshUserToken } from "~/interfaces/self-api/auth";

import { useStorage } from "~/components/storage";

import { Button } from "~/components/ui/button";

export interface Session {
  isLoading: boolean;
  needsRenewal: boolean;
  tokens?: TokenResponse;
  user?: Record<string, any>;
}

interface AuthProps {
  onSignIn?: () => void;
  onSignOut?: () => void;
  onError?: (_error?: any) => void;
}

export const useAuth = ({ onSignIn, onSignOut, onError }: AuthProps = {}) => {
  const [
    { user, tokens, isLoading, needsRenewal },
    { set: setSession, remove: removeSession },
  ] = useStorage<Session>("session", {
    isLoading: false,
    needsRenewal: false,
  });

  const sessionReset = async () => {
    await removeSession();
    onSignOut?.();
  };

  const signIn = async () => {
    await setSession((prev) => ({ ...prev, isLoading: true }));

    try {
      const session = await login();
      await setSession({ ...session, isLoading: false, needsRenewal: false });
      onSignIn?.();
    } catch (error: any) {
      onError?.(error);
      await setSession((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const signOut = async () => {
    await setSession((prev) => ({ ...prev, isLoading: true }));

    try {
      const isLoggedOut =
        tokens && (await logout({ token: tokens?.accessToken }));

      isLoggedOut && (await sessionReset());
    } catch {
      await setSession((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const refreshToken = async () => {
    if (!tokens) return;

    await setSession((prev) => ({ ...prev, isLoading: true }));

    try {
      const freshTokens = await refreshUserToken(tokens);
      await setSession((prev) => ({
        ...prev,
        tokens: freshTokens,
        isLoading: false,
      }));
    } catch (error) {
      await setSession((prev) => ({
        ...prev,
        needsRenewal: true,
        isLoading: false,
      }));
    }
  };

  return {
    signIn,
    signOut,
    refreshToken,
    sessionReset,
    needsRenewal,
    isLoading,
    user,
  };
};

export const LogoutButton = ({ onSignOut }: AuthProps) => {
  const { signOut, isLoading } = useAuth({ onSignOut });

  return (
    <Button
      className="flex-row gap-2 justify-center"
      size="icon"
      variant="ghost"
      onPress={signOut}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator className="color-foreground" />
      ) : (
        <>
          <LucideLogOut size={16} className="color-foreground" />
        </>
      )}
    </Button>
  );
};
