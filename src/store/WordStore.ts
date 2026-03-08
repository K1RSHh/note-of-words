import { create } from "zustand";

export interface IWord {
  id: string;
  original: string;
  translation: string;
  userId: string;
  createdAt: number;
  progress: number;
  tags?: string[];
}

interface WordState {
  words: IWord[];
  addWord: (newWord: IWord) => void;
  clearWords: () => void;
}

const useWordStore = create<WordState>((set) => ({
  words: [],

  addWord: (newWord) =>
    set((state) => ({
      words: [newWord, ...state.words],
    })),

  clearWords: () => set({ words: [] }),
}));

export default useWordStore;
