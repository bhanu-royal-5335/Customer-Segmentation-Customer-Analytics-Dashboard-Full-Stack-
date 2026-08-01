import sys
import json
import pandas as pd
from model import CustomerSegmentationModel

def run_prediction(customer_dict):
    model = CustomerSegmentationModel()
    if not model.load_model():
        print("No pre-trained model found. Fitting default model...")
        sample_df = pd.DataFrame([customer_dict])
        model.train(sample_df)
    
    results = model.predict([customer_dict])
    return results[0]

if __name__ == '__main__':
    sample_customer = {
        'Age': 34,
        'Income': 85000,
        'Annual Spending': 4200,
        'Purchase Frequency': 18,
        'Average Order Value': 175,
        'Number of Orders': 24
    }
    if len(sys.argv) > 1:
        sample_customer = json.loads(sys.argv[1])
        
    result = run_prediction(sample_customer)
    print("Prediction Result:", json.dumps(result, indent=2))
