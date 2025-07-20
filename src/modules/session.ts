import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "~/components/query-provider";
import { getStudySession, saveStudySession } from "~/interfaces/sdk/study";

const QUERY_KEY = "study-decks";

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
      queryClient.invalidateQueries({ queryKey: ['decks'] })
      options?.onSuccess?.();
    }
  })
}