import AddWordForm from "./AddWordForm";
import { motion } from "motion/react";
import { useState } from "react";
import WordList from "./WordList";

function Main() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen p-6 relative">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFormOpen(true)}
          className="w-12 h-12 bg-blue-600 text-white cursor-pointer rounded-full flex items-center justify-center text-3xl shadow-lg"
        >
          +
        </motion.button>
      </header>

      <main className="max-w-4xl mx-auto">
        <WordList />
        <p className="text-center text-gray-400 mt-20">
          Press + to add a new word
        </p>
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
