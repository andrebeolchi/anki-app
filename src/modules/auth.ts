import { useMutation } from "@tanstack/react-query";
import { useMMKVObject } from "react-native-mmkv";

import { queryClient, storage } from "~/components/query-provider";
import { removeAuthorizationHeader, setAuthorizationHeader } from "~/interfaces/sdk";
import { ILoginResponse, ISignupResponse, login, signup } from "~/interfaces/sdk/auth";
import { IAuthUser } from "~/models/users";

export const STORAGE_KEY = "auth-user";

interface ILoginOptions {
  onSuccess?: (data: ILoginResponse) => void;
  onError?: (error: unknown) => void;
}

export const useLogin = ({ onSuccess, onError }: ILoginOptions = {}) => useMutation({
  mutationFn: login,
  onSuccess: async (data: ILoginResponse) => {
    storage.set(STORAGE_KEY, JSON.stringify(data));
    setAuthorizationHeader(data.token);
    onSuccess && onSuccess?.(data);
  },
  onError: (error: unknown) => {
    onError && onError?.(error);
  },
})

interface ISignupOptions {
  onSuccess?: (data: ISignupResponse) => void;
  onError?: (error: unknown) => void;
}

export const useSignup = ({ onSuccess, onError, }: ISignupOptions = {}) => useMutation({
  mutationFn: signup,
  onSuccess: async (data: ISignupResponse) => {
    storage.set(STORAGE_KEY, JSON.stringify(data));
    setAuthorizationHeader(data.token);
    onSuccess && onSuccess?.(data);
  },
  onError: (error: unknown) => {
    onError && onError?.(error);
  },
})

export const useLogout = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => useMutation({
  mutationFn: async () => {
    removeAuthorizationHeader();
  },
  onSuccess: () => {
    storage.clearAll();
    queryClient.clear();
    onSuccess && onSuccess?.();
  },
  onError: (error: unknown) => {
    onError && onError?.(error);
  },
})

export const useGetAuthUser = () => {
  const [user] = useMMKVObject<IAuthUser>(STORAGE_KEY);

  return { data: user }
}