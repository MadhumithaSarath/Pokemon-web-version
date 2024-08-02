import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Paper, CircularProgress, Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';


// Define the types for your data
interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface Sprites {
  front_default: string;
  // Add other sprite properties if needed
}

interface PokemonDetail {
  name: string;
  abilities: Ability[];
  sprites: Sprites;
}

const PokemonDetail: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    axios.get<PokemonDetail>(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [name]);

  if (error) {
    return <div>{error}</div>;
  }

  if (loading || !data) {
    return <CircularProgress />;
  }

  return (
    // <Paper style={{ padding: '16px', textAlign: 'center' }}>
    //   <Typography variant="h4" gutterBottom>
    //     Pokémon: {data.name}
    //   </Typography>
    //   {data.sprites.front_default && (
    //     <Box marginBottom={2}>
    //       <img src={data.sprites.front_default} alt={data.name} style={{ width: '200px', height: '200px' }} />
    //     </Box>
    //   )}
    //   <Typography variant="h6">Abilities:</Typography>
    //   <ul>
    //     {data.abilities.map((ability, index) => (
    //       <li key={index}>{ability.ability.name}</li>
    //     ))}
    //   </ul>
    // </Paper>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',  // Full viewport height
        padding: 2
      }}
    >
      <Card sx={{ maxWidth: 600 }}>  {/* Increased the maxWidth */}
        <CardMedia
          component="img"
          alt={data.name}
          height="200px"
          width="200px"
          image={data.sprites.front_default}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Pokémon: {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <ul>
              {data.abilities.map((ability, index) => (
                <li key={index}>{ability.ability.name}</li>
              ))}
            </ul>
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">GoBack</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default PokemonDetail;
