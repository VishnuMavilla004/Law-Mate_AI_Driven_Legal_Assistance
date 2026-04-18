#!/usr/bin/env python3
"""
Test script for LAW-MATE ML Service
Tests all endpoints with sample data.
"""

import requests
import json
import time

ML_SERVICE_URL = 'http://localhost:8000'

def test_endpoint(endpoint, payload, description):
    """Test a single endpoint."""
    print(f"\n🧪 Testing {description}...")
    try:
        response = requests.post(f"{ML_SERVICE_URL}{endpoint}", json=payload, timeout=10)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success: {result}")
            return True, result
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")
            return False, None
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return False, None

def test_health():
    """Test health endpoint."""
    print("\n🏥 Testing health check...")
    try:
        response = requests.get(f"{ML_SERVICE_URL}/health", timeout=5)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Health check passed: {result}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check error: {e}")
        return False

def main():
    """Run all tests."""
    print("LAW-MATE ML Service Test Suite")
    print("=" * 40)

    # Test health first
    if not test_health():
        print("❌ ML service is not running. Please start it with: python ml_service.py")
        return

    # Test data
    test_cases = [
        {
            "endpoint": "/classify",
            "payload": {"text": "My employer has not paid my salary for three months."},
            "description": "Legal Case Classification"
        },
        {
            "endpoint": "/severity",
            "payload": {"text": "My colleague keeps sending threatening messages."},
            "description": "Severity Prediction"
        },
        {
            "endpoint": "/similarity",
            "payload": {"text": "My landlord is not returning my security deposit."},
            "description": "Case Similarity Search"
        },
        {
            "endpoint": "/analyze",
            "payload": {"text": "I was involved in a car accident and the other driver fled."},
            "description": "Complete ML Analysis"
        }
    ]

    passed = 0
    total = len(test_cases)

    for test_case in test_cases:
        success, _ = test_endpoint(
            test_case["endpoint"],
            test_case["payload"],
            test_case["description"]
        )
        if success:
            passed += 1
        time.sleep(0.5)  # Small delay between tests

    print(f"\n{'='*40}")
    print(f"Test Results: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! ML service is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")

if __name__ == "__main__":
    main()