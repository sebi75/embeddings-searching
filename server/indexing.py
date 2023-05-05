import utils
import pandas as pd


def process_sentences(filePath: str, output: str):
    """ First ypu want to get the sentences from the file with the contents """
    sentences = utils.get_sentences(filePath)
    """ Then you want to get the embeddings for each sentence and place it in a pandas dataframe """

    columns = ["sentence", "embedding"]
    dataframe = pd.DataFrame(columns=columns)

    dataframe["sentence"] = sentences
    dataframe["embedding"] = dataframe["sentence"].apply(utils.get_embedding)

    dataframe.to_csv(output, index=False)

    print("Done! Check the output file: ", output)
