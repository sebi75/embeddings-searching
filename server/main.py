import csv
import json
import utils
import openai
import numpy as np
import pandas as pd
from openai.embeddings_utils import cosine_similarity, get_embedding


filePath = "./speech-transcript.pdf"
outputName = "output.csv"


def get_embedding(text, model="text-embedding-ada-002"):
    return openai.Embedding.create(input=[text], model=model)['data'][0]['embedding']


def search(df, searchTerm, n=3, pprint=True):
    queryEmbedding = get_embedding(searchTerm, model='text-embedding-ada-002')
    df['similarities'] = df.embedding.apply(
        lambda x: cosine_similarity(x, queryEmbedding))
    res = df.sort_values('similarities', ascending=False).head(n)
    return res


def main():
    while True:
        command = input("Enter a command: ")
        if int(command) == 1:
            """ First ypu want to get the sentences from the file with the contents """
            sentences = utils.get_sentences(filePath)
            """ Then you want to get the embeddings for each sentence and place it in a pandas dataframe """
            # text_embedding = get_embedding(sentences[0])

            columns = ["sentence", "embedding"]
            dataframe = pd.DataFrame(columns=columns)
            print(sentences[0])
            dataframe["sentence"] = sentences
            dataframe["embedding"] = dataframe["sentence"].apply(get_embedding)

            dataframe.to_csv(outputName, index=False)

            print("Done! Check the output file: ", outputName)
        elif int(command) == 2:
            """ Read the output file and get the embeddings """
            dataframe = pd.read_csv(outputName)

            """ Get the search term """
            searchTerm = input("Enter a search term: ")
            dataframe['embedding'] = dataframe.embedding.apply(
                eval).apply(np.array)
            res = search(dataframe, searchTerm)

            print(res)

        elif int(command) == 0:
            break


if __name__ == "__main__":
    main()
