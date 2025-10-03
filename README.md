# **🌾 Crop Predict: Smart Farming Through Soil Analysis**

## **Overview**

**Crop Predict** is a web application designed to help farmers make data-driven decisions on optimal crop selection. By analyzing seven key soil and environmental parameters (N, P, K, pH, Rainfall, Temperature, and Humidity), the application uses a Machine Learning model (Random Forest Classifier) to recommend the best crop for the given conditions.

This project is structured as a full-stack application leveraging a **Flask (Python) backend** for model execution and a **Static HTML/CSS/JavaScript frontend** for the user interface. It features multilingual support achieved through a hybrid approach.

## **✨ Features**

* **Intelligent Prediction:** Utilizes a trained RandomForestClassifier (stored in crop\_model.pkl) to suggest optimal crops.  
* **7 Key Parameters:** Accepts inputs for Nitrogen (N), Phosphorous (P), Potassium (K), pH, Rainfall, Temperature, and Humidity.  
* **Real-Time API Integration:** The frontend communicates with a Flask API endpoint (/predict) to request predictions.  
* **Multilingual Support (i18n):**  
  * **Static UI Translation:** Headings, labels, and static text are translated instantly client-side using a JavaScript dictionary.  
  * **Dynamic Prediction Translation:** The final crop recommendation returned by the ML model is translated server-side using the **Google Cloud Translation API** based on the user's selected language.

## **🚀 Getting Started**

To run this application, you need to set up both the Python backend and open the HTML frontend.

### **Prerequisites**

1. Python 3.8+  
2. Google Cloud Project (for Translation API authentication and billing)  
3. The trained ML model saved as crop\_model.pkl.

### **1\. Backend Setup (app.py & Model)**

1. **Project Structure:** Ensure your files are organized as follows:  
   /CropPredict  
   ├── app.py             \# Flask server script  
   ├── crop\_model.pkl     \# The trained ML model  
   ├── index.html         \# Frontend interface  
   ├── style.css          \# Frontend styles  
   └── script.js          \# Frontend logic (ML call & i18n)

2. **Install Python Dependencies:**  
   pip install Flask joblib numpy google-cloud-translate

3. **Google Cloud Authentication:**  
   * Enable the **Cloud Translation API** in your GCP project console.  
   * Authenticate your environment for the Python application (e.g., using a Service Account or running gcloud auth application-default login).  
   * **CRITICAL:** Update the PROJECT\_ID variable in app.py with your unique Google Cloud Project ID.

\# Snippet from app.py  
PROJECT\_ID \= "your-gcp-project-id" \# \<--- \*\*UPDATE THIS LINE\*\*  
PARENT \= f"projects/{PROJECT\_ID}"

4. **Run the Server:**  
   python app.py

   The server will start on http://127.0.0.1:5000/.

### **2\. Frontend Setup (index.html & script.js)**

1. **Update Language Codes:** Ensure the \<option\> values in your index.html (e.g., in the \<select id="language"\>) use standard ISO 639-1 language codes (e.g., en, hi) to communicate correctly with both the JavaScript dictionary and the Translation API.  
2. **Open the HTML:** With the server running, simply open the index.html file in your web browser.  
3. **Verify Endpoint:** Ensure the prediction logic in script.js is correctly pointing to the local server address: http://127.0.0.1:5000/predict.

## **🛠️ Logic Flow Summary**

| Component | Responsibility | Action on "Predict Crop" Click |
| :---- | :---- | :---- |
| **script.js (Client)** | UI, i18n, Request Prep | Collects 7 input values. Collects current lang code. POSTs data to Flask server. Receives and displays the *translated* crop recommendation. |
| **app.py (Server)** | Model Execution, Translation | Receives 7 features \+ lang code. Passes 7 features to crop\_model.pkl. Gets English prediction result (e.g., 'rice'). Calls **Google Cloud Translation API** using the requested lang code. Returns the translated crop name. |

