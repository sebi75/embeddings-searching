import os
import time
import indexing
import searching
import pandas as pd
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

        filename_without_extension = os.path.splitext(filename)[0]

        indexing.process_sentences(os.path.join(
            app.config['UPLOAD_FOLDER'], filename), os.path.join("outputs", filename_without_extension + '.csv'))

        return jsonify({'message': f'File {filename} uploaded successfully'}), 200
    else:
        return jsonify({'error': 'File type not allowed'}), 400


@app.route("/getFilenames", methods=["GET"])
def getSavedUploads():
    filenames = os.listdir(app.config['UPLOAD_FOLDER'])
    return jsonify(list(filter(lambda fileName: fileName != '.gitkeep', filenames))), 200


@app.route("/search", methods=["POST"])
def search():
    filename = request.args.get('filename')
    search_term = request.args.get('searchTerm')

    if not filename or not search_term:
        return jsonify({'error': 'Missing parameters'}), 400

    # first try to get the csv file from the outputs folder
    filename_without_extension = os.path.splitext(filename)[0]
    csv_file_path = os.path.join(
        "outputs", filename_without_extension + '.csv')

    # try to read the file and put it into a pandas dataframe
    try:
        df = pd.read_csv(csv_file_path)
        print(df)
        start_time = time.time()
        try:
            # format the results to be a list of dictionaries with the following shape:
            # results if a pandas df with columns: ["sentence", "embedding", "similarities"]
            # [{ text: "some text", similarity: 0.123 }, ...}]
            results = searching.search(df, search_term, n=3, pprint=True)
            # extract the sentence and similarities columns and keep 2 decimal for similarities
            # then multiply by 100 to get a percentage
            results = results[["sentence", "similarities"]].apply(lambda row: {
                                                                  "text": row["sentence"], "score": round(row["similarities"] * 100, 2)}, axis=1).to_list()
            end_time = time.time()
            print(f"Search time: {end_time - start_time}")

            return jsonify(results), 200
        except:
            return jsonify({'error': 'Search failed'}), 400
    except:
        return jsonify({'error': 'File not found'}), 400


if __name__ == "__main__":
    app.run(port=5000, debug=True)
