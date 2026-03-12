import useWordStore from "../store/WordStore";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, Search, ListFilter } from "lucide-react";
import WordFilters from "./WordFilters";
import EditWordModal from "./EditWordModal";
import type { IWord } from "../types/word";

function WordList() {
  const {
    words,
    removeWord,
    sortType,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
  } = useWordStore();

  const [editingWord, setEditingWord] = useState<IWord | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);

  const statusColors = {
    learned: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]",
    learning: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]",
    unknown: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
  };

  // 1. Filtering: we check both the original and the translation
  const filteredWords = words.filter((w) => {
    const matchesSearch = w.original
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || w.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // 2. Sorting an already filtered list
  const sortedWords = [...filteredWords].sort((a, b) => {
    if (sortType === "alphabet") return a.original.localeCompare(b.original);
    return b.createdAt - a.createdAt;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative flex flex-col">
      {/* Search field */}

      <div className="flex relative justify-between items-center mb-4 font-bold">
        <p className="text-neutral-500">Found: {sortedWords.length}</p>
        <div className="relative w-2/3">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search for a word..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-neutral-100 rounded-2xl focus:border-blue-500 outline-none transition-all text-black shadow-sm"
          />
        </div>
        <WordFilters />
        <div className="relative z-50 flex items-center justify-center">
          <div
            className="relative flex flex-col items-center justify-center"
            ref={filterRef}
          >
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer mx-4 flex text-neutral-400 hover:text-blue-600 transition-colors"
            >
              <ListFilter />
            </motion.button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, x: "-50%" }} // Анімація з урахуванням центрування
                  animate={{ opacity: 1, y: 0, x: "-50%" }}
                  exit={{ opacity: 0, y: 10, x: "-50%" }}
                  /* Центрування: left-1/2 та -translate-x-1/2 */
                  className="absolute mt-2 left-1/2 top-10 bg-neutral-800 p-3 rounded-2xl shadow-xl z-50 border border-neutral-700 min-w-37.5"
                >
                  <div className="flex flex-col gap-1">
                    {(["all", "unknown", "learning", "learned"] as const).map(
                      (s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setFilterStatus(s);
                            setIsOpen(false); // Закриваємо після вибору
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all text-left ${
                            filterStatus === s
                              ? "bg-blue-600 text-white"
                              : "bg-transparent text-neutral-300 hover:bg-neutral-700"
                          }`}
                        >
                          {s === "all" ? (
                            "All Words"
                          ) : s === "unknown" ? (
                            <div className="flex items-center gap-3">
                              <p>Don't know</p>
                              <div
                                className={`w-3 h-3 left-9 rounded-full mr-4 shrink-0 transition-all duration-300 ${statusColors.unknown}`}
                              ></div>
                            </div>
                          ) : s === "learning" ? (
                            <div className="flex items-center gap-3">
                              <p>learning</p>
                              <div
                                className={`w-3 h-3 left-9 rounded-full mr-4 shrink-0 transition-all duration-300 ${statusColors.learning}`}
                              ></div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <p>Learned</p>
                              <div
                                className={`w-3 h-3 left-9 rounded-full mr-4 shrink-0 transition-all duration-300 ${statusColors.learned}`}
                              ></div>
                            </div>
                          )}
                        </button>
                      ),
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Table header */}
      <div className="flex text-2xl font-bold p-4 bg-neutral-200 rounded-t-2xl text-black border-b-2 border-neutral-300">
        <p className="w-1/2 mr-4">Word</p>
        <p className="w-1/2 ml-4">Translation</p>
      </div>

      <div className="flex flex-col bg-neutral-100 shadow-xl rounded-b-2xl overflow-hidden">
        <AnimatePresence mode="popLayout">
          {sortedWords.map((word) => (
            <motion.div
              key={word.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="text-black text-xl flex border-b border-neutral-200 h-full text-center bg-white hover:bg-blue-50 transition-colors"
            >
              <div className="w-1/2 flex items-center border-r border-neutral-200 p-4 overflow-hidden">
                {/* Наш кольоровий індикатор */}
                <div
                  className={`w-3 h-3 absolute left-9 rounded-full mr-4 shrink-0 transition-all duration-300 ${
                    statusColors[word.status as keyof typeof statusColors] ||
                    statusColors.unknown
                  }`}
                  title={word.status}
                />

                <p className="flex justify-center w-full items-center wrap-anywhere">
                  {word.original}
                </p>
              </div>
              <div className="w-1/2 overflow-hidden relative p-4 flex items-center justify-center">
                <div className="wrap-anywhere">{word.translation}</div>
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 9 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => removeWord(word.id)}
                  className="absolute right-4 cursor-pointer text-neutral-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </motion.button>
                <button
                  onClick={() => setEditingWord(word)}
                  className="p-2 cursor-pointer text-neutral-400 hover:text-blue-500 transition-colors"
                >
                  Edit
                </button>

                {editingWord && (
                  <EditWordModal
                    word={editingWord}
                    onClose={() => setEditingWord(null)}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default WordList;
