module.exports = async (kernel) => {
  const script = {
    daemon: true,
    run: [{
      method: "shell.run",
      params: {
        path: "app",
        venv: "env",
        env: {},
        message: ["python devika.py"],
        on: [{ "event": "/Devika is up and running/i", "done": true }]
      }
    }, {
      method: "shell.run",
      params: {
        path: "app/ui",
        message: "npm run dev",
        on: [{ "event": "/http:\/\/[a-z0-9.:]+/", "done": true }]
      }
    }, {
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
    }]
  };

  // Additional error handling could be implemented here

  return script;
}
