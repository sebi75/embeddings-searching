import openai
import pandas as pd
import json
import csv
import utils


filePath = "./speech-transcript.pdf"


def get_embedding(text, model="text-embedding-ada-002"):
    return openai.Embedding.create(input=[text], model=model)['data'][0]['embedding']


def main():
    """ First ypu want to get the sentences from the file with the contents """
    sentences = utils.get_sentences(filePath)
    """ Then you want to get the embeddings for each sentence and place it in a pandas dataframe """
    # text_embedding = get_embedding(sentences[0])

    columns = ["sentence", "embedding"]
    dataframe = pd.DataFrame(columns=columns)
    print(sentences[0])
    # dataframe["sentence"] = sentences

    # print(dataframe)

    # print(sentences)


if __name__ == "__main__":
    main()
