import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  IconButton,
  styled,
  ThemeProvider,
  createTheme,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

//import image
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Pokemon_logo from '../../assets/images/Pokemon_logo.png';
import giphy from '../../assets/images/giphy.gif';
import SearchGif from '../../assets/images/searchGif.gif';

//import CSS
import './ListPokemon.css'

// Define the types for your data
interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  types: { type: { name: string } }[];
}

interface ApiResponse {
  results: Pokemon[];
  count: number;
}

// Custom styles
const theme = createTheme();

const PokemonCard = styled(Card)(({ theme }) => ({
  marginBottom: '16px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '250px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  background: theme.palette.background.paper,
  borderColor: '#c8c8c8',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)',
  },
}));

const CardContentStyled = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
});

const PokemonId = styled(Typography)({
  fontWeight: 'bold',
  marginBottom: '8px',
});

// New style for the image container with dynamic color
const ImageContainer = styled(Box)<{ bgColor: string }>(({ bgColor }) => ({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  backgroundColor: bgColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
  overflow: 'hidden',
}));

const PaginationContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  marginTop: '16px',
  padding: '16px',
});

const BackgroundContainer = styled(Box)({
  position: 'relative',
  padding: '26px',
  background: `url('path/to/pokemon-logo-vector.svg') no-repeat center center`,
  backgroundSize: 'cover',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.5)',
    zIndex: -1,
  },
});

// Define a mapping of Pokémon types to colors
const typeColors: Record<string, string> = {
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

const PokemonList: React.FC = () => {
  const [data, setData] = useState<Pokemon[]>([]);
  const [filteredData, setFilteredData] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pokemonDetails, setPokemonDetails] = useState<Map<string, string>>(new Map());

  const rowsPerPage = 16;
  const navigate = useNavigate();

  const fetchData = (page: number) => {
    setLoading(true);
    axios.get<ApiResponse>(`https://pokeapi.co/api/v2/pokemon?offset=${(page - 1) * rowsPerPage}&limit=${rowsPerPage}`)
      .then(async (response) => {
        const results = response.data.results;
        setData(results);
        setFilteredData(results);
        setTotalPages(Math.ceil(response.data.count / rowsPerPage));

        // Fetch additional details for each Pokémon to get type information
        const detailsPromises = results.map(pokemon =>
          axios.get<PokemonDetails>(pokemon.url).then(res => {
            const types = res.data.types.map(t => t.type.name);
            const colors = types.map(type => typeColors[type]).filter(color => color) as string[];
            return { name: pokemon.name, color: colors[0] || '#fff' }; // Use first type color
          })
        );

        const details = await Promise.all(detailsPromises);
        const detailsMap = new Map(details.map(d => [d.name, d.color]));
        setPokemonDetails(detailsMap);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const filtered = data.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Extract the Pokémon ID from the URL
  const extractPokemonId = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 2];
  };

  // Calculate pagination buttons
  const paginationButtons = [];
  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    paginationButtons.push(
      <Button
        key={i}
        variant="contained"
        onClick={() => handlePageChange(i)}
        color={currentPage === i ? 'primary' : 'inherit'}
        style={{ marginRight: '8px' }}
      >
        {i}
      </Button>
    );
  }

  const handleRedirect = (pokemonName: string) => {
    navigate(`/pokemon/${pokemonName}`);
  };

  const imageStyle: React.CSSProperties = {
    display: 'block',
    margin: '0 auto',
    height: '50px',
    width: 'auto'
  };
  return (
    <ThemeProvider theme={theme}>
      <BackgroundContainer className='bgColor'>
        <div style={{ marginBottom: '5px' }}>
          <img src={Pokemon_logo} alt="Pokemon Explorer App" style={imageStyle} />
        </div>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px', background: 'linear-gradient(90deg, rgb(223 219 103) 0%, #1976d2 100%)', 
            padding: '10px', borderRadius: '10px' }}>
          <TextField sx={{ width: '100%', maxWidth: '600px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', backgroundColor:'white'}}
            label="Search Pokémon"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <img src={SearchGif} alt="Search" style={{ width: '30px', height: '30px' }} />
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Grid container spacing={3} sx={{ marginLeft: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', textAlign: 'center'}}>
          {loading ? (
            <Grid item>
              <img src={giphy} alt="Loading..." style={{ maxWidth: '100%', height: 'auto' }} />
            </Grid>
          ) : (
            filteredData.map((pokemon, index) => {
              const pokemonId = extractPokemonId(pokemon.url);
              const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
              const bgColor = pokemonDetails.get(pokemon.name) || '#fff';

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Link to={`/pokemon/${pokemonId}`} style={{ textDecoration: 'none' }}>
                    <PokemonCard>
                      <CardContentStyled>
                        <ImageContainer bgColor={bgColor}>
                          <img src={imageUrl} alt={pokemon.name} style={{ width: '100%', height: '100%' }} />
                        </ImageContainer>
                        <Typography variant="h6" component="div" sx={{ marginTop: '8px' }}>
                          {pokemon.name}
                        </Typography>
                      </CardContentStyled>
                      <CardActions sx={{ backgroundColor: bgColor }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Typography sx={{ marginTop: '10px' }}>#0{pokemonId}</Typography>
                          <IconButton onClick={() => handleRedirect(pokemon.name)}>
                            <MoreHorizIcon />
                          </IconButton>
                        </Box>
                      </CardActions>
                    </PokemonCard>
                  </Link>
                </Grid>
              );
            })
          )}
        </Grid>
        <PaginationContainer>
          <Button variant="contained" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          <Box display="flex" alignItems="center" gap="8px">
            {paginationButtons}
          </Box>
          <Button variant="contained" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </Button>
        </PaginationContainer>
      </BackgroundContainer>
    </ThemeProvider>
  );
}

export default PokemonList;
