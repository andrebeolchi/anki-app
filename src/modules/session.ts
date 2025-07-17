import { useQuery } from "@tanstack/react-query";
import { getStudySession } from "~/interfaces/sdk/study";

const QUERY_KEY = "study-decks";

export interface IGetDecksOptions { deckId: string; }

export const useGetStudySession = (options: IGetDecksOptions) => {
  return useQuery({
    queryKey: [QUERY_KEY, options],
    queryFn: () => getStudySession(options),
  })
}