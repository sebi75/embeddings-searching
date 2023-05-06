import os
import time
from flask_cors import CORS
from appUtils import allowed_file
from flask import Flask, jsonify, request
from common import UPLOAD_FOLDER

app = Flask("embeddings-searching")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app)


@app.route("/ping", methods=["GET"])
def ping():
    response = {"message": "pong!"}
    return jsonify(response)


@app.route("/index", methods=["POST"])
def index():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    if file and allowed_file(file.filename):
        filename = file.filename
        file.save(os.path.join(
            app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'message': f'File {filename} uploaded successfully'}), 200
    else:
        return jsonify({'error': 'File type not allowed'}), 400


@app.route("/getFilenames", methods=["GET"])
def getSavedUploads():
    filenames = os.listdir(app.config['UPLOAD_FOLDER'])
    return jsonify(list(filter(lambda fileName: fileName != '.gitkeep', filenames))), 200


if __name__ == "__main__":
    app.run(port=5000, debug=True)
