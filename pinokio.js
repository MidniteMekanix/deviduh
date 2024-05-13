const path = require('path');

// Define icon constants for easy reference and management
const ICONS = {
  plug: "fa-solid fa-plug",
  rocket: "fa-solid fa-rocket",
  terminal: "fa-solid fa-terminal",
  powerOff: "fa-solid fa-power-off",
  key: "fa-solid fa-key",
  reset: "fa-regular fa-circle-xmark",
  chartBar: "fa-solid fa-chart-bar", // Example icon for TensorBoard
  experiment: "fa-solid fa-flask", // Example icon for MLflow or Weights & Biases
};

const config = require("./config.js");

module.exports = {
  version: "1.5",
  title: "Devika",
  description: "Agentic AI Software Engineer https://github.com/stitionai/devika",
  icon: "icon.png",
  menu: async (kernel) => {
    try {
      const [installing, installed, running] = await Promise.all([
        kernel.running(__dirname, "install.js"),
        kernel.exists(__dirname, "app", "env"),
        kernel.running(__dirname, "start.js")
      ]);

      let menuItems = [];

      if (installing) {
        menuItems.push({ icon: ICONS.plug, text: "Installing", href: "install.js" });
      }

      if (installed && !installing) {
        menuItems.push(
          { icon: ICONS.powerOff, text: "Start", href: "start.js" },
          { icon: ICONS.plug, text: "Update", href: "update.js" },
          { icon: ICONS.plug, text: "Install", href: "install.js" },
          { icon: ICONS.reset, text: "Reset", href: "reset.js" }
        );

        if (running) {
          menuItems.push({ icon: ICONS.terminal, text: "Terminal", href: "start.js" });

          // Conditional feature links based on config
          if (config.tensorBoard) {
            menuItems.push({ icon: ICONS.chartBar, text: "TensorBoard", href: "/tensorboard" });
          }
          if (config.mlflow || config.weightsBiases) {
            menuItems.push({ icon: ICONS.experiment, text: "Experiment Tracking", href: "/experiments" });
          }
        }
      } else {
        menuItems.push({ icon: ICONS.plug, text: "Install", href: "install.js" });
      }

      return menuItems;
    } catch (error) {
      console.error("Error generating menu:", error);
      return [{ icon: ICONS.reset, text: "Error Loading Menu", href: "#" }];
    }
  }
};
