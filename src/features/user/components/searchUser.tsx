import { useState } from "react";
import { Search, X } from "lucide-react";

function SearchUser({ onSearch }) {
  const [word, setWord] = useState("");

  const handleSearch = () => {
    if (word.trim() !== "") {
      onSearch(word);
    } else {
      onSearch("");
    }
  };

  const handleClear = () => {
    setWord("");
    onSearch("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 items-stretch w-full">
      <div className="relative flex-1">
        <input
          type="text"
          className="w-full border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 px-4 py-3 pr-10 rounded-xl transition-all duration-200 outline-none text-slate-900 bg-white placeholder:text-slate-400 font-medium"
          placeholder="Buscar usuario..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {word && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors duration-200"
          >
            <X size={18} className="text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>
      <button
        onClick={handleSearch}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-105 transition-all duration-200 group"
      >
        <Search size={18} className="transition-transform group-hover:scale-110" />
        Buscar
      </button>
    </div>
  );
}

export default SearchUser;
