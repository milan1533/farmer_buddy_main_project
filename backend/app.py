# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

# Initialize the Flask app 

app = Flask(__name__)

# --- THIS IS THE KEY PART FOR CONNECTION ---
# Enable CORS for all routes, allowing requests from any origin.
# For production, you might want to restrict this to your frontend's domain.
CORS(app)
# -----------------------------------------

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # 1. Get data from the frontend's request
        data = request.get_json()
        print(f"Received data: {data}") # Log the received data

        # 2. Extract your features from the data
        # Example: crop_name = data.get('cropName')
        # ...extract other features...

        # 3. --- YOUR AI/ML PREDICTION LOGIC GOES HERE ---
        # (Load model, preprocess data, make prediction)
        prediction_result = "Healthy" # Replace with your actual model output

        # 4. Return the result as a JSON response
        return jsonify({'prediction': prediction_result})

    except Exception as e:
        # If an error occurs, send back an error message
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the app on port 5001 to avoid conflict with Node.js backend
    app.run(port=5001, debug=True)