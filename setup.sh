#!/bin/bash

# Install Python dependencies
pip3 install -r requirements.txt

# Install Playwright and its dependencies
playwright install
python3 -m playwright install-deps

# Install Node.js dependencies
cd ui/
bun install  # Assuming Bun is used for Node.js package management

# Navigate back to the root directory
cd ..

# Set up environment variables or configurations if needed
export MLFLOW_TRACKING_URI=http://localhost:5000
export ARTIFACT_LOCATION=/path/to/artifacts

# Start TensorBoard in the background if needed
mkdir -p data/tensorboard_logs
tensorboard --logdir=data/tensorboard_logs --port=6006 &

# Start MLflow tracking server in the background
mkdir -p $ARTIFACT_LOCATION
mlflow server --backend-store-uri sqlite:///data/mlflow.db --default-artifact-root $ARTIFACT_LOCATION --host 0.0.0.0 --port 5000 &

# Additional setup for other AI tools
# For instance, initializing ONNX or Weights & Biases could be added here

echo "Setup completed successfully!"
