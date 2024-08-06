import React, { useRef, useState, useCallback } from 'react';
import { Button, Box } from '@mui/material';
import { Camera } from 'react-camera-pro';

// Define your API keys and endpoints
const predictionAPIKey = '9d7c4a8f4c544345b519cc4c17b7f134'; // Replace with your actual Prediction-Key
const predictionAPIEndpoint = 'https://westus2.api.cognitive.microsoft.com/customvision/v3.0/Prediction/18476b4a-bf3a-4b5f-b781-09fe7e3ec26b/classify/iterations/Iteration1/image';

const WebcamCapture = ({ onAddItem, onClose }) => {
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);
  const [topPrediction, setTopPrediction] = useState(null);

  const classifyImage = async (imageBlob) => {
    try {
      const response = await fetch(predictionAPIEndpoint, {
        method: 'POST',
        headers: {
          'Prediction-Key': predictionAPIKey,
          'Content-Type': 'application/octet-stream',
        },
        body: imageBlob,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Classification Results:', data.predictions);

      // Find the prediction with the highest probability
      const highestProbabilityPrediction = data.predictions.reduce((max, pred) => (pred.probability > max.probability ? pred : max), { probability: -1 });
      
      setTopPrediction(highestProbabilityPrediction);
      if (onAddItem) {
        onAddItem(highestProbabilityPrediction.tagName);
      }
      return highestProbabilityPrediction;
    } catch (error) {
      console.error('Error classifying image:', error);
      return null;
    }
  };

  const captureImage = useCallback(async () => {
    if (cameraRef.current) {
      const photo = cameraRef.current.takePhoto();
      if (!photo) return;

      try {
        const response = await fetch(photo);
        const blob = await response.blob();
        
        // Classify the image using Custom Vision API
        const topPred = await classifyImage(blob);

        console.log('Top Prediction:', topPred);
        setImage(URL.createObjectURL(blob)); // Display the captured image
      } catch (error) {
        console.error('Error capturing or classifying image:', error);
      }
    }
  }, [classifyImage]);

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
      {topPrediction && (
        <Box mt={2}>
          <h3>Top Prediction:</h3>
          <p>{topPrediction.tagName}: {topPrediction.probability.toFixed(2)}</p>
        </Box>
      )}
    </Box>
  );
};

export default WebcamCapture;
