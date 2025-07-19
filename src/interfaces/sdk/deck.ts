import { IDeck } from "~/models/deck";
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

export const createDeck = async (
  body: ICreateDeckPayload
): Promise<ICreateDeckResponse> => {
  const { data } = await fetch.post("/decks", body);

  return data;
};

export interface IGetDecksQuery {
  status?: "public" | "private";
  creatorId?: string;
}

export interface IGetDecksResponse extends IDeck {
  id: string;
  title: string;
  status: "public" | "private";
  description?: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  cardsCount: number;
  enrolled: boolean;
}

export const getDecks = async (
  query?: IGetDecksQuery
): Promise<IGetDecksResponse[]> => {
  const { data } = await fetch.get("/decks", { params: query });

  return data;
};
