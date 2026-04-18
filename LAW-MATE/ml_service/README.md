# LAW-MATE ML Service

Python Flask service providing machine learning capabilities for the LAW-MATE legal assistant platform.

## Features

- **Legal Case Classification**: Automatically categorizes legal issues
- **Severity Prediction**: Predicts the severity level of legal cases
- **Case Similarity Search**: Finds similar past legal cases

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Train the models:
```bash
python train_classifier.py
python train_severity.py
python train_similarity.py
```

3. Start the service:
```bash
python ml_service.py
```

The service will run on `http://localhost:8000`

## API Endpoints

### GET /health
Health check endpoint that returns the status of loaded models.

### POST /classify
Classifies a legal case into categories.

**Request:**
```json
{
  "text": "My employer has not paid my salary for three months."
}
```

**Response:**
```json
{
  "category": "labour_law",
  "confidence": 0.91
}
```

### POST /severity
Predicts the severity score of a legal case.

**Request:**
```json
{
  "text": "My colleague keeps sending threatening messages."
}
```

**Response:**
```json
{
  "severity_score": 0.82,
  "risk_level": "High"
}
```

### POST /similarity
Finds similar legal cases.

**Request:**
```json
{
  "text": "My landlord is not returning my security deposit."
}
```

**Response:**
```json
{
  "similar_cases": [
    "Tenant vs landlord deposit dispute",
    "Rental agreement violation case",
    "Property tenancy dispute"
  ]
}
```

### POST /analyze
Complete analysis combining all ML models.

**Request:**
```json
{
  "text": "Legal issue description"
}
```

**Response:**
```json
{
  "category": "labour_law",
  "category_confidence": 0.91,
  "severity_score": 0.82,
  "risk_level": "High",
  "similar_cases": ["Case 1", "Case 2", "Case 3"]
}
```

## Model Files

The service expects the following pickle files in the same directory:

- `lawmate_classifier.pkl` - Classification model
- `vectorizer.pkl` - TF-IDF vectorizer for classification
- `severity_model.pkl` - Severity prediction model
- `severity_vectorizer.pkl` - TF-IDF vectorizer for severity
- `similarity_vectorizer.pkl` - TF-IDF vectorizer for similarity
- `similarity_matrix.pkl` - Pre-computed TF-IDF matrix
- `case_database.pkl` - Case descriptions database

## Error Handling

If a model is not loaded, the corresponding endpoint will return a 503 status code with an error message. The service will continue to work with available models.