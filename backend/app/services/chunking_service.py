import tiktoken

ENCODING = tiktoken.get_encoding("cl100k_base")

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50


def count_tokens(text: str) -> int:
    return len(ENCODING.encode(text))


def chunk_text(
    text: str,
    chunk_size: int = CHUNK_SIZE,
    overlap: int = CHUNK_OVERLAP,
) -> list[dict]:
    tokens = ENCODING.encode(text)
    total_tokens = len(tokens)

    chunks = []
    start = 0
    chunk_id = 0

    while start < total_tokens:
        end = min(start + chunk_size, total_tokens)
        chunk_token_slice = tokens[start:end]
        chunk_content = ENCODING.decode(chunk_token_slice)

        chunks.append({
            "chunk_id": chunk_id,
            "text": chunk_content,
            "token_count": len(chunk_token_slice),
            "start_token": start,
            "end_token": end,
        })

        chunk_id += 1

        if end == total_tokens:
            break

        start = end - overlap

    return chunks
