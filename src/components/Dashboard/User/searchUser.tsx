import { useState } from "react";

function SearchUser({ onSearch }) {
  const [word, setWord] = useState("");

  const handleSearch = () => {
    if (word.trim() !== "") {
      onSearch(word); // busca con palabra
    } else {
      onSearch(""); // si está vacío devuelve todos
    }
  };

  const handleClear = () => {
    setWord("");     // limpia el input
    onSearch("");    // vuelve a traer todos
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        className="border p-2 rounded w-64"
        placeholder="Buscar usuario..."
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Buscar
      </button>
      <button
        onClick={handleClear}
        className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Limpiar
      </button>
    </div>
  );
}

export default SearchUser;
