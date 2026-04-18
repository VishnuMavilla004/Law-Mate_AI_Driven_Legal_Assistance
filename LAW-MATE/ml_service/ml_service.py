"""
Flask ML Service for LAW-MATE
Provides machine learning endpoints for legal case analysis.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os
from sklearn.metrics.pairwise import cosine_similarity
from dataset_processor import LegalDatasetProcessor

# Get the directory of this script
base_dir = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize dataset processor
dataset_processor = LegalDatasetProcessor()
processed_dataset = None

# Load processed dataset on startup
try:
    # Try to load existing processed dataset
    dataset_path = os.path.join(base_dir, 'datasets', 'processed_legal_dataset.csv')
    if os.path.exists(dataset_path):
        import pandas as pd
        processed_dataset = pd.read_csv(dataset_path)
        print(f"Loaded processed dataset with {len(processed_dataset)} cases")
    else:
        print("No processed dataset found. Run dataset_processor.py first.")
except Exception as e:
    print(f"Error loading dataset: {e}")

# Load models and vectorizers
try:
    with open(os.path.join(base_dir, 'lawmate_classifier.pkl'), 'rb') as f:
        classifier_model = pickle.load(f)
    with open(os.path.join(base_dir, 'vectorizer.pkl'), 'rb') as f:
        classifier_vectorizer = pickle.load(f)
    print("Classification model loaded successfully")
except FileNotFoundError:
    print("Warning: Classification model files not found. Classification endpoint will not work.")
    classifier_model = None
    classifier_vectorizer = None

try:
    with open(os.path.join(base_dir, 'severity_model.pkl'), 'rb') as f:
        severity_model = pickle.load(f)
    with open(os.path.join(base_dir, 'severity_vectorizer.pkl'), 'rb') as f:
        severity_vectorizer = pickle.load(f)
    print("Severity model loaded successfully")
except FileNotFoundError:
    print("Warning: Severity model files not found. Severity endpoint will not work.")
    severity_model = None
    severity_vectorizer = None

try:
    with open(os.path.join(base_dir, 'similarity_vectorizer.pkl'), 'rb') as f:
        similarity_vectorizer = pickle.load(f)
    with open(os.path.join(base_dir, 'similarity_matrix.pkl'), 'rb') as f:
        similarity_matrix = pickle.load(f)
    with open(os.path.join(base_dir, 'case_database.pkl'), 'rb') as f:
        case_df = pickle.load(f)
    print("Similarity engine loaded successfully")
except FileNotFoundError:
    print("Warning: Similarity engine files not found. Similarity endpoint will not work.")
    similarity_vectorizer = None
    similarity_matrix = None
    case_df = None

def get_risk_level(score):
    """Convert severity score to risk level."""
    if score >= 0.8:
        return "High"
    elif score >= 0.6:
        return "Medium"
    else:
        return "Low"


def heuristic_case_type(text):
    """Improved case type detection using keyword matching tuned for user inputs."""
    text_lower = text.lower()
    scores = {
        'labor_law': 0,
        'property_dispute': 0,
        'family_law': 0,
        'contract_dispute': 0,
        'consumer_rights': 0,
        'criminal_law': 0,
        'civil_dispute': 0
    }

    # Labor law keywords
    labor_keywords = ['salary', 'pay', 'wage', 'employer', 'boss', 'job', 'work', 'fired', 'termination', 'overtime', 'bonus', 'employment', 'contract employee', 'harassment', 'unfair']
    for keyword in labor_keywords:
        if keyword in text_lower:
            scores['labor_law'] += 2

    # Property dispute keywords
    property_keywords = ['landlord', 'tenant', 'rent', 'security deposit', 'property', 'house', 'apartment', 'possession', 'eviction', 'boundary', 'neighbor', 'builder', 'flat', 'maintenance']
    for keyword in property_keywords:
        if keyword in text_lower:
            scores['property_dispute'] += 2

    # Family law keywords
    family_keywords = ['divorce', 'marriage', 'spouse', 'husband', 'wife', 'child', 'custody', 'maintenance', 'adoption', 'domestic violence', 'in-laws', 'family']
    for keyword in family_keywords:
        if keyword in text_lower:
            scores['family_law'] += 2

    # Contract dispute keywords
    contract_keywords = ['contract', 'agreement', 'breach', 'business', 'partner', 'supplier', 'client', 'vendor', 'deal', 'payment', 'services', 'goods']
    for keyword in contract_keywords:
        if keyword in text_lower:
            scores['contract_dispute'] += 2

    # Consumer rights keywords
    consumer_keywords = ['product', 'defective', 'warranty', 'store', 'mobile', 'phone', 'car', 'vehicle', 'online shopping', 'bank', 'insurance', 'service', 'quality', 'fraud']
    for keyword in consumer_keywords:
        if keyword in text_lower:
            scores['consumer_rights'] += 2

    # Criminal law keywords
    criminal_keywords = ['stole', 'theft', 'assault', 'fraud', 'threat', 'harassment', 'burglary', 'cyber crime', 'scammer', 'unknown person', 'ex-partner']
    for keyword in criminal_keywords:
        if keyword in text_lower:
            scores['criminal_law'] += 2

    # Civil dispute keywords
    civil_keywords = ['money lent', 'loan', 'dispute', 'nuisance', 'noise', 'parking', 'water', 'boundary']
    for keyword in civil_keywords:
        if keyword in text_lower:
            scores['civil_dispute'] += 1

    # Find the category with highest score
    max_score = max(scores.values())
    if max_score > 0:
        for category, score in scores.items():
            if score == max_score:
                # Calculate confidence based on score strength
                confidence = min(0.9, 0.4 + (score * 0.1))
                return category, confidence

    return 'general_law', 0.3


def heuristic_severity_score(text, base_score=None):
    """Adjust severity score using keyword heuristics when model is uncertain."""
    text_lower = text.lower()
    severity = base_score if base_score is not None else 0.5

    # High severity keywords
    high_severity = ['murder', 'rape', 'kidnapping', 'death', 'serious injury', 'life threatening',
                    'attempt to murder', 'dacoity', 'robbery', 'extortion']
    if any(k in text_lower for k in high_severity):
        severity = max(severity, 0.85)

    # Medium-high severity keywords
    med_high_severity = ['assault', 'battery', 'grievous hurt', 'sexual harassment', 'domestic violence',
                        'threat', 'intimidation', 'blackmail', 'fraud over 1 lakh']
    if any(k in text_lower for k in med_high_severity):
        severity = max(severity, 0.7)

    # Medium severity keywords
    med_severity = ['theft', 'burglary', 'cheating', 'criminal breach of trust', 'forgery',
                   'criminal trespass', 'mischief', 'nuisance', 'defamation']
    if any(k in text_lower for k in med_severity):
        severity = max(severity, 0.6)

    # Low-medium severity keywords
    low_med_severity = ['dispute', 'breach of contract', 'non-payment', 'delay', 'negligence',
                       'complaint', 'dissatisfaction', 'unfair practice']
    if any(k in text_lower for k in low_med_severity):
        severity = max(severity, 0.45)

    # Very low severity keywords
    low_severity = ['minor issue', 'small dispute', 'inconvenience', 'preference', 'suggestion']
    if any(k in text_lower for k in low_severity):
        severity = min(severity, 0.3)

    return round(min(1.0, max(0.0, severity)), 3)


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "models_loaded": {
            "classification": classifier_model is not None,
            "severity": severity_model is not None,
            "similarity": similarity_vectorizer is not None
        }
    })

@app.route('/classify', methods=['POST'])
def classify_case():
    """Classify a legal case into categories."""
    if not classifier_model or not classifier_vectorizer:
        return jsonify({"error": "Classification model not loaded"}), 503

    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' field in request"}), 400

    text = data['text']

    try:
        # Transform text to TF-IDF
        text_tfidf = classifier_vectorizer.transform([text])

        # Get prediction and probability
        prediction = classifier_model.predict(text_tfidf)[0]
        probabilities = classifier_model.predict_proba(text_tfidf)[0]
        confidence = float(max(probabilities))

        # Use improved heuristics when confidence is very low (< 0.3)
        used_heuristics = False
        if confidence < 0.3:
            fallback_result = heuristic_case_type(text)
            if isinstance(fallback_result, tuple):
                prediction, heuristic_confidence = fallback_result
                confidence = heuristic_confidence
                used_heuristics = True
            else:
                prediction = fallback_result
                confidence = 0.5  # fallback confidence
                used_heuristics = True

        return jsonify({
            "category": prediction,
            "confidence": round(confidence, 3),
            "is_heuristic": used_heuristics
        })

    except Exception as e:
        return jsonify({"error": f"Classification failed: {str(e)}"}), 500

@app.route('/severity', methods=['POST'])
def predict_severity():
    """Predict severity score for a legal case."""
    if not severity_model or not severity_vectorizer:
        return jsonify({"error": "Severity model not loaded"}), 503

    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' field in request"}), 400

    text = data['text']

    try:
        # Transform text to TF-IDF
        text_tfidf = severity_vectorizer.transform([text])

        # Get prediction
        severity_score = float(severity_model.predict(text_tfidf)[0])

        # Only apply heuristic adjustment for very low variance predictions
        if severity_score < 0.2 or severity_score > 0.9:
            severity_score = heuristic_severity_score(text, base_score=severity_score)

        risk_level = get_risk_level(severity_score)

        return jsonify({
            "severity_score": round(severity_score, 3),
            "risk_level": risk_level
        })

    except Exception as e:
        return jsonify({"error": f"Severity prediction failed: {str(e)}"}), 500

@app.route('/similarity', methods=['POST'])
def find_similar_cases():
    """Find similar legal cases."""
    if not similarity_vectorizer or similarity_matrix is None or case_df is None:
        return jsonify({"error": "Similarity engine not loaded"}), 503

    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' field in request"}), 400

    text = data['text']
    top_k = data.get('top_k', 3)

    try:
        # Transform query to TF-IDF
        query_tfidf = similarity_vectorizer.transform([text])

        # Calculate cosine similarity
        similarities = cosine_similarity(query_tfidf, similarity_matrix).flatten()

        # Get top-k similar cases
        top_indices = similarities.argsort()[-top_k:][::-1]
        similar_cases = case_df.iloc[top_indices]['case_description'].tolist()

        return jsonify({
            "similar_cases": similar_cases
        })

    except Exception as e:
        return jsonify({"error": f"Similarity search failed: {str(e)}"}), 500

@app.route('/ml/predict-type', methods=['POST'])
def predict_type():
    """Predict case type with ML service prefix."""
    return classify_case()

@app.route('/ml/predict-severity', methods=['POST'])
def predict_severity_ml():
    """Predict severity with ML service prefix."""
    return predict_severity()

@app.route('/ml/similar-cases', methods=['POST'])
def similar_cases_ml():
    """Find similar cases with ML service prefix."""
    return find_similar_cases()

@app.route('/dataset/stats', methods=['GET'])
def get_dataset_stats():
    """Get comprehensive dataset statistics."""
    global processed_dataset

    if processed_dataset is None:
        return jsonify({"error": "Dataset not loaded"}), 503

    try:
        stats = dataset_processor.get_dataset_statistics(processed_dataset)

        # Format for frontend consumption
        response = {
            "total_cases": stats['total_cases'],
            "last_updated": stats['last_updated'],
            "top_case_types": stats['top_case_types'],
            "distribution": [
                {"name": "Low", "value": stats['severity_distribution']['low'], "color": "#10b981"},
                {"name": "Medium", "value": stats['severity_distribution']['medium'], "color": "#f59e0b"},
                {"name": "High", "value": stats['severity_distribution']['high'], "color": "#ef4444"}
            ]
        }

        return jsonify(response)
    except Exception as e:
        return jsonify({"error": f"Failed to generate statistics: {str(e)}"}), 500

@app.route('/analyze', methods=['POST'])
def complete_analysis():
    """Complete ML analysis combining classification, severity, and similarity."""
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' field in request"}), 400

    text = data['text']

    results = {}

    # Classification
    if classifier_model and classifier_vectorizer:
        try:
            text_tfidf = classifier_vectorizer.transform([text])
            prediction = classifier_model.predict(text_tfidf)[0]
            probabilities = classifier_model.predict_proba(text_tfidf)[0]
            confidence = float(max(probabilities))

            results['category'] = prediction
            results['category_confidence'] = round(confidence, 3)
        except Exception as e:
            results['category'] = 'general_law'
            results['category_confidence'] = 0.5
    else:
        results['category'] = 'general_law'
        results['category_confidence'] = 0.5

    # Severity
    if severity_model and severity_vectorizer:
        try:
            text_tfidf = severity_vectorizer.transform([text])
            severity_score = float(severity_model.predict(text_tfidf)[0])

            results['severity_score'] = round(severity_score, 3)
            results['risk_level'] = get_risk_level(severity_score)
        except Exception as e:
            results['severity_score'] = 0.5
            results['risk_level'] = 'Medium'
    else:
        results['severity_score'] = 0.5
        results['risk_level'] = 'Medium'

    # Similarity
    if similarity_vectorizer and similarity_matrix is not None and case_df is not None:
        try:
            query_tfidf = similarity_vectorizer.transform([text])
            similarities = cosine_similarity(query_tfidf, similarity_matrix).flatten()
            top_indices = similarities.argsort()[-3:][::-1]
            similar_cases = case_df.iloc[top_indices]['case_description'].tolist()
            results['similar_cases'] = similar_cases
        except Exception as e:
            results['similar_cases'] = []
    else:
        results['similar_cases'] = []

    return jsonify(results)

if __name__ == '__main__':
    print("Starting LAW-MATE ML Service...")
    print("Available endpoints:")
    print("  GET  /health - Health check")
    print("  POST /classify - Classify legal case")
    print("  POST /severity - Predict severity")
    print("  POST /similarity - Find similar cases")
    print("  POST /analyze - Complete analysis")
    print("  POST /ml/predict-type - Classify legal case (ML prefix)")
    print("  POST /ml/predict-severity - Predict severity (ML prefix)")
    print("  POST /ml/similar-cases - Find similar cases (ML prefix)")
    print("  GET  /dataset/stats - Dataset statistics")

    app.run(host='0.0.0.0', port=8000, debug=True)