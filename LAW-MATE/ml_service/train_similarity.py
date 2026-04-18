"""
Legal Case Similarity Engine Training Script
Creates a similarity search engine for legal cases using TF-IDF and cosine similarity.
"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os

# Sample legal case descriptions - in production, this would be loaded from a database
# Now loading from CSV file instead of hardcoded data

def create_case_database():
    """Create a database of legal case descriptions."""
    # Load processed dataset from the dataset processor
    csv_path = os.path.join(os.path.dirname(__file__), 'datasets', 'processed_legal_dataset.csv')
    df = pd.read_csv(csv_path)

    # Select relevant columns and rename for compatibility
    df = df[['case_text']].copy()
    df.columns = ['case_description']

    return df

def train_similarity_engine():
    """Train the legal case similarity engine."""
    print("Creating case database...")
    df = create_case_database()

    print(f"Database size: {len(df)} cases")

    # Create TF-IDF vectorizer
    vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2), stop_words='english')

    # Fit and transform case descriptions
    tfidf_matrix = vectorizer.fit_transform(df['case_description'])

    print(f"TF-IDF matrix shape: {tfidf_matrix.shape}")

    return vectorizer, tfidf_matrix, df

def find_similar_cases(query, vectorizer, tfidf_matrix, case_df, top_k=3):
    """Find similar cases for a given query."""
    # Transform query to TF-IDF
    query_tfidf = vectorizer.transform([query])

    # Calculate cosine similarity
    similarities = cosine_similarity(query_tfidf, tfidf_matrix).flatten()

    # Get top-k similar cases
    top_indices = similarities.argsort()[-top_k:][::-1]
    similar_cases = case_df.iloc[top_indices]['case_description'].tolist()

    return similar_cases, similarities[top_indices]

def save_similarity_engine(vectorizer, tfidf_matrix, case_df,
                          vectorizer_path='similarity_vectorizer.pkl',
                          matrix_path='similarity_matrix.pkl',
                          cases_path='case_database.pkl'):
    """Save the similarity engine components."""
    with open(vectorizer_path, 'wb') as f:
        pickle.dump(vectorizer, f)
    with open(matrix_path, 'wb') as f:
        pickle.dump(tfidf_matrix, f)
    with open(cases_path, 'wb') as f:
        pickle.dump(case_df, f)

    print(f"Vectorizer saved to {vectorizer_path}")
    print(f"TF-IDF matrix saved to {matrix_path}")
    print(f"Case database saved to {cases_path}")

if __name__ == "__main__":
    print("Training Legal Case Similarity Engine...")

    # Train the similarity engine
    vectorizer, tfidf_matrix, case_df = train_similarity_engine()

    # Test the similarity search
    test_query = "My landlord won't return my deposit"
    similar_cases, scores = find_similar_cases(test_query, vectorizer, tfidf_matrix, case_df)

    print(f"\nTest Query: '{test_query}'")
    print("Similar Cases:")
    for case, score in zip(similar_cases, scores):
        print(".3f")

    # Save the similarity engine
    save_similarity_engine(vectorizer, tfidf_matrix, case_df)

    print("Training completed successfully!")