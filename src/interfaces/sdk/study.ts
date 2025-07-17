import { fetch } from ".";

export interface IGetStudySessionParams {
  deckId: string;
}

export interface IStudySessionResponse {
  deck: {
    id: string;
    title: string;
    description: string | null;
    creator: {
      id: string;
      name: string;
    };
  };
  cards: Array<{
    id: string;
    question: string;
    answer: string;
    userCard: {
      id: string | null;
      nextReview: Date | null;
      progress: number | null;
    } | null;
  }>;
  stats: {
    totalCards: number;
    newCards: number;
    reviewCards: number;
  };
}

export const getStudySession = async (params: IGetStudySessionParams): Promise<IStudySessionResponse> => {
  const { data } = await fetch.get<IStudySessionResponse>(`/study/${params.deckId}`);

  return data;
}