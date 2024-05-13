"""
    DO NOT REARRANGE THE ORDER OF THE FUNCTION CALLS AND VARIABLE DECLARATIONS
    AS IT MAY CAUSE IMPORT ERRORS AND OTHER ISSUES
"""
from gevent import monkey
monkey.patch_all()
from src.init import init_devika
init_devika()

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from src.socket_instance import socketio, emit_agent
import os
import logging
from threading import Thread
import tiktoken

from src.apis.project import project_bp
from src.config import Config
from src.logger import Logger, route_logger
from src.project import ProjectManager
from src.state import AgentState
from src.agents import Agent
from src.llm import LLM

# Import MLflow, TensorBoard, or other tools if needed
from mlflow import log_metrics, start_run
from tensorboard import program


app = Flask(__name__)
CORS(app)
app.register_blueprint(project_bp)
socketio.init_app(app)

log = logging.getLogger("werkzeug")
log.disabled = True

TIKTOKEN_ENC = tiktoken.get_encoding("cl100k_base")

os.environ["TOKENIZERS_PARALLELISM"] = "false"

manager = ProjectManager()
AgentState = AgentState()
config = Config()
logger = Logger()

# Initialize MLflow if configured
if config.mlflow:
    mlflow.set_tracking_uri(config.mlflow_tracking_uri)

# Initialize TensorBoard if configured
if config.tensorBoard:
    tb = program.TensorBoard()
    tb.configure(argv=[None, '--logdir', 'logs'])
    tb.launch()

# initial socket
@socketio.on('socket_connect')
def test_connect(data):
    print("Socket connected :: ", data)
    emit_agent("socket_response", {"data": "Server Connected"})

# Implementing API routes to interact with the new tools
@app.route("/api/tensorboard", methods=["GET"])
@route_logger(logger)
def tensorboard():
    return jsonify({"tensorboard_url": tb.url})

@app.route("/api/mlflow", methods=["GET"])
@route_logger(logger)
def mlflow_dashboard():
    return jsonify({"mlflow_dashboard_url": config.mlflow_tracking_uri})

# Rest of the existing code remains the same...

if __name__ == "__main__":
    logger.info("Devika is up and running!")
    socketio.run(app, debug=False, port=1337, host="0.0.0.0")
