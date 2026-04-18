# LAW-MATE ML Integration

This document provides the complete implementation plan and code for integrating three machine learning features into the LAW-MATE legal assistance platform.

## Overview

The integration adds three ML components to enhance the AI legal assistant:

1. **Legal Case Classification** - Automatically detects legal issue categories
2. **Legal Severity Prediction** - Predicts case severity scores and risk levels
3. **Legal Case Similarity Engine** - Finds similar past legal cases

## Architecture

```
LAW-MATE Frontend (React/TypeScript)
        ↓
LAW-MATE Backend (Node.js/Express)
        ↓
    ML Service (Python/Flask)
        ↓
    ML Models (scikit-learn)
```

## Project Structure

```
law-mate/
├── ml_service/                    # Python ML microservice
│   ├── ml_service.py             # Flask API server
│   ├── train_classifier.py       # Classification model training
│   ├── train_severity.py         # Severity model training
│   ├── train_similarity.py       # Similarity engine training
│   ├── run_training.py          # Training script runner
│   ├── requirements.txt          # Python dependencies
│   └── README.md                 # ML service documentation
├── backend/
│   ├── services/
│   │   └── mlService.js          # Node.js ML service client
│   ├── controllers/
│   │   └── legalController.js    # Updated with ML integration
│   └── models/
│       └── LegalQuery.js         # Updated with ML fields
└── components/
    ├── InfoPanel.tsx             # Updated UI with ML insights
    └── types.ts                  # Updated TypeScript types
```

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd ml_service
pip install -r requirements.txt
```

### 2. Train ML Models

```bash
cd ml_service
python run_training.py
```

This will train all three models and save them as pickle files.

### 3. Start ML Service

```bash
cd ml_service
python ml_service.py
```

The service runs on `http://localhost:8000`

### 4. Configure Environment Variables

Add to your backend `.env` file:

```env
ML_SERVICE_URL=http://localhost:8000
```

### 5. Start LAW-MATE Backend

```bash
cd backend
npm install  # if needed
npm run dev
```

### 6. Start LAW-MATE Frontend

```bash
npm run dev:all
```

## ML Models Details

### 1. Legal Case Classification
- **Algorithm**: Logistic Regression with TF-IDF
- **Input**: Legal issue description text
- **Output**: Category (labour_law, property_law, etc.) + confidence score
- **Training Data**: 20 sample cases across 6 categories

### 2. Legal Severity Prediction
- **Algorithm**: Random Forest Regressor
- **Input**: Legal issue description text
- **Output**: Severity score (0-1) + risk level (Low/Medium/High)
- **Training Data**: 20 sample cases with severity scores

### 3. Legal Case Similarity Engine
- **Algorithm**: TF-IDF + Cosine Similarity
- **Input**: Legal issue description text
- **Output**: Top 3 similar case descriptions
- **Database**: 24 sample legal case descriptions

## API Endpoints

### ML Service (Python/Flask)

- `GET /health` - Service health check
- `POST /classify` - Classify legal case
- `POST /severity` - Predict severity
- `POST /similarity` - Find similar cases
- `POST /analyze` - Complete ML analysis

### LAW-MATE Backend (Enhanced)

- `POST /api/legal/analyze` - Now includes ML results in response

## Response Format

The enhanced `/api/legal/analyze` endpoint now returns:

```json
{
  "summary": "...",
  "severity": "High",
  "confidence": 85,
  "lawSuggestions": [...],
  "rights": [...],
  "nextSteps": [...],
  "documentSuggestions": [...],
  // New ML fields
  "ml_category": "labour_law",
  "ml_category_confidence": 0.91,
  "ml_severity_score": 0.82,
  "ml_risk_level": "High",
  "similar_cases": [
    "Wage payment dispute",
    "Labour law violation",
    "Employer salary delay case"
  ]
}
```

## Frontend Updates

### New UI Elements

1. **ML Category Badge** - Shows detected legal category with confidence
2. **ML Risk Score** - Displays severity score with progress bar
3. **Similar Cases Section** - Lists AI-found similar cases
4. **ML Insights Tab** - Dedicated tab for machine learning results

### Updated Components

- `InfoPanel.tsx` - Added ML insights display
- `types.ts` - Extended AnalysisResult interface
- `ChatExperience.tsx` - Passes ML data to InfoPanel

## Error Handling

- **ML Service Unavailable**: Falls back to original Gemini-only analysis
- **Model Loading Failures**: Individual endpoints return 503 if models not loaded
- **Network Timeouts**: 5-10 second timeouts with fallback values
- **Training Failures**: Scripts provide detailed error messages

## Database Changes

Added `ml_category` field to `legal_queries` table to store ML-detected categories.

## Performance Considerations

- **Model Size**: All models are lightweight (< 1MB total)
- **Inference Speed**: < 100ms per prediction on modern hardware
- **Memory Usage**: Minimal memory footprint
- **Scalability**: Models can be updated without backend changes

## Future Enhancements

1. **Larger Training Datasets** - Improve model accuracy
2. **Model Retraining Pipeline** - Automated model updates
3. **Additional ML Features** - Legal outcome prediction, document classification
4. **Model Monitoring** - Performance tracking and drift detection
5. **A/B Testing** - Compare ML-enhanced vs. original analysis

## Troubleshooting

### ML Service Won't Start
- Check if all model files exist (`*.pkl` files)
- Verify Python dependencies are installed
- Check for port conflicts on 8000

### Models Not Loading
- Run training scripts again
- Check file permissions
- Verify pickle files are not corrupted

### Backend Can't Connect to ML Service
- Ensure ML service is running on localhost:8000
- Check `ML_SERVICE_URL` environment variable
- Verify firewall settings

### Frontend Not Showing ML Data
- Check browser console for errors
- Verify backend is returning ML fields
- Check TypeScript compilation

## Development Notes

- All ML models use sample data for demonstration
- In production, use larger, real-world datasets
- Consider model versioning for updates
- Implement proper logging and monitoring
- Add model validation and testing pipelines

## License

This ML integration is part of the LAW-MATE project.