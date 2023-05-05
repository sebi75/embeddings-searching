import utils
import openai
import numpy as np
import pandas as pd
from openai.embeddings_utils import cosine_similarity, get_embedding


class CLIApp:
    def __init__(self, output: str, filePath: str):
        self.__output = output
        self.__filePath = filePath

    def get_embedding(self, text, model="text-embedding-ada-002"):
        return openai.Embedding.create(input=[text], model=model)['data'][0]['embedding']

    def search(self, df, searchTerm, n=3, pprint=True):
        queryEmbedding = self.get_embedding(
            searchTerm, model='text-embedding-ada-002')
        df['similarities'] = df.embedding.apply(
            lambda x: cosine_similarity(x, queryEmbedding))
        res = df.sort_values('similarities', ascending=False).head(n)
        return res.iloc[0]['sentence']

    # This processes the document text and for each paragraph, it makes a call to the OpenAI embeddings API
    # to get the embeddings for each paragraph. We put it in a pandas dataframe in the embedding column.
    # Then we are ready to save it to a CSV file.
    def process_sentences(self):
        """ First ypu want to get the sentences from the file with the contents """
        sentences = utils.get_sentences(self.__filePath)
        """ Then you want to get the embeddings for each sentence and place it in a pandas dataframe """

        columns = ["sentence", "embedding"]
        dataframe = pd.DataFrame(columns=columns)

        dataframe["sentence"] = sentences
        dataframe["embedding"] = dataframe["sentence"].apply(
            self.get_embedding)

        dataframe.to_csv(self.__output, index=False)

        print("Done! Check the output file: ", self.__output)

    def process_search(self):
        """ Read the output file and get the embeddings """
        dataframe = pd.read_csv(self.__output)

        """ Get the search term """
        searchTerm = input("Enter a search term: ")
        dataframe['embedding'] = dataframe.embedding.apply(
            eval).apply(np.array)
        res = self.search(dataframe, searchTerm)

        print(res)

    def run(self):
        while True:
            command = input("Enter a command: ")
            if int(command) == 1:
                self.process_sentences()
            elif int(command) == 2:
                self.process_search()
            elif int(command) == 0:
                print("\n\nBye!\n\n")
                break


if __name__ == "__main__":
    filePath = "./speech-transcript.pdf"
    outputName = "output.csv"
    cliApp = CLIApp(outputName, filePath)
    cliApp.run()
