import React, { useState } from 'react';
import axios from 'axios'; // Import axios

const FLASK_URL = import.meta.env.VITE_FLASK_URL || 'http://127.0.0.1:5001';

function PredictionForm() {
  const [formData, setFormData] = useState({ /* your form fields */ });
  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page
    setError('');
    setPrediction('');

    try {
      // Send a POST request to your Flask backend endpoint
      const response = await axios.post(`${FLASK_URL}/api/predict`, formData);

      // Update the state with the prediction result from the backend
      setPrediction(response.data.prediction);

    } catch (err) {
      // If there's an error, display it
      console.error("There was an error making the request!", err);
      setError('Could not get prediction. Please try again.');
    }
  };

  // ... your form JSX here, calling handleSubmit on submit ...
  // Example: <form onSubmit={handleSubmit}> ... </form>

  return (
    <div>
      {/* Your form elements go here */}
      <form onSubmit={handleSubmit}>
        {/* Example input field */}
        <input
          type="text"
          name="cropName"
          onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
          placeholder="Crop Name"
        />
        <button type="submit">Get Prediction</button>
      </form>

      {/* Display the result or an error */}
      {prediction && <h3>Prediction: {prediction}</h3>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default PredictionForm;