import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, IconButton, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Legend } from 'chart.js';
import Tooltip from '@mui/material/Tooltip';

//import css
import './PokemonDetailPage.css'

// Register the components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend);

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

  //Back Button
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
    <Box className='detailPageBoxOne'>
      <Box className='detailPageBoxTwo'>
        <Typography variant="h3" gutterBottom sx={{ flexGrow: 1, textAlign: 'center'}}>
          {data.name.toUpperCase()}
        </Typography>
      </Box>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2, backgroundColor: backgroundColor, boxShadow: 3}}>
            <Box className='detailPageBoxThree'>
            <Tooltip title="Go Back">
              <IconButton sx={{ marginLeft: 2}} onClick={handleBackClick}>
                <ArrowBackIcon />
              </IconButton>
              </Tooltip>
              <Typography variant="h5" gutterBottom sx={{ flexGrow: 1, textAlign: 'right' }}>
                ID: #0{data.id}
              </Typography>
            </Box>
            <Box className='detailPageBoxFour'>
              <CardMedia component="img" alt={data.name} image={data.sprites.front_default} className='CardMediaOne'/>
            </Box>
            <Box className='detailPageBoxFive'>
              <Typography variant="h6" gutterBottom sx={{ marginRight: 2 }}>
                <strong>Abilities</strong>
              </Typography>
              <Box className='detailPageBoxSix'>
                {data.abilities.map((ability, index) => (
                  <Box className = 'detailPageBoxSeven'
                    key={index}
                    sx={{backgroundColor: abilityColors[index % abilityColors.length], color: 'white', borderRadius: 4, padding: '5px 8px', 
                      margin: '4px 0' }}>
                    <Typography variant="body2">{ability.ability.name}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ padding: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <strong>Types:</strong> {data.types.map(type => type.type.name).join(', ')}
              </Typography>
              <Typography variant="h6" gutterBottom>
                <strong>Height:</strong> {data.height} decimetres
              </Typography>
              <Typography variant="h6" gutterBottom>
                <strong>Weight:</strong> {data.weight} hectograms
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                <strong>Base Stats</strong>
              </Typography>
              <Box sx={{ height: 200, marginTop: 2 }}>
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PokemonDetail;
