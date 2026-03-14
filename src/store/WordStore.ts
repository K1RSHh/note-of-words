import { create } from "zustand";
import { db, auth } from "../firebase"; // Твій конфіг Firebase
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { type User as FirebaseUser } from "firebase/auth"; //
import { toast } from "react-hot-toast";
import type { IWord, TCreateWord, TWordStatus } from "../types/word"; //

type SortType = "latest" | "alphabet";

interface WordState {
  words: IWord[];
  user: FirebaseUser | null;
  loading: boolean;
  sortType: SortType;
  searchTerm: string;
  filterStatus: TWordStatus | "all";

  initAuth: () => () => void;
  updateWord: (id: string, updates: Partial<IWord>) => Promise<void>;
  setFilterStatus: (status: TWordStatus | "all") => void;

  setSortType: (type: SortType) => void;
  setSearchTerm: (term: string) => void;
  setUser: (user: FirebaseUser | null) => void;
  toggleWordStatus: (id: string) => void;

  // Cloud Actions
  subscribeToWords: (userId: string) => () => void;
  addWord: (wordData: TCreateWord) => Promise<void>;
  removeWord: (id: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const useWordStore = create<WordState>((set, get) => ({
  words: [],
  user: null,
  loading: false,
  sortType: "latest",
  searchTerm: "",
  filterStatus: "all",

  setSortType: (type) => set({ sortType: type }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setUser: (user) => set({ user }),

  setFilterStatus: (status) => set({ filterStatus: status }),

  toggleWordStatus: async (id: string) => {
    const { words } = get();
    const wordToUpdate = words.find((w) => w.id === id);

    if (!wordToUpdate) return;

    const statuses: IWord["status"][] = ["unknown", "learning", "learned"];
    const currentIndex = statuses.indexOf(wordToUpdate.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
      const wordRef = doc(db, "words", id);
      await updateDoc(wordRef, {
        status: nextStatus,
      });

      set((state) => ({
        words: state.words.map((w) =>
          w.id === id ? { ...w, status: nextStatus } : w,
        ),
      }));
      toast.success("Status updated!");
    } catch (error) {
      console.error(error);
    }
  },

  updateWord: async (id, updates) => {
    try {
      const wordRef = doc(db, "words", id);
      await updateDoc(wordRef, updates);
      toast.success("Updated!");
    } catch {
      toast.error("Update failed");
    }
  },

  initAuth: () => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      set({ user: firebaseUser });

      if (firebaseUser) {
        get().subscribeToWords(firebaseUser.uid);
      } else {
        // If it worked, clear the list
        set({ words: [] });
      }
    });
  },

  subscribeToWords: (userId) => {
    set({ loading: true });
    // Query: only words from this user
    const q = query(collection(db, "words"), where("userId", "==", userId));

    return onSnapshot(q, (snapshot) => {
      const wordsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IWord[];

      set({ words: wordsData, loading: false });
    });
  },

  // Adding a word with duplicate check
  addWord: async (wordData) => {
    const isDuplicate = get().words.some(
      (w) => w.original.toLowerCase() === wordData.original.toLowerCase(),
    );

    if (isDuplicate) {
      toast.error(`"${wordData.original}" already on your list`);
      return;
    }

    try {
      await addDoc(collection(db, "words"), wordData);
      toast.success("The word is recorded");
    } catch {
      toast.error(`Error saving`);
    }
  },

  // Deleting a word
  removeWord: async (id) => {
    try {
      await deleteDoc(doc(db, "words", id));
      toast.success("Word successfully deleted");
    } catch {
      toast.error("Unable to delete word");
    }
  },

  // Logging out of your account
  logOut: async () => {
    try {
      await signOut(auth);
      set({ words: [], user: null }); // Clear the page after exit
      toast.success("You have successfully logged out of your account.");
    } catch {
      toast.error("Error during exit");
    }
  },
}));

export default useWordStore;
