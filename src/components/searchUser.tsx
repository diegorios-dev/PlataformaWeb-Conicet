import { useState , useEffect } from 'react';

interface SearchUserProps {
  onSearch: (query: string) => void;
}

function SearchUser({ onSearch }: SearchUserProps) {


  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    console.log("Query de búsqueda:", query);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div>
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Buscar usuario..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
    </div>
    
  );
}
export default SearchUser;