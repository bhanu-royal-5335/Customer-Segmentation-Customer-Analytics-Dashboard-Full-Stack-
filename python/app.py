import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import CustomerSegmentationModel, CLUSTER_LABELS

app = Flask(__name__)
CORS(app)

model = CustomerSegmentationModel()

@app.route('/health', methods=['GET'])
def health_check():
    is_loaded = model.load_model()
    return jsonify({
        'status': 'healthy',
        'service': 'Python ML Segmentation API',
        'model_loaded': is_loaded,
        'n_clusters': model.n_clusters
    })

@app.route('/train', methods=['POST'])
def train_model():
    """Train K-Means ML model on incoming array of customer records."""
    try:
        data = request.json
        if not data or not isinstance(data, list) or len(data) == 0:
            return jsonify({'error': 'Payload must be a non-empty list of customer records'}), 400

        n_clusters = request.args.get('clusters', type=int)
        trainer = CustomerSegmentationModel(n_clusters=n_clusters)
        results = trainer.train(data)
        
        # Keep app global model instance synced
        global model
        model = trainer

        return jsonify({
            'success': True,
            'message': 'K-Means clustering trained successfully',
            'n_clusters': results['n_clusters'],
            'cluster_labels': results['labels'],
            'profiles': results['profiles']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict_segment():
    """Predict segment for a customer profile."""
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'Missing customer data payload'}), 400

        payload = [data] if isinstance(data, dict) else data
        predictions = model.predict(payload)
        
        return jsonify({
            'success': True,
            'predictions': predictions if isinstance(data, list) else predictions[0]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/clusters', methods=['GET'])
def get_clusters():
    """Get metadata for all defined customer clusters/personas."""
    profiles = []
    for cid, meta in CLUSTER_LABELS.items():
        profiles.append({
            'cluster_id': cid,
            'name': meta['title'],
            'badge': meta['badge'],
            'color': meta['color'],
            'description': meta['description'],
            'strategy': meta['strategy']
        })
    return jsonify({
        'success': True,
        'clusters': profiles
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"Starting Python ML Flask API on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
