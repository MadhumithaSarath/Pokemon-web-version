import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PokemonList from './Components/ListOfPokemon/ListOfPokemon';
import PokemonDetailPage from './Components/PokemonDetailPage/PokemonDetailPage'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;

