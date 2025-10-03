from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
from google.cloud import translate

# --- Configuration ---
app = Flask(__name__)
# Enable CORS for all routes (important for front-end development)
CORS(app) 

# --- Load the Model ---
try:
    # 1. Load the pickled model
    MODEL = joblib.load('crop_model.pkl') 
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    MODEL = None

# --- Prediction Endpoint ---

@app.route('/predict', methods=['POST'])
def predict():
    if MODEL is None:
        return jsonify({'error': 'Model not loaded on server.'}), 500

    try:
        # Get data posted as JSON from the front-end
        data = request.get_json(force=True)
        
        # 2. Extract and Validate Input Data
        # Ensure all 5 keys are present and converted to float
        N = float(data['N'])
        P = float(data['P'])
        K = float(data['K'])
        temperature = float(data['temperature'])
        humidity = float(data['humidity'])
        pH = float(data['pH'])
        rainfall = float(data['rainfall'])

        # 3. Create a numpy array for the model
        # The model expects a 2D array: [[N, P, K, pH, rainfall]]
        features = np.array([[N, P, K, temperature, humidity, pH, rainfall]])
        
        # 4. Make Prediction
        prediction = MODEL.predict(features)
        
        # The prediction result (e.g., 'rice', 'maize', etc.)
        crop_recommendation = prediction[0] 

        # 5. Return the result
        return jsonify({
            'crop_recommendation': crop_recommendation,
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# --- Run the Flask App ---
if __name__ == '__main__':
    # The server will run on http://127.0.0.1:5000/
    app.run(port=5000, debug=True)