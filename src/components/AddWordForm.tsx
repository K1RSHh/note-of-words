import React, { useState } from "react";
import useWordStore from "../store/WordStore";
import { motion } from "motion/react";

interface AddWordFormProps {
  onClose: () => void;
}

const AddWordForm = ({ onClose }: AddWordFormProps) => {
  const [original, setOriginal] = useState("");
  const [translation, setTranslation] = useState("");
  const addWord = useWordStore((state) => state.addWord); //

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!original.trim() || !translation.trim()) return;

    addWord({
      id: crypto.randomUUID(),
      original: original.trim(),
      translation: translation.trim(),
      userId: "user_1",
      createdAt: Date.now(),
      progress: 0,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-4 p-6 bg-neutral-800 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md animate-in fade-in zoom-in duration-200"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">New word</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white cursor-pointer hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <input
          autoFocus
          type="text"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          placeholder="Слово англійською"
          className="px-4 py-3 border-2 bg-white text-black placeholder-neutral-500 border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
        />

        <input
          type="text"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder="Переклад"
          className="px-4 py-3 border-2 bg-white text-black placeholder-neutral-500 border-white rounded-xl focus:border-blue-500 focus:outline-none transition-all"
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
