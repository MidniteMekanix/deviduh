const config = require("./config.js");
const pre = require("./pre.js");

module.exports = async (kernel) => {
  const script = {
    run: [
      {
        method: "shell.run",
        params: {
          message: ["git clone https://github.com/stitionai/devika app"],
        }
      },
      {
        method: "shell.run",
        params: {
          venv: "env",
          path: "app",
          message: [
            "pip install -r requirements.txt", 
            config.torch ? `pip install torch${config.pytorchVersion ? `==${config.pytorchVersion}` : ''} torchvision${config.pytorchVersion ? `==${config.pytorchVersion}` : ''} torchaudio${config.pytorchVersion ? `==${config.pytorchVersion}` : ''}` : "",
            config.transformers ? "pip install transformers" : "",
            config.tensorBoard ? "pip install tensorboard" : "",
            config.optuna ? "pip install optuna" : "",
            config.torchServe ? "pip install torchserve torch-model-archiver" : "",
            config.onnx ? "pip install onnx onnxruntime" : "",
            config.dali ? "pip install nvidia-dali-cuda110" : "", // Adjust CUDA version as necessary
            config.albumentations ? "pip install albumentations" : "",
            config.weightsBiases ? "pip install wandb" : "",
            config.mlflow ? "pip install mlflow" : ""
          ].filter(Boolean).join(" && ")
        }
      },
      {
        method: "shell.run",
        params: {
          path: "app/ui",
          message: "npm install"
        }
      },
      {
        method: "notify",
        params: {
          html: "Click the 'start' tab to get started!"
        }
      }
    ]
  };

  // Incorporating pre.js logic if applicable
  const preCommand = pre(config, kernel);
  if (preCommand) {
    script.run[1].params.message = [preCommand].concat(script.run[1].params.message);
  }

  try {
    // Execute the installation script and handle any errors
    await executeInstallationScript(script);
    console.log("Installation completed successfully.");
  } catch (error) {
    console.error('Error setting up the script:', error);
    return null; // Return or handle more gracefully depending on requirements
  }
};

async function executeInstallationScript(script) {
  // Placeholder for executing the script
  // This function should implement the actual command execution logic
  console.log("Executing script:", script);
}
