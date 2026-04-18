"""
Dataset Processing Pipeline for LAW-MATE
Handles real-world legal dataset integration and processing.
"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import os
import json
from datetime import datetime, timedelta
import random

class LegalDatasetProcessor:
    """Processes and manages legal case datasets."""

    def __init__(self, data_dir='datasets'):
        self.data_dir = os.path.join(os.path.dirname(__file__), data_dir)
        self.vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2), stop_words='english')
        self.label_encoder = LabelEncoder()

    def load_indian_legal_datasets(self):
        """Load and combine multiple Indian legal datasets."""
        # Simulate loading real datasets - in production, these would be actual CSV/API sources
        datasets = []

        # Mock Supreme Court judgments dataset
        supreme_court_data = self._generate_mock_supreme_court_data(1000)
        datasets.append(supreme_court_data)

        # Mock High Court cases
        high_court_data = self._generate_mock_high_court_data(1000)
        datasets.append(high_court_data)

        # Mock District Court cases
        district_court_data = self._generate_mock_district_court_data(1000)
        datasets.append(district_court_data)

        # Mock FIR/Crime dataset
        crime_data = self._generate_mock_crime_data(1000)
        datasets.append(crime_data)

        # Add user-style cases for better ML training
        user_cases = self._generate_user_style_cases(2000)
        datasets.append(user_cases)

        # Combine all datasets
        combined_df = pd.concat(datasets, ignore_index=True)

        # Add timestamps for real-time simulation
        combined_df = self._add_timestamps(combined_df)

        return combined_df

    def _generate_mock_supreme_court_data(self, n_samples):
        """Generate mock Supreme Court case data."""
        case_types = ['constitutional_law', 'criminal_appeal', 'civil_appeal', 'service_matters', 'taxation']
        templates = [
            "Petition challenging {issue} under Article {article} of Constitution",
            "Appeal against High Court judgment in {case_type} matter",
            "Writ petition seeking {relief} against {authority}",
            "Criminal appeal challenging conviction under {section} IPC",
            "Civil appeal regarding {property} dispute"
        ]

        data = []
        for _ in range(n_samples):
            case_type = random.choice(case_types)
            template = random.choice(templates)

            # Fill template with relevant details
            text = template.format(
                issue=random.choice(['discrimination', 'privacy violation', 'freedom of speech', 'right to life']),
                article=random.randint(14, 32),
                case_type=case_type,
                relief=random.choice(['justice', 'compensation', 'quashing of order']),
                authority=random.choice(['government', 'corporation', 'state authority']),
                section=random.randint(302, 420),
                property=random.choice(['land', 'inheritance', 'contract'])
            )

            severity = self._calculate_severity_from_text(text, case_type)
            data.append({
                'case_text': text,
                'case_type': case_type,
                'severity_score': severity,
                'court_level': 'supreme_court',
                'timestamp': None  # Will be added later
            })

        return pd.DataFrame(data)

    def _generate_mock_high_court_data(self, n_samples):
        """Generate mock High Court case data."""
        case_types = ['property_dispute', 'family_law', 'labor_law', 'contract_dispute', 'criminal_law']
        templates = [
            "Suit for {relief} in {case_type} dispute",
            "Criminal revision petition against {order}",
            "Family court petition for {matter}",
            "Labor dispute regarding {issue}",
            "Contract breach case seeking {damages}"
        ]

        data = []
        for _ in range(n_samples):
            case_type = random.choice(case_types)
            template = random.choice(templates)

            text = template.format(
                relief=random.choice(['declaration', 'injunction', 'damages', 'possession']),
                case_type=case_type,
                order=random.choice(['conviction', 'sentence', 'acquittal']),
                matter=random.choice(['divorce', 'custody', 'maintenance', 'adoption']),
                issue=random.choice(['termination', 'wages', 'working conditions']),
                damages=random.choice(['compensation', 'specific performance', 'refund'])
            )

            severity = self._calculate_severity_from_text(text, case_type)
            data.append({
                'case_text': text,
                'case_type': case_type,
                'severity_score': severity,
                'court_level': 'high_court',
                'timestamp': None
            })

        return pd.DataFrame(data)

    def _generate_mock_district_court_data(self, n_samples):
        """Generate mock District Court case data."""
        case_types = ['civil_dispute', 'criminal_trial', 'family_law', 'consumer_rights']
        templates = [
            "Civil suit for recovery of {amount} regarding {dispute}",
            "Criminal complaint under {section} IPC",
            "Family dispute petition for {relief}",
            "Consumer complaint against {defect} in {product}"
        ]

        data = []
        for _ in range(n_samples):
            case_type = random.choice(case_types)
            template = random.choice(templates)

            text = template.format(
                amount=f"₹{random.randint(50000, 5000000)}",
                dispute=random.choice(['loan', 'property', 'goods', 'services']),
                section=random.randint(323, 509),
                relief=random.choice(['maintenance', 'dissolution', 'partition']),
                defect=random.choice(['defective', 'substandard', 'misleading']),
                product=random.choice(['vehicle', 'electronics', 'appliance', 'service'])
            )

            severity = self._calculate_severity_from_text(text, case_type)
            data.append({
                'case_text': text,
                'case_type': case_type,
                'severity_score': severity,
                'court_level': 'district_court',
                'timestamp': None
            })

        return pd.DataFrame(data)

    def _generate_mock_crime_data(self, n_samples):
        """Generate mock FIR/Crime dataset."""
        crime_types = ['theft', 'assault', 'fraud', 'cyber_crime', 'domestic_violence']
        templates = [
            "FIR registered for {crime} at {location}",
            "Complaint regarding {incident} involving {parties}",
            "Police report of {offense} under {section} IPC",
            "Criminal case filed for {violation} against {victim}"
        ]

        data = []
        for _ in range(n_samples):
            crime_type = random.choice(crime_types)
            template = random.choice(templates)

            text = template.format(
                crime=crime_type.replace('_', ' '),
                location=random.choice(['residential area', 'commercial complex', 'public place', 'workplace']),
                incident=random.choice(['theft', 'assault', 'fraudulent transaction', 'harassment']),
                parties=random.choice(['family members', 'neighbors', 'colleagues', 'strangers']),
                offense=random.choice(['theft', 'assault', 'cheating', 'criminal intimidation']),
                section=random.randint(379, 511),
                violation=random.choice(['privacy breach', 'property damage', 'physical harm']),
                victim=random.choice(['individual', 'business', 'organization'])
            )

            severity = self._calculate_severity_from_text(text, 'criminal_law')  # All crime data is criminal_law
            data.append({
                'case_text': text,
                'case_type': 'criminal_law',
                'severity_score': severity,
                'court_level': 'police_station',
                'timestamp': None
            })

        return pd.DataFrame(data)

    def _generate_user_style_cases(self, n_samples):
        """Generate mock user-input style cases for better ML training."""
        case_templates = {
            'labor_law': [
                "My boss hasn't paid my salary for {months} months",
                "Employer fired me without notice",
                "No overtime pay for extra hours worked",
                "Workplace harassment by manager",
                "Contract employee not getting benefits",
                "Salary delay every month",
                "Unfair termination from job",
                "Not getting paid for work done"
            ],
            'property_dispute': [
                "Landlord not returning security deposit",
                "Neighbor encroaching on my property",
                "Builder delayed possession of flat",
                "Rent not returned by tenant",
                "Property dispute with family",
                "House owner not giving possession",
                "Boundary wall dispute with neighbor",
                "Apartment maintenance issues"
            ],
            'family_law': [
                "Want to divorce my spouse",
                "Child custody battle",
                "Spouse not giving maintenance",
                "Domestic violence by husband",
                "Marriage dispute with in-laws",
                "Adoption process for child",
                "Maintenance for children",
                "Family property partition"
            ],
            'contract_dispute': [
                "Business partner cheated me",
                "Contract breach by supplier",
                "Client not paying for services",
                "Agreement violation by company",
                "Business deal gone wrong",
                "Vendor not delivering goods",
                "Service provider breach of contract",
                "Payment dispute with contractor"
            ],
            'consumer_rights': [
                "Bought defective product from store",
                "Mobile phone not working after 1 month",
                "Car dealer gave faulty vehicle",
                "Online shopping fraud",
                "Bank charged extra fees",
                "Insurance claim rejected unfairly",
                "Product warranty not honored",
                "Service quality very poor"
            ],
            'criminal_law': [
                "Someone stole my wallet",
                "Assaulted by unknown person",
                "Fraud by online scammer",
                "Threatened by neighbor",
                "Burglary in my house",
                "Cyber crime on my account",
                "Harassment by ex-partner",
                "Theft at workplace"
            ],
            'civil_dispute': [
                "Money lent not returned",
                "Dispute over loan repayment",
                "Neighbor nuisance complaint",
                "Boundary dispute",
                "Water supply dispute",
                "Parking space issue",
                "Noise pollution complaint",
                "General dispute with person"
            ]
        }

        data = []
        for _ in range(n_samples):
            case_type = random.choice(list(case_templates.keys()))
            template = random.choice(case_templates[case_type])

            # Fill in variables
            text = template.format(
                months=random.randint(1, 6),
                amount=random.randint(10000, 100000)
            )

            severity = self._calculate_severity_from_text(text, case_type)
            data.append({
                'case_text': text,
                'case_type': case_type,
                'severity_score': severity,
                'court_level': 'user_input',
                'timestamp': None
            })

        return pd.DataFrame(data)

    def _calculate_severity_from_text(self, text, case_type):
        """Calculate severity score based on text content and case type."""
        base_severity = {
            'constitutional_law': 0.8,
            'criminal_law': 0.9,
            'family_law': 0.6,
            'property_dispute': 0.5,
            'labor_law': 0.7,
            'contract_dispute': 0.4,
            'civil_dispute': 0.3,
            'consumer_rights': 0.2,
            'consumer_complaints': 0.2,
            'criminal_trial': 0.8,
            'criminal_appeal': 0.7,
            'civil_appeal': 0.4,
            'service_matters': 0.5,
            'taxation': 0.3
        }

        severity = base_severity.get(case_type, 0.5)

        # Adjust based on keywords
        high_severity_keywords = ['murder', 'rape', 'violence', 'death', 'injury', 'constitutional', 'fundamental rights', 'assault', 'threat', 'harassment', 'domestic violence']
        medium_severity_keywords = ['theft', 'fraud', 'breach', 'violation', 'dispute', 'fired', 'termination', 'delay', 'not paid']

        text_lower = text.lower()
        if any(keyword in text_lower for keyword in high_severity_keywords):
            severity = min(1.0, severity + 0.3)
        elif any(keyword in text_lower for keyword in medium_severity_keywords):
            severity = min(1.0, severity + 0.1)

        return round(severity, 3)

    def _add_timestamps(self, df):
        """Add timestamps to simulate real-time data."""
        now = datetime.now()
        timestamps = []

        for _ in range(len(df)):
            # Generate timestamps from last 2 years
            days_back = random.randint(0, 730)
            timestamp = now - timedelta(days=days_back)
            timestamps.append(timestamp.isoformat())

        df['timestamp'] = timestamps
        return df.sort_values('timestamp', ascending=False)

    def preprocess_dataset(self, df):
        """Clean and preprocess the dataset."""
        # Remove duplicates
        df = df.drop_duplicates(subset=['case_text'])

        # Clean text
        df['case_text'] = df['case_text'].str.strip()
        df['case_text'] = df['case_text'].str.replace(r'\s+', ' ', regex=True)

        # Encode labels
        df['case_type_encoded'] = self.label_encoder.fit_transform(df['case_type'])

        return df

    def create_training_data(self, df, test_size=0.3):
        """Split data into training and testing sets."""
        X = df['case_text']
        y_class = df['case_type']
        y_severity = df['severity_score']

        # Split for classification
        X_train_class, X_test_class, y_train_class, y_test_class = train_test_split(
            X, y_class, test_size=test_size, random_state=42, stratify=y_class
        )

        # Split for severity prediction
        X_train_sev, X_test_sev, y_train_sev, y_test_sev = train_test_split(
            X, y_severity, test_size=test_size, random_state=42
        )

        return {
            'classification': {
                'X_train': X_train_class,
                'X_test': X_test_class,
                'y_train': y_train_class,
                'y_test': y_test_class
            },
            'severity': {
                'X_train': X_train_sev,
                'X_test': X_test_sev,
                'y_train': y_train_sev,
                'y_test': y_test_sev
            }
        }

    def get_dataset_statistics(self, df):
        """Generate comprehensive dataset statistics."""
        stats = {
            'total_cases': len(df),
            'last_updated': datetime.now().isoformat(),
            'case_types': df['case_type'].value_counts().to_dict(),
            'court_levels': df['court_level'].value_counts().to_dict(),
            'severity_distribution': {
                'low': len(df[df['severity_score'] < 0.4]),
                'medium': len(df[(df['severity_score'] >= 0.4) & (df['severity_score'] < 0.7)]),
                'high': len(df[df['severity_score'] >= 0.7])
            },
            'top_case_types': [
                {'type': k, 'count': v}
                for k, v in df['case_type'].value_counts().head(6).items()
            ]
        }

        return stats

    def save_processed_dataset(self, df, filename='processed_legal_dataset.csv'):
        """Save processed dataset to file."""
        filepath = os.path.join(self.data_dir, filename)
        df.to_csv(filepath, index=False)
        print(f"Processed dataset saved to {filepath}")

    def simulate_realtime_updates(self, df):
        """Simulate real-time data updates."""
        # Add new cases periodically
        new_cases = []
        for _ in range(random.randint(1, 5)):
            case_type = random.choice(df['case_type'].unique())
            court_level = random.choice(df['court_level'].unique())

            new_case = {
                'case_text': f"New {case_type} case filed today at {court_level}",
                'case_type': case_type,
                'severity_score': random.uniform(0.1, 1.0),
                'court_level': court_level,
                'timestamp': datetime.now().isoformat()
            }
            new_cases.append(new_case)

        if new_cases:
            new_df = pd.DataFrame(new_cases)
            df = pd.concat([new_df, df], ignore_index=True)

        return df.sort_values('timestamp', ascending=False)


if __name__ == "__main__":
    # Initialize processor
    processor = LegalDatasetProcessor()

    # Load and process datasets
    print("Loading Indian legal datasets...")
    raw_dataset = processor.load_indian_legal_datasets()

    print(f"Raw dataset size: {len(raw_dataset)} cases")

    # Preprocess data
    print("Preprocessing dataset...")
    processed_dataset = processor.preprocess_dataset(raw_dataset)

    print(f"Processed dataset size: {len(processed_dataset)} cases")

    # Generate statistics
    stats = processor.get_dataset_statistics(processed_dataset)
    print(f"Dataset statistics: {stats}")

    # Save processed dataset
    processor.save_processed_dataset(processed_dataset)

    # Create training splits
    training_data = processor.create_training_data(processed_dataset)

    print("Dataset processing completed!")
    print(f"Classification training set: {len(training_data['classification']['X_train'])} samples")
    print(f"Severity training set: {len(training_data['severity']['X_train'])} samples")