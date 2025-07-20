import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "~/components/query-provider";
import {
  changeUserDeck,
  createUserDeck,
  getUserDecks,
} from "~/interfaces/sdk/user-deck";
import { QUERY_KEY as DECKS_QUERY_KEY } from "~/modules/deck";

export const QUERY_KEY = "user-decks";

export interface ICreateUserDeckOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: unknown) => void;
}

export const useCreateUserDeck = ({
  onSuccess,
  onError,
}: ICreateUserDeckOptions = {}) =>
  useMutation({
    mutationFn: createUserDeck,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [DECKS_QUERY_KEY] });
      onSuccess && onSuccess(data);
    },
    onError: (error: unknown) => {
      onError && onError(error);
    },
  });

export const useGetUserDecks = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => getUserDecks(),
  });
};

export const useChangeUserDeck = ({
  onSuccess,
  onError,
}: ICreateUserDeckOptions = {}) =>
  useMutation({
    mutationFn: changeUserDeck,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      onSuccess && onSuccess(data);
    },
    onError: (error: unknown) => {
      onError && onError(error);
    },
  });
