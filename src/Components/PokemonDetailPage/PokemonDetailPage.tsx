import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, IconButton, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
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
  // Add other sprite properties if needed
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
  const navigate = useNavigate(); // Hook to navigate programmatically

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
    navigate('/'); // Adjust this path if needed
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (loading || !data) {
    return <CircularProgress />;
  }

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: 2,
        alignItems: 'center'
      }}
    >
      <Card sx={{ maxWidth: 800 }}>
      <IconButton 
        sx={{ alignSelf: 'flex-start', mb: 2 }}
        onClick={handleBackClick}
      >
        <ArrowBackIcon />
      </IconButton>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="h6">ID: {data.id}</Typography>
            </Box>
            <CardMedia
              component="img"
              alt={data.name}
              height="200px"
              width="200px"
              image={data.sprites.front_default}
            />
            <Box sx={{ textAlign: 'center', mt: 2 }}>
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
              <Typography variant="body1" gutterBottom>
              <strong>Abilities:</strong>
              {data.abilities.map(ability => ability.ability.name).join(', ')}
              </Typography>
              <Typography variant="body1" gutterBottom sx={{alignItems: 'center', textAlign:'center'}}>
              <strong>Base Stats:</strong>
              </Typography>
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
