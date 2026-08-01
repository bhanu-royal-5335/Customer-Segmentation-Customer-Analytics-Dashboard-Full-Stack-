import sys
import pandas as pd
from model import CustomerSegmentationModel

def run_training_script(file_path_or_df):
    """Standalone script to train K-Means model on dataset file or dataframe."""
    print("Initializing Customer Segmentation Training...")
    if isinstance(file_path_or_df, str):
        if file_path_or_df.endswith('.csv'):
            df = pd.read_csv(file_path_or_df)
        else:
            df = pd.read_excel(file_path_or_df)
    else:
        df = file_path_or_df

    model = CustomerSegmentationModel()
    results = model.train(df)
    print(f"Training completed! Optimal clusters: {results['n_clusters']}")
    for profile in results['profiles']:
        print(f" - Cluster {profile['cluster_id']}: {profile['name']} ({profile['count']} customers, {profile['percentage']}%)")
    return results

if __name__ == '__main__':
    dataset_file = sys.argv[1] if len(sys.argv) > 1 else '../sample_customers.csv'
    run_training_script(dataset_file)
