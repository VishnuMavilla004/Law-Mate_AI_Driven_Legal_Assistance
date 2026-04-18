import requests
import json

test_cases = [
    'My employer has not paid my salary for three months',
    'I was robbed at gunpoint',
    'My landlord refuses to return my security deposit',
    'I want to divorce my spouse',
    'Someone cheated me in a business deal'
]

for i, case in enumerate(test_cases):
    print(f'Test case {i+1}: {case[:50]}...')

    # Test classification
    try:
        response = requests.post('http://localhost:8000/classify', json={'text': case})
        result = response.json()
        print(f'  Category: {result.get("category", "N/A")}, Confidence: {result.get("confidence", 0):.2f}, Heuristic: {result.get("is_heuristic", False)}')
    except Exception as e:
        print(f'  Classification error: {e}')

    # Test severity
    try:
        response = requests.post('http://localhost:8000/severity', json={'text': case})
        result = response.json()
        print(f'  Severity: {result.get("severity_score", 0):.2f}, Risk: {result.get("risk_level", "N/A")}')
    except Exception as e:
        print(f'  Severity error: {e}')

    print()