import useWordStore from "../store/WordStore";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, Search } from "lucide-react";
import WordFilters from "./WordFilters";


function WordList() {
  const { words, removeWord, sortType, searchTerm, setSearchTerm } =
    useWordStore();

  // 1. Filtering: we check both the original and the translation
  const filteredWords = words.filter(
    (word) =>
      word.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.translation.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 2. Sorting an already filtered list
  const sortedWords = [...filteredWords].sort((a, b) => {
    if (sortType === "alphabet") return a.original.localeCompare(b.original);
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="flex flex-col">
      {/* Search field */}

      <div className="flex justify-between items-center mb-4 font-bold">
        <p className="text-neutral-500">Found: {sortedWords.length}</p>
        <div className="w-2/3 relative">
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
      </div>

      {/* Table header */}
      <div className="flex text-2xl font-bold p-4 bg-neutral-200 rounded-t-2xl text-black border-b-2 border-neutral-300">
        <p className="w-1/2">Original</p>
        <p className="w-1/2">Translation</p>
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
              <div className="w-1/2 border-r overflow-hidden border-neutral-200 p-4">
                {word.original}
              </div>
              <div className="w-1/2 overflow-hidden relative p-4 flex items-center justify-center">
                {word.translation}
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 9 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => removeWord(word.id)}
                  className="absolute right-4 cursor-pointer text-neutral-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default WordList;
