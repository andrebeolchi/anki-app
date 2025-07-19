import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "~/components/query-provider";
import { createDeck, getDecks } from "~/interfaces/sdk/deck";

export const QUERY_KEY = "decks";

export interface ICreateDeckOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: unknown) => void;
}

export const useCreateDeck = ({
  onSuccess,
  onError,
}: ICreateDeckOptions = {}) =>
  useMutation({
    mutationFn: createDeck,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      onSuccess && onSuccess(data);
    },
    onError: (error: unknown) => {
      onError && onError(error);
    },
  });

export interface IGetDecksOptions {
  status?: "public" | "private";
  creatorId?: string;
}

export const useGetDecks = ({ status, creatorId }: IGetDecksOptions = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY, { status, creatorId }],
    queryFn: () => getDecks({ status, creatorId }),
  });
};
