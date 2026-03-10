export interface IWord {
  id: string; // Document ID від Firebase
  original: string; // Слово
  translation: string; // Переклад
  userId: string; // Прив'язка до акаунту
  createdAt: number; // Дата створення
  progress: number; // Прогрес вивчення
  tags?: string[]; // Теги (опціонально)
}

export type TCreateWord = Omit<IWord, "id">;
