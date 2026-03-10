import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";

export interface IWord {
  id: string;
  original: string;
  translation: string;
  userId: string;
  createdAt: number;
  progress: number;
  tags?: string[];
}

type SortType = "latest" | "alphabet";

interface WordState {
  words: IWord[];
  removeWord: (id: string) => void;
  sortType: SortType;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addWord: (newWord: IWord) => void;
  setSortType: (type: SortType) => void;
  clearWords: () => void;
}

const useWordStore = create<WordState>()(
  persist(
    (set, get) => ({
      words: [],
      sortType: "latest",
      searchTerm: "",

      addWord: (newWord) => {
        const isDuplicate = get().words.some(
          (word) =>
            word.original.toLowerCase() === newWord.original.toLowerCase(),
        );

        if (isDuplicate) {
          toast.error(`"${newWord.original}" already on the list`, {
            style: {
              borderRadius: "12px",
              background: "#333",
              color: "#fff",
            },
          });
          return;
        }

        set((state) => ({
          words: [newWord, ...state.words],
        }));

        toast.success("Word added!");
      },

      setSearchTerm: (term) => set({ searchTerm: term }),

      removeWord: (id) => {
        set({ words: get().words.filter((word) => word.id !== id) });
        toast.success("Word deleted");
      },

      setSortType: (type) => set({ sortType: type }),

      clearWords: () => set({ words: [] }),
    }),
    {
      name: "words-storage",
    },
  ),
);

export default useWordStore;
