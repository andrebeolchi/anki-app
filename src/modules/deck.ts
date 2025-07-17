import { useMutation, useQuery } from "@tanstack/react-query";
import { createDeck, getDecks } from "~/interfaces/sdk/deck";

const QUERY_KEY = "decks";

export interface ICreateDeckOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: unknown) => void;
}

export const useCreateDeck = ({ onSuccess, onError }: ICreateDeckOptions = {}) => useMutation({
  mutationFn: createDeck,
  onSuccess: (data) => {
    onSuccess && onSuccess(data);
  },
  onError: (error: unknown) => {
    onError && onError(error);
  },
})

export interface IGetDecksOptions {
  status?: "public" | "private";
  creatorId?: string;
}

export const useGetDecks = ({ status, creatorId }: IGetDecksOptions = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY, { status, creatorId }],
    queryFn: () => getDecks({ status, creatorId }),
  })
}