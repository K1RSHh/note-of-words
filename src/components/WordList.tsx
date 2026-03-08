import useWordStore from "../store/WordStore";

function WordList() {
  const words = useWordStore((state) => state.words);

  return (
    <div className="flex">
      <div className="w-1/2 border-2 rounded-tl-2xl border-neutral-400">
        <p className="p-4 text-white text-4xl border-b-2 border-neutral-400">
          Original
        </p>
        {words.map((word) => (
          <div className="border-b-2 border-neutral-400 p-2">
            <p className="text-white">{word.original}</p>
          </div>
        ))}
      </div>
      <div className="w-1/2 border-2 rounded-tr-2xl border-neutral-400">
        <p className="p-4 text-4xl text-white border-b-2 border-neutral-400">
          Translation
        </p>
        {words.map((word) => (
          <div className="border-b-2 border-neutral-400 p-2">
            <p className="text-white">{word.translation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WordList;
