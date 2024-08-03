import React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Define the types for your data
interface Pokemon {
  name: string;
  url: string;
}

// Define the function to get Pokémon card color
const getPokemonCardColor = (pokemonName: string) => {
  const colorMap: { [key: string]: string } = {
    pikachu: '#F2C500', 
    charizard: '#F08030', 
    bulbasaur: '#9BCC50', 
  };
  return colorMap[pokemonName.toLowerCase()] || '#ffffff'; 
};


const PokemonCardStyle = styled(Card)(({ color }: { color: string }) => ({
  marginBottom: '16px',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '250px',
  backgroundColor: color,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)',
  },
}));

 // Extract the Pokémon ID from the URL
 const extractPokemonId = (url: string) => {
  const parts = url.split('/');
  return parts[parts.length - 2];
};

const PokemonCard: React.FC<{ pokemon: Pokemon }> = ({ pokemon }) => {
  const pokemonColor = getPokemonCardColor(pokemon.name);
  const pokemonId = extractPokemonId(pokemon.url);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

  return (
    <PokemonCardStyle color={pokemonColor}>
      <CardContent style={{ textAlign: 'center' }}>
        <img src={imageUrl} alt={pokemon.name} style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
        <Typography variant="h6" component="div" sx={{ marginTop: '8px' }}>
          {pokemon.name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          component={Link}
          to={`/pokemon/${pokemon.name}`}
          size="small"
          variant="contained"
          color="primary"
        >
          More Details
        </Button>
      </CardActions>
    </PokemonCardStyle>
  );
};

export default PokemonCard;