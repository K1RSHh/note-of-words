import React, { useState } from "react";
import useWordStore from "../store/WordStore";
import type { TWordStatus } from "../types/word";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { CirclePlus, CircleX } from "lucide-react";

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
  const [context, setContext] = useState("");
  const [contextTranslate, setContextTranslate] = useState("");
  const [contextOpen, setContextOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [status, setStatus] = useState<TWordStatus>("unknown");

  const addWord = useWordStore((state) => state.addWord);
  const user = useWordStore((state) => state.user);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!showDropdown || original.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.datamuse.com/sug?s=${original}`,
        );
        const data: IDatamuseSuggestion[] = await response.json();
        setSuggestions(data.slice(0, 5).map((item) => item.word));
      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [original, showDropdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOriginal(e.target.value);
    setShowDropdown(true);
    setSelectedIndex(-1);
  };

  const selectWord = (word: string) => {
    const formatted = word.charAt(0).toUpperCase() + word.slice(1);
    setOriginal(formatted);
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    if (e.key === "Tab" || e.key === "Enter") {
      if (selectedIndex >= 0) {
        e.preventDefault();
        selectWord(suggestions[selectedIndex]);
      } else {
        setShowDropdown(false);
      }
    }

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Tab" || e.key === "Enter") {
      if (selectedIndex >= 0) {
        e.preventDefault();
        selectWord(suggestions[selectedIndex]);
        setSuggestions([]);
        setSelectedIndex(-1);
      }
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login");
    if (!original.trim() || !translation.trim()) return;

    const finalWord =
      original.trim().charAt(0).toUpperCase() + original.trim().slice(1);

    await addWord({
      original: finalWord,
      translation: translation.trim(),
      context: context,
      contextTranslate: contextTranslate,
      userId: user.uid,
      createdAt: Date.now(),
      progress: 0,
      status: status,
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
      <motion.form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleAdd}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        layout
        className="flex relative flex-col gap-4 p-6 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 w-full max-w-md"
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
            onChange={handleChange}
            placeholder="Start typing a word..."
            className="px-4 py-3 w-full rounded-2xl bg-neutral-800 text-white border border-neutral-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
          <motion.button
            type="button"
            onClick={() => setOriginal("")}
            whileHover={{ scale: 1.2, rotate: 90, color: "#cf1b1b" }}
            className="absolute right-2 top-1/4 cursor-pointer"
          >
            <X />
          </motion.button>
          <AnimatePresence>
            {showDropdown && suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 right-0 mt-2 bg-neutral-700 rounded-xl overflow-hidden shadow-2xl z-50 border border-neutral-600"
              >
                {suggestions.map((sug, index) => (
                  <li
                    key={sug}
                    onClick={() => selectWord(sug)}
                    className={`px-4 py-2 cursor-pointer first-letter:uppercase transition-colors ${
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

        <div className="relative">
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Translation"
            className="px-4 py-3 w-full rounded-2xl bg-neutral-800 text-white border border-neutral-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
          <motion.button
            type="button"
            onClick={() => setTranslation("")}
            whileHover={{ scale: 1.2, rotate: 90, color: "#cf1b1b" }}
            className="absolute right-2 top-1/4 cursor-pointer"
          >
            <X />
          </motion.button>
        </div>

        <motion.button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setContextOpen(!contextOpen);
          }}
          className="flex w-10 cursor-pointer"
          whileHover={{ scale: 1.1 }}
        >
          {contextOpen ? (
            <CircleX color="#d4d4d4" strokeWidth={2.5} />
          ) : (
            <CirclePlus color="#d4d4d4" strokeWidth={2.5} />
          )}
        </motion.button>
        <AnimatePresence>
          {contextOpen && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="relative">
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Context"
                  className="px-4 py-3 pr-7 w-full rounded-2xl bg-neutral-800 text-white border border-neutral-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                <motion.button
                  type="button"
                  onClick={() => setContext("")}
                  whileHover={{ scale: 1.2, rotate: 90, color: "#cf1b1b" }}
                  className="absolute right-2 top-1/4 cursor-pointer"
                >
                  <X />
                </motion.button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={contextTranslate}
                  onChange={(e) => setContextTranslate(e.target.value)}
                  placeholder="Context transition"
                  className="px-4 py-3 pr-7 w-full rounded-2xl bg-neutral-800 text-white border border-neutral-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                <motion.button
                  type="button"
                  onClick={() => setContextTranslate("")}
                  whileHover={{ scale: 1.2, rotate: 90, color: "#cf1b1b" }}
                  className="absolute right-2 top-1/4 cursor-pointer"
                >
                  <X />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-2">
          {(["unknown", "learning", "learned"] as TWordStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`flex-1 cursor-pointer py-2 rounded-xl text-xs font-bold transition-all ${
                status === s
                  ? "bg-blue-600 text-white ring-2 ring-blue-400"
                  : "bg-neutral-700 text-neutral-400 hover:bg-neutral-600"
              }`}
            >
              {s === "unknown"
                ? "Don't know"
                : s === "learning"
                  ? "Learning"
                  : "Learned"}
            </button>
          ))}
        </div>
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
      </motion.form>
    </div>
  );
};

export default AddWordForm;
