from openai.embeddings_utils import cosine_similarity
import utils


def search(df, searchTerm, n=3, pprint=True):
    queryEmbedding = utils.get_embedding(
        searchTerm, model='text-embedding-ada-002')
    df['similarities'] = df.embedding.apply(
        lambda x: cosine_similarity(x, queryEmbedding))
    res = df.sort_values('similarities', ascending=False).head(n)
    return res.iloc[0]['sentence']
