import os
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, 'customer_kmeans_model.pkl')
SCALER_PATH = os.path.join(MODEL_DIR, 'customer_scaler.pkl')

FEATURE_COLUMNS = [
    'Age',
    'Income',
    'Annual Spending',
    'Purchase Frequency',
    'Average Order Value',
    'Number of Orders'
]

CLUSTER_LABELS = {
    0: {
        'title': 'High Value / Premium Customers',
        'badge': 'Premium',
        'color': '#3B82F6', # Blue
        'description': 'High income and spending with frequent, large order purchases. Target with VIP rewards & early product access.',
        'strategy': 'Exclusive loyalty programs, personal account managers, high-end cross-selling.'
    },
    1: {
        'title': 'Loyal Frequent Buyers',
        'badge': 'Loyal',
        'color': '#10B981', # Emerald
        'description': 'High order frequency and regular engagement. Steady contributors to recurring revenue.',
        'strategy': 'Subscription incentives, feedback surveys, frequency-based rewards.'
    },
    2: {
        'title': 'Potential High-Spenders',
        'badge': 'Potential',
        'color': '#8B5CF6', # Purple
        'description': 'High income background with moderate spending. Opportunity to upscale basket size.',
        'strategy': 'Personalized product recommendations, bundle discounts, targeted upselling.'
    },
    3: {
        'title': 'Budget / Price Sensitive',
        'badge': 'Budget',
        'color': '#F59E0B', # Amber
        'description': 'Lower income or modest budget. Values discounts, seasonal sales, and high-value promotions.',
        'strategy': 'Flash sales, coupon codes, affordable product highlights.'
    },
    4: {
        'title': 'Inactive / At Risk',
        'badge': 'Needs Marketing',
        'color': '#EF4444', # Red
        'description': 'Low engagement, low order counts, or long periods since last purchase.',
        'strategy': 'Re-engagement email sequences, win-back discounts, survey outreach.'
    }
}

class CustomerSegmentationModel:
    def __init__(self, n_clusters=None):
        self.n_clusters = n_clusters
        self.scaler = StandardScaler()
        self.kmeans = None
        self.cluster_centers_df = None
        self.optimal_k = 4

    def preprocess_data(self, df):
        """Standardize column names and extract required numerical features."""
        # Ensure column mapping or case insensitive check
        mapping = {}
        for col in df.columns:
            clean = col.strip().lower()
            if 'age' in clean: mapping[col] = 'Age'
            elif 'income' in clean: mapping[col] = 'Income'
            elif 'annual' in clean or 'spending' in clean: mapping[col] = 'Annual Spending'
            elif 'frequency' in clean: mapping[col] = 'Purchase Frequency'
            elif 'average order' in clean or 'avg order' in clean or 'aov' in clean: mapping[col] = 'Average Order Value'
            elif 'number of order' in clean or 'num order' in clean or 'total order' in clean: mapping[col] = 'Number of Orders'
        
        df_renamed = df.rename(columns=mapping)
        
        # Fill missing features with median/zero
        for feat in FEATURE_COLUMNS:
            if feat not in df_renamed.columns:
                df_renamed[feat] = 0
            else:
                df_renamed[feat] = pd.to_numeric(df_renamed[feat], errors='coerce').fillna(0)
                
        return df_renamed[FEATURE_COLUMNS]

    def find_optimal_clusters(self, X_scaled, max_k=6):
        """Use Silhouette analysis and Elbow method to determine optimal k."""
        n_samples = len(X_scaled)
        if n_samples < 4:
            return min(n_samples, 3)

        max_k = min(max_k, n_samples - 1)
        best_k = 4
        best_score = -1

        for k in range(2, max_k + 1):
            km = KMeans(n_clusters=k, random_state=42, n_init=10)
            labels = km.fit_predict(X_scaled)
            score = silhouette_score(X_scaled, labels)
            if score > best_score:
                best_score = score
                best_k = k

        return best_k

    def train(self, data):
        """Train K-Means clustering model on customer feature matrix."""
        df_features = self.preprocess_data(pd.DataFrame(data))
        X_scaled = self.scaler.fit_transform(df_features)

        if self.n_clusters is None:
            self.n_clusters = self.find_optimal_clusters(X_scaled)
        
        self.optimal_k = self.n_clusters
        self.kmeans = KMeans(n_clusters=self.n_clusters, random_state=42, n_init=10)
        labels = self.kmeans.fit_predict(X_scaled)

        # Unscale cluster centers for interpretation
        centers_unscaled = self.scaler.inverse_transform(self.kmeans.cluster_centers_)
        self.cluster_centers_df = pd.DataFrame(centers_unscaled, columns=FEATURE_COLUMNS)

        # Assign cluster metadata personas
        profiles = []
        for i in range(self.n_clusters):
            meta = CLUSTER_LABELS.get(i % len(CLUSTER_LABELS), {
                'title': f'Segment {i + 1}',
                'badge': f'Cluster {i + 1}',
                'color': '#6366F1',
                'description': 'Customer behavioral cluster.',
                'strategy': 'Targeted marketing campaign.'
            })
            
            center_info = self.cluster_centers_df.iloc[i].to_dict()
            count = int(np.sum(labels == i))
            
            profiles.append({
                'cluster_id': i,
                'name': meta['title'],
                'badge': meta['badge'],
                'color': meta['color'],
                'description': meta['description'],
                'strategy': meta['strategy'],
                'count': count,
                'percentage': round((count / len(labels)) * 100, 1),
                'averages': {k: round(float(v), 2) for k, v in center_info.items()}
            })

        self.save_model()

        return {
            'labels': [int(l) for l in labels],
            'n_clusters': self.n_clusters,
            'profiles': profiles
        }

    def predict(self, customer_data):
        """Predict cluster segment ID and persona for a single or multiple customers."""
        if self.kmeans is None or self.scaler is None:
            self.load_model()

        df_feat = self.preprocess_data(pd.DataFrame(customer_data))
        X_scaled = self.scaler.transform(df_feat)
        cluster_ids = self.kmeans.predict(X_scaled)
        
        results = []
        for cid in cluster_ids:
            meta = CLUSTER_LABELS.get(cid % len(CLUSTER_LABELS), {
                'title': f'Segment {cid + 1}',
                'badge': f'Cluster {cid + 1}',
                'color': '#6366F1'
            })
            results.append({
                'cluster_id': int(cid),
                'segment_name': meta['title'],
                'badge': meta['badge'],
                'color': meta['color']
            })
        return results

    def save_model(self):
        """Save trained model & scaler to disk."""
        joblib.dump(self.kmeans, MODEL_PATH)
        joblib.dump(self.scaler, SCALER_PATH)

    def load_model(self):
        """Load trained model & scaler from disk if available."""
        if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
            self.kmeans = joblib.load(MODEL_PATH)
            self.scaler = joblib.load(SCALER_PATH)
            self.n_clusters = self.kmeans.n_clusters
            return True
        return False
