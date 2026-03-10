import useWordStore from "../store/WordStore";
import { motion } from "motion/react";

const WordFilters = () => {
  const { sortType, setSortType } = useWordStore();

  return (
    <div className="flex gap-2 justify-center">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSortType("latest")}
        className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium ${
          sortType === "latest"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-600 hover:bg-gray-100"
        }`}
      >
        New
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSortType("alphabet")}
        className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium ${
          sortType === "alphabet"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-600 hover:bg-gray-100"
        }`}
      >
        A — Z
      </motion.button>
    </div>
  );
};

export default WordFilters;
