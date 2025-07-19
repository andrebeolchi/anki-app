export interface IDeck {
  id?: string;
  creatorId: string;
  title: string;
  description?: string | null;
  status: "public" | "private";

  createdAt?: Date;
  updatedAt?: Date;
}
