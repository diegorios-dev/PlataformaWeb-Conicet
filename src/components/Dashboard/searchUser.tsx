import { useState } from 'react';

interface SearchUserProps {
  onSearch: (word: string) => void;
}

function SearchUser({ onSearch }: SearchUserProps) {
  const [word, setWord] = useState("");

  const handleBlur = () => {
    if (word.trim() !== "") {
      console.log("Query de búsqueda (onBlur):", word);
      onSearch(word);
    }
  };

  return (
    <div>
      <input
        type="text"
        className="border p-2 rounded"
        placeholder="Buscar usuario..."
        value={word}
        onChange={(e) => setWord(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
}

export default SearchUser;
