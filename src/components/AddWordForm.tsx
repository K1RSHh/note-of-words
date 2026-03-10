import React, { useState } from "react";
import useWordStore from "../store/WordStore";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

interface AddWordFormProps {
  onClose: () => void;
}

interface IDatamuseSuggestion {
  word: string;
  score: number;
}

const AddWordForm = ({ onClose }: AddWordFormProps) => {
  const [original, setOriginal] = useState("");
  const [translation, setTranslation] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const addWord = useWordStore((state) => state.addWord);
  const user = useWordStore((state) => state.user);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (original.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.datamuse.com/sug?s=${original}`,
        );

        const data: IDatamuseSuggestion[] = await response.json();

        setSuggestions(data.slice(0, 5).map((item) => item.word));
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "API Error";
        console.error(message);
      }
    }, 300);

    //
    return () => clearTimeout(timer);
  }, [original]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Tab" || e.key === "Enter") {
      if (selectedIndex >= 0) {
        e.preventDefault();
        setOriginal(suggestions[selectedIndex]);
        setSuggestions([]);
        setSelectedIndex(-1);
      }
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login");
    if (!original.trim() || !translation.trim()) return;

    await addWord({
      original: original.trim(),
      translation: translation.trim(),
      userId: user.uid,
      createdAt: Date.now(),
      progress: 0,
    });

    onClose();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose(); //
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleAdd}
        className="flex relative flex-col gap-4 p-6 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 w-full max-w-md animate-in fade-in zoom-in duration-200"
      >
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold text-white">New word</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white cursor-pointer hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="relative">
          <input
            autoFocus
            type="text"
            value={original}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setOriginal(e.target.value);
              setSelectedIndex(-1);
            }}
            placeholder="Start typing a word..."
            className="px-4 py-3 w-full rounded-2xl bg-neutral-800 text-white border border-neutral-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 right-0 mt-2 bg-neutral-700 rounded-xl overflow-hidden shadow-2xl z-[60] border border-neutral-600"
              >
                {suggestions.map((sug, index) => (
                  <li
                    key={sug}
                    onClick={() => {
                      setOriginal(sug);
                      setSuggestions([]);
                    }}
                    className={`px-4 py-2 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? "bg-blue-600 text-white"
                        : "text-neutral-300 hover:bg-neutral-600"
                    }`}
                  >
                    {sug}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <input
          type="text"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder="Translation"
          className="px-4 py-3 rounded-2xl bg-neutral-800 text-white border border-neutral-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
        />

        <div className="flex gap-3 mt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 cursor-pointer font-semibold rounded-xl hover:bg-gray-100"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="flex-1 bg-blue-600 cursor-pointer text-white font-semibold py-3 rounded-xl hover:bg-blue-700"
          >
            Add
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddWordForm;
