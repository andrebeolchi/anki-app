import { fetch } from ".";

export interface ICreateDeckPayload {
  title: string;
  status: "public" | "private";
  description?: string;

  cards: {
    question: string;
    answer: string;
  }[];
}

export interface ICreateDeckResponse {
  id: string;
  title: string;
  status: "public" | "private";
  description?: string;
  cards: {
    id: string;
    question: string;
    answer: string;
  }[];
}

export const createDeck = async (body: ICreateDeckPayload): Promise<ICreateDeckResponse> => {
  const { data } = await fetch.post("/decks", body);

  return data;
}