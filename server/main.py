import openai
import json
import csv
import utils


filePath = "./speech-transcript.pdf"


def get_embedding(text, model="text-embedding-ada-002"):
    return openai.Embedding.create(input=[text], model=model)['data'][0]['embedding']


def main():
    sentences = utils.get_sentences(filePath)
    text_embedding = get_embedding(sentences[0])
    print(text_embedding)

    # print(sentences)


if __name__ == "__main__":
    main()
