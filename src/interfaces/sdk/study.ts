import { fetch } from ".";

export interface IGetStudySessionParams {
  deckId: string;
}

export interface IStudySessionUserCard {
  id: string | null;
  nextReview: Date | null;
  progress: number | null;
}

export interface IStudySessionCard {
  id: string;
  question: string;
  answer: string;
  userCard: IStudySessionUserCard | null;
}

export interface IStudySessionCreator {
  id: string;
  name: string;
}

export interface IStudySessionResponse {
  deck: {
    id: string;
    title: string;
    description: string | null;
    creator: IStudySessionCreator;
  };
  cards: IStudySessionCard[];
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

export interface ISaveStudySessionParams {
  deckId: string;
  answers: { cardId: string; isCorrect: boolean }[]
}

export const saveStudySession = async ({ deckId, ...body }: ISaveStudySessionParams): Promise<void> => {
  await fetch.post(`/study/${deckId}`, body)
}