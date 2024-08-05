import React, { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center" p={3}>
      <TextField
        variant="outlined"
        label="Search Pantry"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          style: { color: 'white' }, // Text color
        }}
        InputLabelProps={{
          style: { color: 'white' }, // Label color
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white', // Border color
            },
            '&:hover fieldset': {
              borderColor: 'white', // Hover border color
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white', // Focused border color
            },
          },
          '& .MuiInputBase-root': {
            color: 'white', // Ensure input text color is white
          },
          '& .MuiFormLabel-root': {
            color: 'white', // Ensure label text color is white
          },
        }}
      />
      <Button variant="contained" sx={{
          backgroundColor: 'darkred', // Background color
          '&:hover': {
            backgroundColor: '#B22222', // Background color on hover
          },
         }} onClick={handleSearch}>
        Search
      </Button>
    </Stack>
  );
};

export default SearchBar;
