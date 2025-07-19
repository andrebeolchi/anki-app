export interface IUserDeck {
  id: string;
  userId: string;
  deckId: string;

  currentStreak?: number;
  maxStreak?: number;
  lastStudyAt: Date | null;
  status?: "active" | "archived";

  createdAt?: Date;
  updatedAt?: Date;
}
