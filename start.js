const config = require('./config.js');

module.exports = async (kernel) => {
  const script = {
    daemon: true,
    run: [
      {
        method: "shell.run",
        params: {
          path: "app",
          venv: "env",
          env: {},
          message: ["python devika.py"],
          on: [{ "event": "/Devika is up and running/i", "done": true }]
        }
      },
      {
        method: "shell.run",
        params: {
          path: "app/ui",
          message: "npm run dev",
          on: [{ "event": "/http:\/\/[a-z0-9.:]+/", "done": true }]
        }
      }
    ]
  };

  // Start additional AI tools based on configuration
  if (config.tensorBoard) {
    script.run.push({
      method: "shell.run",
      params: {
        path: "app",
        message: "tensorboard --logdir=logs",
        on: [{ "event": "/TensorBoard started at/i", "done": true }]
      }
    });
  }

  if (config.torchServe) {
    script.run.push({
      method: "shell.run",
      params: {
        path: "app",
        message: "torchserve --start",
        on: [{ "event": "/TorchServe started successfully/i", "done": true }]
      }
    });
  }

  if (config.mlflow) {
    script.run.push({
      method: "shell.run",
      params: {
        path: "app",
        message: "mlflow ui",
        on: [{ "event": "/MLflow UI running at/i", "done": true }]
      }
    });
  }

  // Additional handling for dynamic URLs if needed
  script.run.push({
    method: "local.set",
    params: {
      url: "{{input.event[0]}}"
    },
  }, {
    method: "proxy.start",
    params: {
      uri: "{{local.url}}",
      name: "Local Sharing"
    }
  });

  // Implementing error handling and management
  try {
    // Execute the script and return the results
    const executionResult = await executeScript(kernel, script);
    console.log("Services started successfully.", executionResult);
    return executionResult;
  } catch (error) {
    console.error('Error starting services:', error);
    return null; // Return null or handle more gracefully depending on requirements
  }
};

// Dummy function to mimic script execution
async function executeScript(kernel, script) {
  // This should implement the logic to execute the script based on the 'kernel' environment
  console.log("Executing script:", script);
  return "Script executed successfully";
}
