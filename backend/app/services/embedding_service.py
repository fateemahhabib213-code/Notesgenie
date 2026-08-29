from openai import OpenAI

from app.core.config import settings

client = OpenAI(api_key=settings.openai_api_key)

EMBEDDING_MODEL = "text-embedding-3-small"


def embed_texts(texts: list[str]) -> list[list[float]]:
    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=texts,
    )
    return [item.embedding for item in response.data]


def embed_chunks(chunks: list[dict]) -> list[dict]:
    texts = [chunk["text"] for chunk in chunks]
    embeddings = embed_texts(texts)

    for chunk, embedding in zip(chunks, embeddings):
        chunk["embedding"] = embedding

    return chunks