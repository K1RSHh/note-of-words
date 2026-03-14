import AddWordForm from "./AddWordForm";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import WordList from "./WordList";
import useWordStore from "../store/WordStore";

function Main() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [words] = useWordStore((state) => state.words);

  return (
    <div className="w-full m-auto p-6 relative">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFormOpen(true)}
          className="w-12 h-12 bg-blue-600 text-white cursor-pointer rounded-full flex items-center justify-center text-3xl shadow-lg"
        >
          +
        </motion.button>
      </div>

      <main className="mx-auto">
        <WordList />
        {words ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-center text-gray-400 mt-20">
                Press + to add a new word
              </p>
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-center text-gray-400 mt-20">
                Press + to add a first word
              </p>
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {isFormOpen && <AddWordForm onClose={() => setIsFormOpen(false)} />}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 cursor-pointer bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl shadow-2xl z-40"
      >
        +
      </motion.button>
    </div>
  );
}

export default Main;
