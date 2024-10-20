import React, { useState, useEffect } from 'react';
import { useDebounce } from './utils/useDebounce';
import { SearchIcon } from './components/Icons';
import { PokemonCard } from './components/PokemonCard';
import { typeColors } from './components/TypeBadge';

const App = () => {
  const [pokemon, setPokemon] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const types = Object.keys(typeColors);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        setPokemon(data.results);
        
     
        const details = await Promise.all(
          data.results.map(async (p) => {
            const res = await fetch(p.url);
            return res.json();
          })
        );
        
        
        const detailsMap = details.reduce((acc, pokemon) => {
          acc[pokemon.name] = pokemon;
          return acc;
        }, {});
        
        setPokemonDetails(detailsMap);
        setFilteredPokemon(data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokémon data');
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  useEffect(() => {
    const filterPokemon = () => {
      let filtered = pokemon;

      if (debouncedSearchTerm) {
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      }

    
      if (selectedTypes.length > 0) {
        filtered = filtered.filter(p => {
          const pokemonTypes = pokemonDetails[p.name]?.types.map(t => t.type.name) || [];
          return selectedTypes.some(type => pokemonTypes.includes(type));
        });
      }

      setFilteredPokemon(filtered);
    };

    filterPokemon();
  }, [debouncedSearchTerm, selectedTypes, pokemon, pokemonDetails]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Pokemon Explorer
        </h1>

        <div className="mb-8 space-y-4">
       
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              className="w-full px-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

       
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-700">Filter by Type</h3>
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <button
                  key={type}
                  className={`${
                    selectedTypes.includes(type)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  } px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 hover:text-white transition-all`}
                  onClick={() =>
                    setSelectedTypes(prev =>
                      prev.includes(type)
                        ? prev.filter(t => t !== type)
                        : [...prev, type]
                    )
                  }
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPokemon.map(p => (
            <PokemonCard key={p.name} pokemon={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;