import { useEffect, useState } from "react";

function App() {
  const [inputSearch, setInputSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    //questo mi serve qando il campo di ricerca è vuoto
    const query = inputSearch.trim();
    if (query === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    fetch(`http://localhost:3333/products?search=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data);
        setShowSuggestions(true);
        console.log(data)
      })
      .catch((err) => {
        console.error("Errore nella fetch:", err);
        setSuggestions([]);
        setShowSuggestions(false);
      });
  }, [inputSearch]);

  return (
    <>
      <h1>Ricerca Prodotti</h1>
      <div>
        <input
          type="text"
          placeholder="Cerca un prodotto"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul>
            {suggestions.map((product, index) => (
              <li
                key={index}
                onClick={() => {
                  setInputSearch(product.name);
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
              >
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
