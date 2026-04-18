"""
Legal Case Classification Model Training Script
Trains a machine learning model to classify legal issues into categories.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
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
    df = df[['case_text', 'case_type']].copy()
    df.columns = ['text', 'category']

    return df

def train_classification_model():
    """Train the legal case classification model."""
    print("Creating sample dataset...")
    df = create_sample_dataset()

    print(f"Dataset size: {len(df)} samples")
    print(f"Categories: {df['category'].unique()}")

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        df['text'], df['category'], test_size=0.3, random_state=42
    )

    # Create TF-IDF vectorizer
    vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2), stop_words='english')

    # Fit and transform training data
    X_train_tfidf = vectorizer.fit_transform(X_train)

    # Train Logistic Regression model
    model = LogisticRegression(random_state=42, max_iter=1000)
    model.fit(X_train_tfidf, y_train)

    # Evaluate on test set
    X_test_tfidf = vectorizer.transform(X_test)
    y_pred = model.predict(X_test_tfidf)

    print("\nModel Performance:")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    return model, vectorizer

def save_model(model, vectorizer, model_path='lawmate_classifier.pkl', vectorizer_path='vectorizer.pkl'):
    """Save the trained model and vectorizer."""
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    with open(vectorizer_path, 'wb') as f:
        pickle.dump(vectorizer, f)
    print(f"Model saved to {model_path}")
    print(f"Vectorizer saved to {vectorizer_path}")

if __name__ == "__main__":
    print("Training Legal Case Classification Model...")

    # Train the model
    model, vectorizer = train_classification_model()

    # Save the model and vectorizer
    save_model(model, vectorizer)

    print("Training completed successfully!")