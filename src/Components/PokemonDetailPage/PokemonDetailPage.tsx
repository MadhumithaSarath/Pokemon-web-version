import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, IconButton, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the types for your data
interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface Stat {
  base_stat: number;
  stat: {
    name: string;
    url: string;
  };
}

interface Type {
  type: {
    name: string;
    url: string;
  };
}

interface Sprites {
  front_default: string;
}

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: Ability[];
  stats: Stat[];
  types: Type[];
  sprites: Sprites;
}

const PokemonDetail: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); 

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

  const handleBackClick = () => {
    navigate('/'); 
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (loading || !data) {
    return <CircularProgress />;
  }

  // Define a mapping from Pokémon types to colors
  const typeColors: { [key: string]: string } = {
    fire: '#f5a367',
    water: '#86a2e5',
    grass: '#b6d9a5',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#d6df8b',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#F0B6BC',
    normal: '#dbdbc9',
  };

  // Determine the background color based on the first type of the Pokémon
  const primaryType = data.types[0].type.name;
  const backgroundColor = typeColors[primaryType] || '#f0f0f0';

  const statLabels = data.stats.map(stat => stat.stat.name);
  const statValues = data.stats.map(stat => stat.base_stat);
  const statColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const chartData = {
    labels: statLabels,
    datasets: [
      {
        label: 'Base Stats',
        data: statValues,
        backgroundColor: statColors,
      },
    ],
  };

  const abilityColors = ['#e57373', '#81c784', '#64b5f6', '#ffb74d', '#ba68c8', '#4db6ac'];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',     
        minHeight: '100vh',
        padding: 2,
        backgroundColor: '#f5f5f5', 
      }}
    >
      <Card sx={{ maxWidth: 800 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <IconButton 
              sx={{ alignSelf: 'flex-start', mb: 2 }}
              onClick={handleBackClick}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ textAlign: 'left', mt: 2, marginLeft:'20px' }}>
              <Typography variant="h6">ID: {data.id}</Typography>
            </Box>
            <Box
              sx={{
                width: '200px', 
                height: '200px',
                borderRadius: '50%', 
                backgroundColor, 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden', 
                marginLeft: '15px',
              }}
            >
              <CardMedia
                component="img"
                alt={data.name}
                height="200"
                width="200"
                image={data.sprites.front_default}
                sx={{
                  objectFit: 'cover',
                }}
              />
            </Box>
            <Box sx={{ textAlign: 'left', mt: 2, marginLeft:'20px' }}>
              <Typography variant="body1" gutterBottom>
                <strong>Height:</strong> {data.height} decimetres
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Weight:</strong> {data.weight} hectograms
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                <strong>Types:</strong> {data.types.map(type => type.type.name).join(', ')}
              </Typography>
              <Typography variant="body1" gutterBottom> <strong>Abilities</strong> </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {data.abilities.map((ability, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: abilityColors[index % abilityColors.length],
                      color: 'white',
                      borderRadius: 4,
                      padding: '5px 8px',
                      margin: '4px 0',
                    }}
                  >
                    {ability.ability.name}
                  </Box>
                ))}
              </Box>
              <Typography variant="body1" gutterBottom sx={{ textAlign:'center'}}><strong>Base Stats</strong></Typography>
              <Box sx={{ height: 200, marginTop: 2 }}>
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}

export default PokemonDetail;
