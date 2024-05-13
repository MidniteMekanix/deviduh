module.exports = {
  torch: true, // Enable installation of PyTorch and related libraries
  pytorchVersion: '', // Specify a version or leave empty for the latest
  xformers: true, // Enable xformers if needed
  transformers: true, // Enable Hugging Face Transformers
  tensorBoard: true, // Enable TensorBoard for visualization
  optuna: true, // Enable Optuna for hyperparameter optimization
  torchServe: true, // Enable TorchServe for model serving
  onnx: true, // Enable ONNX for model interoperability
  dali: true, // Enable NVIDIA DALI for data loading and augmentation
  albumentations: true, // Enable Albumentations for advanced image augmentation
  weightsBiases: true, // Enable Weights & Biases for experiment tracking
  mlflow: true // Enable MLflow for managing the machine learning lifecycle
};
