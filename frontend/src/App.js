// frontend/src/App.js

import React from 'react';
import './App.css';
import PredictionForm from './components/PredictionForm.js'; // <-- Import it

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Farmer Buddy Prediction</h1>
        <PredictionForm /> {/* <-- Use it here */}
      </header>
    </div>
  );
}

export default App;