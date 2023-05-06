import indexing
import searching
import pandas as pd


class CLIApp:
    def __init__(self, output: str, filePath: str):
        self.__output = output
        self.__filePath = filePath

    # This processes the document text and for each paragraph, it makes a call to the OpenAI embeddings API
    # to get the embeddings for each paragraph. We put it in a pandas dataframe in the embedding column.
    # Then we are ready to save it to a CSV file.
    def process_sentences(self):
        indexing.process_sentences(self.__filePath, self.__output)

    def process_search(self):
        """ Read the output file and get the embeddings """
        dataframe = pd.read_csv(self.__output)

        """ Get the search term """
        searchTerm = input("Enter a search term: ")
        res = searching.search(dataframe, searchTerm)

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
