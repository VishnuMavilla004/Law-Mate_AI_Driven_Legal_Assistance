"""
Legal Severity Prediction Model Training Script
Trains a regression model to predict legal issue severity scores.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import os

# Sample dataset - in production, this would be loaded from a larger dataset
# Now loading from CSV file instead of hardcoded data

def create_sample_dataset():
    """Create a sample dataset for training."""
    # Load processed dataset from the dataset processor
    csv_path = os.path.join(os.path.dirname(__file__), 'datasets', 'processed_legal_dataset.csv')
    df = pd.read_csv(csv_path)

    # Select relevant columns and rename for compatibility
    df = df[['case_text', 'severity_score']].copy()
    df.columns = ['text', 'severity_score']

    return df

def train_severity_model():
    """Train the legal severity prediction model."""
    print("Creating sample dataset...")
    df = create_sample_dataset()

    print(f"Dataset size: {len(df)} samples")
    print(".3f")
    print(".3f")

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        df['text'], df['severity_score'], test_size=0.3, random_state=42
    )

    # Create TF-IDF vectorizer
    vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2), stop_words='english')

    # Fit and transform training data
    X_train_tfidf = vectorizer.fit_transform(X_train)

    # Train Random Forest Regressor
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_tfidf, y_train)

    # Evaluate on test set
    X_test_tfidf = vectorizer.transform(X_test)
    y_pred = model.predict(X_test_tfidf)

    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print("\nModel Performance:")
    print(".4f")
    print(".4f")

    print("\nSample Predictions:")
    for i in range(min(5, len(y_test))):
        print(".3f")

    return model, vectorizer

def save_model(model, vectorizer, model_path='severity_model.pkl', vectorizer_path='severity_vectorizer.pkl'):
    """Save the trained model and vectorizer."""
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    with open(vectorizer_path, 'wb') as f:
        pickle.dump(vectorizer, f)
    print(f"Model saved to {model_path}")
    print(f"Vectorizer saved to {vectorizer_path}")

def get_risk_level(score):
    """Convert severity score to risk level."""
    if score >= 0.8:
        return "High"
    elif score >= 0.6:
        return "Medium"
    else:
        return "Low"

if __name__ == "__main__":
    print("Training Legal Severity Prediction Model...")

    # Train the model
    model, vectorizer = train_severity_model()

    # Save the model and vectorizer
    save_model(model, vectorizer)

    print("Training completed successfully!")