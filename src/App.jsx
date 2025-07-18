import { useCallback, useEffect, useState } from "react";

//corretta per accettare ogni argomento
function debounce(callback, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function App() {
  const [inputSearch, setInputSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  //usato chiamata asincrona e gestrione con try catch
  const performSearch = useCallback(async (query) => {
    // Questo mi serve quando il campo di ricerca è vuoto
    if (query.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3333/products?search=${query}`);
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
      console.log(data);
    } catch (err) {
      console.error("Errore nella fetch:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);


  const getRicerca = useCallback(
    debounce(performSearch, 500),
    [performSearch]
  );

  useEffect(() => {

    getRicerca(inputSearch);
  }, [inputSearch, getRicerca]);

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
            {suggestions.map((product) => (
              <li

                key={product.name}
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