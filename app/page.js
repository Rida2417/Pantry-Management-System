'use client';
import { useState, useEffect } from 'react';
import { Typography, Box, Modal, Stack, TextField, Button } from '@mui/material';
import { firestore } from '@/firebase';
import { query, collection, getDoc, getDocs, deleteDoc, setDoc, doc } from 'firebase/firestore';
import SearchBar from './components/SearchBar';
import WebCamCapture from './components/WebCamCapture';


export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);

  useEffect(() => {
    updatePantry();
  }, []);

  // Fetch Pantry Items
  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setPantry(pantryList);
    setSearchResults(pantryList); // Initialize search results
  };

  // Remove Pantry Item
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updatePantry();
  };

  // Add Pantry Item
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updatePantry();
  };
  // Handle Search
  const handleSearch = (query) => {
    const results = pantry.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleWebcamOpen = () => setShowWebcam(true);
  const handleWebcamClose = () => setShowWebcam(false);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap="2">
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top={'30%'} left={'50%'} transform="translate(-50%,-50%)" width={400} bgcolor={'black'}
          border={'2px solid white'} boxShadow={24} p={4} display={'flex'} flexDirection={'column'} gap="3" sx={{ transform: "translate(-50%,-50%)" }}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} sx={{
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
            }} />
            <Button variant="contained" sx={{
              backgroundColor: 'darkred', // Background color
              '&:hover': {
                backgroundColor: '#B22222', // Background color on hover
              },
            }} onClick={() => { addItem(itemName); setItemName(""); handleClose(); }}>Add</Button>
          </Stack>
        </Box>
      </Modal>

      {/* Search Bar Component */}
      <SearchBar onSearch={handleSearch} />

      <Box border={'0px solid white'} m={5}>
        <Box width={800} height={100} borderBottom={'3px solid darkred'} bgcolor={'floralwhite'} marginBottom={3}>
          <Typography variant="h2" color={'darkred'} display="flex" alignContent={'center'} justifyContent={'center'} >Pantry Items</Typography>
        </Box>
        <Stack width={800} height={300} spacing={2} overflow="auto">
          {searchResults.map(({ name, quantity }) => (
            <Box key={name} width={'100%'} minHeight="90px" display={'flex'} alignItems={'center'} justifyContent={'space-between'} bgcolor={'floralwhite'} padding={5} gap={5}>
              <Typography variant="h4" color="darkred" textAlign={'center'}>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Typography variant="h4" color="darkred" textAlign={'center'}>{quantity}</Typography>
              <Stack direction={'row'} spacing={2}>
                <Button variant='contained' sx={{
                  backgroundColor: 'darkred', // Background color
                  '&:hover': {
                    backgroundColor: '#B22222', // Background color on hover
                  },
                }} onClick={() => addItem(name)}>Add</Button>
                <Button variant='contained' sx={{
                  backgroundColor: 'darkred', // Background color
                  '&:hover': {
                    backgroundColor: '#B22222', // Background color on hover
                  },
                }} onClick={() => removeItem(name)}>Remove</Button>
              </Stack>
            </Box>
          ))}
        </Stack>
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} p={4} gap={5}>
          <Button variant="contained" justifyContent="center" m={3} sx={{
            backgroundColor: 'darkred', // Background color
            '&:hover': {
              backgroundColor: '#B22222', // Background color on hover
            },
          }} onClick={handleOpen}>Add New Item</Button>

       {/* Button to show webcam */}
       <Button variant="contained" sx={{
            backgroundColor: 'darkred', // Background color
            '&:hover': {
              backgroundColor: '#B22222', // Background color on hover
            },
          }} onClick={handleWebcamOpen}>Upload Image</Button>

          {/* Conditionally render the WebcamCapture component */}
          {showWebcam && (
            <Box position="fixed" top={0} left={0} width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="rgba(0,0,0,0.5)">
              <Box width="300px" display="flex" flexDirection="column" alignItems="center" bgcolor="floralwhite" p={2} borderRadius={2}>
                <WebCamCapture onCapture={handleWebcamClose} />
                <Button variant="contained" sx={{
            backgroundColor: 'darkred', // Background color
            '&:hover': {
              backgroundColor: '#B22222', // Background color on hover
            },mt: 2
          }} onClick={handleWebcamClose}>Close Webcam</Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
