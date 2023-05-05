from flask import Flask, jsonify
from flask_cors import CORS
import time

app = Flask("embeddings-searching")

CORS(app)


@app.route("/ping", methods=["GET"])
def ping():
    time.sleep(3)
    response = {"message": "pong!"}
    return jsonify(response)


if __name__ == "__main__":
    app.run(port=5000, debug=True)
