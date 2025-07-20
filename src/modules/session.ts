import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "~/components/query-provider";
import { getStudySession, saveStudySession } from "~/interfaces/sdk/study";

import { QUERY_KEY as DECKS_QUERY_KEY } from "./deck";
import { QUERY_KEY as USER_DECKS_QUERY_KEY } from "./user-decks";

export const QUERY_KEY = "study-decks";

export interface IGetDecksOptions { deckId: string; }

export const useGetStudySession = (options: IGetDecksOptions) => {
  return useQuery({
    queryKey: [QUERY_KEY, options],
    queryFn: () => getStudySession(options),
    staleTime: 0,
    gcTime: 0,
  })
}

export const useSaveStudySession = (options) => {
  return useMutation({
    ...options,
    mutationFn: saveStudySession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [DECKS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [USER_DECKS_QUERY_KEY] })
      options?.onSuccess?.();
    }
  })
}