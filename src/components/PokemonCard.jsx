import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from './Icons';
import { TypeBadge } from './TypeBadge';

export const PokemonCard = ({ pokemon }) => {
  const [details, setDetails] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetch(pokemon.url)
      .then(res => res.json())
      .then(data => setDetails(data));
  }, [pokemon.url]);

  if (!details) {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-md p-4">
        <div className="h-24 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold capitalize mb-2">{pokemon.name}</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            {details.types.map(({ type }) => (
              <TypeBadge key={type.name} type={type.name} />
            ))}
          </div>
        </div>
        <img src={details.sprites.front_default} alt={pokemon.name} className="w-24 h-24" />
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
      >
        <span>{isExpanded ? 'Less info' : 'More info'}</span>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-2">
          <p>Height: {details.height / 10}m</p>
          <p>Weight: {details.weight / 10}kg</p>
          <div>
            <p className="font-semibold">Base Stats:</p>
            <div className="space-y-1">
              {details.stats.map(stat => (
                <div key={stat.stat.name} className="flex items-center gap-2">
                  <span className="w-24 text-sm">{stat.stat.name}:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm w-8">{stat.base_stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};