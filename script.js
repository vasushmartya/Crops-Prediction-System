//language switching
const translations = {
    'en': {
        'header-h1': "Crop Predict",
        'header-h2': "Smart Farming Through Soil Analysis",
        'intro-h1': "Transform Your Farming with Smart Crop Predictions",
        'intro-p' : "Make informed decisions about what crops to plant based on your soil's unique characteristics. Our advanced analysis considers nitrogen, phosphorous, potassium levels, rainfall patterns, and pH balance to recommend the most suitable crops for your land.",
        "card-1": "Soil Analysis",
        "card-1-p": "Analyze NPK levels, pH, and rainfall data",
        "card-2": "Smart Predictions",
        "card-2-p": "AI-powered crop recommendations",
        "card-3": "Crop Optimization",
        "card-3-p": "Maximize yield with optimal crop selection",
        "card-4": "Farmer-Friendly",
        "card-4-p": "Simple tools for every farmer",
        "input-h2": "Soil Analysis Input",
        "input-p": "Enter your soil parameters to get personalized crop recommendations",
        "nitrogen": "Nitrogen",
        "phosphorus": "Phosphorus",
        "potassium": "Potassium",
        "temperature-label": "Temperature in Celsius",
        "humidity-label": "Humidity %",
        "ph-label": "Soil pH",
        "rain": "Average rainfall(in mm)",
        "predict": "Predict Crop",
        // DYNAMIC MESSAGES:
        'result-prefix': "✅ Predicted Crop: ",
        'predicting-text': "Predicting... please wait.",
        'error-text': "❌ Error: Could not get prediction. Check server and inputs. ",
        'validation-text': "Please enter values for all 7 parameters."
    },
    
    'hi': {
        'header-h1': "फसल भविष्यवाणी",
        'header-h2': "मिट्टी विश्लेषण के माध्यम से स्मार्ट खेती",
        'intro-h1': "स्मार्ट फसल भविष्यवाणियों के साथ अपनी खेती को बदलें",
        'intro-p' : "अपनी मिट्टी की विशिष्ट विशेषताओं के आधार पर कौन सी फसलें उगानी हैं, इस बारे में सोच-समझकर निर्णय लें। हमारा उन्नत विश्लेषण नाइट्रोजन, फॉस्फोरस, पोटेशियम के स्तर, वर्षा के पैटर्न और पीएच संतुलन को ध्यान में रखकर आपकी भूमि के लिए सबसे उपयुक्त फसलों की सिफारिश करता है।",
        "card-1": "मिट्टी विश्‍लेषण",
        "card-1-p": "एनपीके स्तर, पीएच और वर्षा डेटा का विश्लेषण करें",
        "card-2": "स्मार्ट भविष्यवाणियाँ",
        "card-2-p": "एआई-संचालित फसल अनुशंसाएँ",
        "card-3": "फसल अनुकूलन",
        "card-3-p": "इष्टतम फसल चयन के साथ उपज को अधिकतम करें",
        "card-4": "किसान के अनुकूल",
        "card-4-p": "हर किसान के लिए सरल उपकरण",
        "input-h2": "मिट्टी विश्लेषण इनपुट",
        "input-p": "वैयक्तिकृत फसल अनुशंसाएँ प्राप्त करने के लिए अपनी मिट्टी के पैरामीटर दर्ज करें",
        "nitrogen": "नाइट्रोजन",
        "phosphorus": "फास्फोरस",
        "potassium": "पोटेशियम",
        "temperature-label": "तापमान सेल्सियस में",
        "humidity-label": "नमी %",
        "ph-label": "मिट्टी का पी एच",
        "rain": "औसत वर्षा (मिमी में)",
        "predict": "फसल की भविष्यवाणी करें",
        // DYNAMIC MESSAGES:
        'result-prefix': "✅ अनुमानित फसल: ", 
        'predicting-text': "भविष्यवाणी हो रही है... कृपया प्रतीक्षा करें।", 
        'error-text': "❌ त्रुटि: भविष्यवाणी नहीं हो पाई। सर्वर और इनपुट जांचें। ", 
        'validation-text': "कृपया सभी 7 पैरामीटर के लिए मान दर्ज करें।"
    }   
};

function changeLanguage(langCode) {
    const texts = translations[langCode];
    if (!texts) return;

    for (const id in texts) {
        const element = document.getElementById(id);
        // Exclude dynamic keys (handled in handlePrediction)
        if (element && id !== 'result-prefix' && id !== 'predicting-text' && id !== 'error-text' && id !== 'validation-text') {
            element.textContent = texts[id];
        }
    }
    document.documentElement.lang = langCode;
}


//ml prediction

async function handlePrediction() {

    const N = document.getElementById('N').value;
    const P = document.getElementById('P').value;
    const K = document.getElementById('K').value;
    const pH = document.getElementById('pH').value;
    const rainfall = document.getElementById('rainfall').value;
    const temperature = document.getElementById('temperature').value;
    const humidity = document.getElementById('humidity').value;
    const currentLang = document.getElementById('language').value;
    const resultElement = document.getElementById('result-text');
    const currentTexts = translations[currentLang];


    if (!N || !P || !K || !pH || !rainfall || !temperature || !humidity) {
        resultElement.textContent = "Please enter values for all parameters.";
        return;
    }

    const inputData = { 
        N: N, P: P, K: K, 
        temperature: temperature, 
        humidity: humidity, 
        pH: pH, rainfall: rainfall,
        lang: currentLang 
    }; 
    
    // Update loading state with translated message
    resultElement.textContent = currentTexts['predicting-text'];

    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server status: ${response.status}`);
        }

        const result = await response.json();
        const predictedCrop = result.crop_recommendation;
        const prefix = currentTexts['result-prefix'];
        resultElement.textContent = prefix + predictedCrop;
        resultElement.style.color = 'green';

    } catch (error) {
        console.error('Prediction failed:', error);
        resultElement.textContent = `❌ Error: Could not get prediction. (${error.message})`;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    
    //Initializing Language Selector
    const langSelector = document.getElementById('language');
    // Set the initial language on page load
    changeLanguage(langSelector.value); 

    //Adding listener for when the user selects a new language
    langSelector.addEventListener('change', (event) => {
        const selectedLang = event.target.value;
        changeLanguage(selectedLang);
    });

    //Initializing Prediction Button Listener
    const predictButton = document.getElementById('predict');
    //Using the ID 'predict' to attach the prediction function
    predictButton.addEventListener('click', handlePrediction);
});