#!/usr/bin/env python3
"""
Dataset Processing Runner for LAW-MATE
Runs the dataset processor to generate training data and statistics.
"""

import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dataset_processor import LegalDatasetProcessor

def main():
    """Main function to run dataset processing."""
    print("LAW-MATE Dataset Processing Pipeline")
    print("=" * 40)

    # Initialize processor
    processor = LegalDatasetProcessor()

    try:
        # Load and process datasets
        print("Loading Indian legal datasets...")
        raw_dataset = processor.load_indian_legal_datasets()
        print(f"✓ Raw dataset loaded: {len(raw_dataset)} cases")

        # Preprocess data
        print("Preprocessing dataset...")
        processed_dataset = processor.preprocess_dataset(raw_dataset)
        print(f"✓ Dataset preprocessed: {len(processed_dataset)} cases")

        # Generate and display statistics
        stats = processor.get_dataset_statistics(processed_dataset)
        print("\nDataset Statistics:")
        print(f"  Total Cases: {stats['total_cases']}")
        print(f"  Case Types: {len(stats['case_types'])}")
        print(f"  Court Levels: {len(stats['court_levels'])}")
        print(f"  Severity Distribution:")
        print(f"    Low: {stats['severity_distribution']['low']}")
        print(f"    Medium: {stats['severity_distribution']['medium']}")
        print(f"    High: {stats['severity_distribution']['high']}")

        print("\nTop Case Types:")
        for case_type in stats['top_case_types'][:5]:
            print(f"  {case_type['type']}: {case_type['count']} cases")

        # Save processed dataset
        print("\nSaving processed dataset...")
        processor.save_processed_dataset(processed_dataset)
        print("✓ Processed dataset saved")

        # Create training data splits
        print("Creating training data splits...")
        training_data = processor.create_training_data(processed_dataset)
        print("✓ Training data splits created")
        print(f"  Classification: {len(training_data['classification']['X_train'])} train, {len(training_data['classification']['X_test'])} test")
        print(f"  Severity: {len(training_data['severity']['X_train'])} train, {len(training_data['severity']['X_test'])} test")

        print("\n" + "=" * 40)
        print("Dataset processing completed successfully!")
        print("You can now train the ML models using the processed data.")

    except Exception as e:
        print(f"Error during dataset processing: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()