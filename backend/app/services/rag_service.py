from openai import OpenAI

from app.core.config import settings
from app.services.embedding_service import embed_texts
from app.services.vector_store import query_top_chunks

client = OpenAI(api_key=settings.openai_api_key)

CHAT_MODEL = "gpt-4o-mini"

SYSTEM_PROMPT = """You are a helpful assistant that answers questions using ONLY the provided document context.

Rules:
- Answer only using the information in the given context.
- If the answer cannot be found in the context, clearly say: "The information is not available in the uploaded document."
- Do not use outside knowledge. Do not guess or invent information.
- Keep answers clear and concise.
"""


def build_context(chunks: list[dict]) -> str:
    parts = []
    for chunk in chunks:
        parts.append(f"[Chunk {chunk['chunk_id']}]\n{chunk['text']}")
    return "\n\n".join(parts)


def answer_question(question: str, top_k: int = 3) -> dict:
    question_embedding = embed_texts([question])[0]

    top_chunks = query_top_chunks(question_embedding, top_k=top_k)

    if not top_chunks:
        return {
            "answer": "No document has been uploaded yet, or no relevant content was found.",
            "sources": [],
        }

    context = build_context(top_chunks)

    user_message = f"""Context from the document:
{context}

Question: {question}

Answer the question using only the context above."""

    response = client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=0.2,
    )

    answer = response.choices[0].message.content

    sources = [
        {
            "chunk_id": c["chunk_id"],
            "content": c["text"],
            "score": round(1 - c["distance"], 4),
        }
        for c in top_chunks
    ]

    return {
        "answer": answer,
        "sources": sources,
    }