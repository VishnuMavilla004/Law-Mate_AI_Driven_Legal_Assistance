#!/usr/bin/env python3
"""
Training script runner for LAW-MATE ML models.
Runs all training scripts in sequence.
"""

import subprocess
import sys
import os

def run_training_script(script_name):
    """Run a training script and check for success."""
    print(f"\n{'='*50}")
    print(f"Running {script_name}...")
    print('='*50)

    try:
        result = subprocess.run([sys.executable, script_name],
                              capture_output=True, text=True, cwd=os.path.dirname(__file__))

        print(result.stdout)
        if result.stderr:
            print("Errors:", result.stderr)

        if result.returncode != 0:
            print(f"❌ {script_name} failed with return code {result.returncode}")
            return False
        else:
            print(f"✅ {script_name} completed successfully")
            return True

    except Exception as e:
        print(f"❌ Error running {script_name}: {e}")
        return False

def main():
    """Run all training scripts."""
    print("LAW-MATE ML Model Training")
    print("This will train all machine learning models for the legal assistant.")

    scripts = [
        'train_classifier.py',
        'train_severity.py',
        'train_similarity.py'
    ]

    success_count = 0

    for script in scripts:
        if os.path.exists(script):
            if run_training_script(script):
                success_count += 1
        else:
            print(f"⚠️  {script} not found, skipping...")

    print(f"\n{'='*50}")
    print(f"Training completed: {success_count}/{len(scripts)} scripts successful")

    if success_count == len(scripts):
        print("🎉 All models trained successfully!")
        print("You can now start the ML service with: python ml_service.py")
    else:
        print("⚠️  Some training scripts failed. Check the output above for details.")

if __name__ == "__main__":
    main()