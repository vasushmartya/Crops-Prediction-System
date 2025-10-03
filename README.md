# **🌾 Crop Predict: Smart Farming Assistant**

## **Overview**

Crop Predict is a full-stack web application designed to assist farmers in making data-driven decisions about crop selection. By leveraging a machine learning model, it analyzes key soil and environmental parameters (NPK, pH, Rainfall, Temperature, and Humidity) and provides a precise recommendation for the most suitable crop to cultivate. The application supports multilingual results (English and Hindi) through server-side translation.

## **🛠️ Technology Stack**

| Component | Technology | Role |
| :---- | :---- | :---- |
| **Frontend** | HTML5, CSS3, JavaScript | User Interface, input collection, and multilingual handling for static content. |
| **Backend** | Python (Flask) | Lightweight web server to host the ML model and serve predictions via a REST API. |
| **Model** | Scikit-learn (.pkl file) | Machine learning model (e.g., Random Forest Classifier) for crop classification. |
| **Dependencies** | joblib, numpy, flask, flask-cors | Python libraries for model loading, data manipulation, and API creation. |

## **📦 Project Structure**

The project follows a standard structure for web applications with a Python backend:

/project-folder  
├── crop\_model.pkl          \# The trained ML model file (critical)  
├── app.py                  \# The Flask server and prediction API  
├── index.html              \# The main web page (UI, inputs, result display)  
├── script.js               \# Frontend JavaScript for logic and translation switching  
└── style.css               \# Styling for the web page

## **⚙️ Setup and Installation**

### **1\. Backend Setup (Python/Flask)**

To run the prediction API, you need Python installed.

1. **Install Dependencies:** Open your terminal in the project directory and install the required Python packages:  
   pip install Flask joblib numpy flask-cors

2. **Run the Server:** Start the Flask application. It will run locally on http://127.0.0.1:5000/.  
   python app.py

   You should see confirmation messages like: Model (crop\_model.pkl) loaded successfully.

### **2\. Frontend Setup (Web Browser)**

1. **Open the HTML File:** Since the frontend uses standard HTML/CSS/JS, simply open the index.html file in any modern web browser.  
2. **CORS:** The frontend will attempt to connect to the Flask server at http://127.0.0.1:5000/predict. The flask-cors library ensures this connection works without browser security issues (CORS errors) during local development.

## **🚀 Usage and Features**

### **Input Features (7 Required Parameters)**

The ML model requires **7 specific inputs** in a specific order:

1. **Nitrogen** (N)  
2. **Phosphorous** (P)  
3. **Potassium** (K)  
4. **Average Temperature**  
5. **Average Humidity**  
6. **Soil pH**  
7. **Average Rainfall**

### **Multilingual Prediction (i18n)**

The application provides translation functionality using a hybrid approach:

* **Client-Side (script.js):** Translates all static UI elements (headings, labels, button text, loading messages) based on the user's selection (English or हिन्दी).  
* **Server-Side (app.py):** The Python server receives the prediction (e.g., 'mango') and the requested language code ('hi') and uses the built-in CROP\_TRANSLATIONS dictionary to return the translated result (e.g., 'आम').