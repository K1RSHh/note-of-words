import React, { useState, useEffect } from "react";
import useWordStore from "../store/WordStore";
import { motion } from "motion/react";
import type { IWord, TWordStatus } from "../types/word";

interface EditWordModalProps {
  word: IWord;
  onClose: () => void;
}

const EditWordModal = ({ word, onClose }: EditWordModalProps) => {
  const [original, setOriginal] = useState(word.original);
  const [translation, setTranslation] = useState(word.translation);
  const [status, setStatus] = useState<TWordStatus>(word.status || "unknown");
  const updateWord = useWordStore((state) => state.updateWord);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedOriginal =
      original.trim().charAt(0).toUpperCase() + original.trim().slice(1);

    await updateWord(word.id, {
      original: formattedOriginal,
      translation: translation.trim(),
      status: status,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleUpdate}
        className="flex flex-col gap-4 p-8 bg-neutral-800 rounded-4xl border border-neutral-700 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Edit word</h2>

        <input
          type="text"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          className="px-5 py-4 bg-neutral-900 text-white rounded-2xl border border-neutral-700 outline-none focus:border-blue-500"
        />

        <input
          type="text"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          className="px-5 py-4 bg-neutral-900 text-white rounded-2xl border border-neutral-700 outline-none focus:border-blue-500"
        />

        {/* Choosing a status */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-neutral-400 text-sm ml-1">Status:</label>
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
        </div>

        <div className="flex gap-3 mt-4">
          <motion.button
            whileHover={{ scale: 1.1, background: "#bababa", color: "#8f8d8d" }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer text-neutral-400 rounded-2xl shadow-lg font-bold"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="flex-1 cursor-pointer bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg"
          >
            Save
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default EditWordModal;
