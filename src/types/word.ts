export type TCreateWord = Omit<IWord, "id">;

export type TWordStatus = "unknown" | "learning" | "learned";

export interface IWord {
  id: string; // Document ID from Firebase
  original: string; // Word
  status: TWordStatus;
  translation: string; // Translation
  userId: string; // Acc
  createdAt: number; // Date of creation
  progress: number; // Progress in learning
  tags?: string[]; // Tags (optional)
}
