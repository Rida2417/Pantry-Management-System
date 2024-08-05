
import React, { useRef, useState, useCallback } from 'react';
import { Button, Box } from '@mui/material';
import { storage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Camera } from 'react-camera-pro';

const visionAPIKey = 'AIzaSyB__adFobkbf_wM6FVaEDaB8tBOypMqg1o'; // Replace with your actual API key

const WebcamCapture = () => {
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);

  const classifyImage = async (imageURL) => {
    try {
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${visionAPIKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  source: {
                    imageUri: imageURL,
                  },
                },
                features: [
                  {
                    type: 'LABEL_DETECTION',
                    maxResults: 5,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      console.log('Classification Results:', data.responses[0].labelAnnotations);
      return data.responses[0].labelAnnotations;
    } catch (error) {
      console.error('Error classifying image:', error);
      return [];
    }
  };

  const captureImage = useCallback(async () => {
    if (cameraRef.current) {
      const photo = cameraRef.current.takePhoto();
      if (!photo) return;

      try {
        const imageRef = ref(storage, `images/${Date.now()}.jpg`);
        const response = await fetch(photo);
        const blob = await response.blob();

        await uploadBytes(imageRef, blob);
        const url = await getDownloadURL(imageRef);

        console.log('Image URL:', url);

        // Classify the image using Vision API
        await classifyImage(url);

        setImage(url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box width="250px" height="250px">
        <Camera ref={cameraRef} aspectRatio={1} />
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'darkred',
            '&:hover': {
              backgroundColor: '#B22222',
            },
          }}
          onClick={captureImage}
        >
          Capture Image
        </Button>
      </Box>
      {image && <img src={image} alt='Captured' style={{ marginTop: '20px', maxWidth: '100%' }} />}
    </Box>
  );
};

export default WebcamCapture;
