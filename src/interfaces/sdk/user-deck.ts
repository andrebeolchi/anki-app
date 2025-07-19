import { IUserDeck } from "~/models/user-deck";
import { fetch } from ".";
import { IDeck } from "~/models/deck";

export interface ICreateUserDeckPayload {
  userId: string;
  deckId: string;
}

export interface ICreateUserDeckResponse {}

export const createUserDeck = async (
  body: ICreateUserDeckPayload
): Promise<ICreateUserDeckResponse> => {
  const { data } = await fetch.post("/user-decks", body);

  return data;
};

export interface IGetUserDecksQuery {
  userId: string;
}

export interface IGetUserDecksResponse extends IDeck {
  cardsCount: number;
  enrollment: IUserDeck;
}

export const getUserDecks = async (): Promise<IGetUserDecksResponse[]> => {
  const { data } = await fetch.get("/user-decks");

  return data;
};

export interface IChangeUserDeckPayload {
  id: string;
  status: "active" | "archived";
}

export interface IChangeUserDeckResponse {}

export const changeUserDeck = async (
  body: IChangeUserDeckPayload
): Promise<IChangeUserDeckResponse> => {
  const { data } = await fetch.put("/user-decks", body);

  return data;
};
