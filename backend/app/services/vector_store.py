import chromadb

from app.core.config import settings

_client = chromadb.PersistentClient(path=settings.chroma_db_dir)

COLLECTION_NAME = "document_chunks"


def get_collection():
    return _client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def reset_collection():
    try:
        _client.delete_collection(name=COLLECTION_NAME)
    except Exception:
        pass
    return get_collection()

def add_chunks(chunks: list[dict]):
    collection = get_collection()

    ids = [str(chunk["chunk_id"]) for chunk in chunks]
    embeddings = [chunk["embedding"] for chunk in chunks]
    documents = [chunk["text"] for chunk in chunks]
    metadatas = [
        {
            "chunk_id": chunk["chunk_id"],
            "token_count": chunk["token_count"],
        }
        for chunk in chunks
    ]

    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=documents,
        metadatas=metadatas,
    )


def query_top_chunks(query_embedding: list[float], top_k: int = 3):
    collection = get_collection()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )

    chunks = []
    for i in range(len(results["ids"][0])):
        chunks.append({
            "chunk_id": results["metadatas"][0][i]["chunk_id"],
            "text": results["documents"][0][i],
            "distance": results["distances"][0][i],
        })

    return chunks