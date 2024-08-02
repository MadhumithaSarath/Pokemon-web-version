import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';

import './ListPokemon.css'
// Define the types for your data
interface Pokemon {
  name: string;
  url: string;
}

interface ApiResponse {
  results: Pokemon[];
  count: number;
}

// Custom styles
const RainbowTableHead = styled(TableHead)({
  background: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)',
  '& th': {
    color: 'white',
  },
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const theme = createTheme();

const PokemonList: React.FC = () => {
  const [data, setData] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const rowsPerPage = 14; // Number of rows per page

  const fetchData = (page: number) => {
    setLoading(true);
    axios.get<ApiResponse>(`https://pokeapi.co/api/v2/pokemon?offset=${(page - 1) * rowsPerPage}&limit=${rowsPerPage}`)
      .then(response => {
        setData(response.data.results);
        setTotalPages(Math.ceil(response.data.count / rowsPerPage));
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(currentPage); // Initial API call
  }, [currentPage]);

  if (error) {
    return <div>{error}</div>;
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Calculate the pagination window
  const paginationWindow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(paginationWindow / 2));
  const endPage = Math.min(totalPages, startPage + paginationWindow - 1);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Typography variant="h4" gutterBottom>
          Pokémon List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            {/* <RainbowTableHead> */}
              <TableRow>
                <TableCell>Name</TableCell>
              </TableRow>
            {/* </RainbowTableHead> */}
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell>Loading...</TableCell>
                </TableRow>
              ) : (
                data.map((pokemon, index) => (
                  <StyledTableRow key={index}>
                    <TableCell>
                      <Link to={`/pokemon/${pokemon.name}`} className='text-link'>{pokemon.name}</Link>
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ marginRight: '8px' }}
          >
            Previous
          </Button>
          {Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map(page => (
            <Button
              key={page}
              variant="contained"
              onClick={() => handlePageChange(page)}
              color={currentPage === page ? 'primary' : 'inherit'}
              style={{ marginRight: '8px' }}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="contained"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default PokemonList;
