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

CROP_TRANSLATIONS = {
    'rice': {'en': 'Rice', 'hi': 'चावल'},
    'maize': {'en': 'Maize', 'hi': 'मक्का'},
    'apple': {'en': 'Apple', 'hi': 'सेब'},
    'banana': {'en': 'Banana', 'hi': 'केला'},
    'blackgram': {'en': 'Blackgram', 'hi': 'उड़द'},
    'chickpea': {'en': 'Chickpea', 'hi': 'चना'},
    'coconut': {'en': 'Coconut', 'hi': 'नारियल'},
    'coffee': {'en': 'Coffee', 'hi': 'कॉफी'},
    'cotton': {'en': 'Cotton', 'hi': 'कपास'},
    'grapes': {'en': 'Grapes', 'hi': 'अंगूर'},
    'jute': {'en': 'Jute', 'hi': 'जूट'},
    'kidneybeans': {'en': 'Kidneybeans', 'hi': 'राजमा'},
    'lentil': {'en': 'Lentil', 'hi': 'मसूर'},
    'mango': {'en': 'Mango', 'hi': 'आम'},
    'mothbeans': {'en': 'Mothbeans', 'hi': 'मोठ'},
    'mungbean': {'en': 'Munbean', 'hi': 'मूंग'},
    'muskmelon': {'en': 'Muskmelon', 'hi': 'खरबूजा'},
    'orange': {'en': 'Orange', 'hi': 'संतरा'},
    'papaya': {'en': 'Papaya', 'hi': 'पपीता'},
    'pigeonpeas': {'en': 'Pigeonpeas', 'hi': 'अरहर'},
    'pomegranate': {'en': 'Pomegranate', 'hi': 'अनार'},
    'watermelon': {'en': 'Watermelon', 'hi': 'तरबूज'}
}

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

        requested_lang = data.get('lang', 'en')

        # 3. Create a numpy array for the model
        # The model expects a 2D array: [[N, P, K, pH, rainfall]]
        features = np.array([[N, P, K, temperature, humidity, pH, rainfall]])
        
        # 4. Make Prediction
        prediction_key = MODEL.predict(features)[0]
        
        if prediction_key in CROP_TRANSLATIONS:
            # Look up the correct translation, defaulting to the English key if the requested 
            # language translation is missing.
            translated_crop = CROP_TRANSLATIONS[prediction_key].get(requested_lang, prediction_key)
        else:
            # If the crop key isn't in the translation map, just use the key itself.
            translated_crop = "not found in translation"

        # 6. Return the translated result
        return jsonify({
            'crop_recommendation': translated_crop, # Returns 'चावल' instead of 'rice'
            'status': 'success'
        })


    except Exception as e:
        return jsonify({'error': str(e)}), 400

# --- Run the Flask App ---
if __name__ == '__main__':
    # The server will run on http://127.0.0.1:5000/
    app.run(port=5000, debug=True)