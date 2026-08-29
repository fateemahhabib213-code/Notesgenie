# Architecture — NotesGenie

This document explains the technical design decisions behind NotesGenie, why they were made, and what trade-offs came with them.

---

## 1. Architecture Overview

NotesGenie follows a **Retrieval-Augmented Generation (RAG)** architecture with two distinct phases:

**Indexing phase** (runs once, when a document is uploaded):
```
Upload → Extract Text → Chunk (~500 tokens, 50 overlap) → Embed (OpenAI) → Store (ChromaDB)
```

**Answering phase** (runs on every question):
```
Question → Embed Question → Retrieve Top-3 Chunks → Build Context → OpenAI Chat Model → Grounded Answer + Sources
```

The backend (FastAPI) is intentionally **stateless** between requests — the only persistent state is the ChromaDB vector store on disk. This keeps the system simple to reason about: there's no session management, no database migrations, and no server-side memory to leak or corrupt.

---

## 2. Why FastAPI

- **Async-native**: file uploads and OpenAI API calls are I/O-bound; FastAPI's `async`/`await` support keeps the server responsive without extra tooling.
- **Automatic validation**: Pydantic models validate every request/response shape, catching malformed input before it reaches business logic.
- **Built-in docs**: the `/docs` Swagger UI was used throughout development to test endpoints manually before the frontend existed, which sped up iteration significantly.
- It matched the task brief's required stack, and the author had prior FastAPI experience, reducing setup risk under a tight deadline.

## 3. Why React (+ Vite)

- Vite's dev server and HMR made iterating on UI components fast.
- React's component model mapped naturally onto the problem: an upload flow, a chat flow, and a sources panel are naturally separable, independently testable units of UI.
- No server-side rendering or routing framework was needed — this is a single-workflow tool (upload → ask), so adding React Router would have been unnecessary complexity for the actual problem being solved.

## 4. Why OpenAI for Embeddings and Chat

The original task brief specified Google's `text-embedding-004` and a Gemini chat model. During development, `text-embedding-004` was found to have been deprecated and shut down by Google. Since the API call would fail outright, a substitution was necessary.

**`text-embedding-3-small`** was chosen because:
- It's actively supported and inexpensive (~$0.02 / 1M tokens).
- 1536-dimension output is well-suited to ChromaDB's default indexing.

**`gpt-4o-mini`** was chosen for answer generation because:
- It supports the standard Chat Completions API with a simple `messages` array — no need for more complex tool-calling or multi-modal features this project doesn't use.
- It's cost-effective for a project with no production traffic guarantees.

This substitution was confirmed with the internship supervisor before implementation.

## 5. Why ChromaDB (over FAISS)

The task brief allowed either FAISS or ChromaDB. ChromaDB was chosen because:
- It stores **vectors and their metadata together** (chunk text, chunk ID) in one place. FAISS only indexes vectors — chunk text and metadata would need to be tracked separately (e.g., in a parallel Python list or a JSON file), adding bookkeeping code with more room for bugs (like a metadata list falling out of sync with the vector index).
- It persists to disk out of the box (`PersistentClient`), so no extra serialization code was needed to survive a server restart.
- Its Python API (`collection.add()`, `collection.query()`) is higher-level, which kept `vector_store.py` small and readable.

The trade-off: ChromaDB is a heavier dependency than FAISS, and for a single-document tool with a small number of chunks, FAISS's raw search speed advantage is irrelevant here — so this trade-off cost nothing in practice while saving implementation complexity.

## 6. Chunking Strategy

Chunks are built by encoding the full document into tokens with `tiktoken` (the same tokenizer OpenAI's models use), then taking a sliding window: 500 tokens per chunk, sliding forward by `500 - 50 = 450` tokens each time. This produces a 50-token overlap between consecutive chunks.

**Why token-based, not character-based:** character counts don't correspond consistently to token counts (punctuation-heavy or non-English text tokenizes differently than plain English words). Chunking by character count would produce chunks with wildly inconsistent actual token sizes, which matters because the embedding model and the context window are both measured in tokens, not characters.

**Why overlap:** without it, a sentence that happens to fall across a chunk boundary would be split, and neither resulting chunk would contain the complete idea — degrading retrieval quality for questions about that content.

## 7. Retrieval Strategy

On each question:
1. The question is embedded with the same model used for chunks (`text-embedding-3-small`) — this is required, since embeddings from different models are not comparable in the same vector space.
2. ChromaDB returns the **top 3** chunks by cosine similarity.

**A real bug found during development:** ChromaDB's default distance metric is L2 (Euclidean), not cosine similarity. The code was converting distance to a similarity score with `score = 1 - distance`, which only produces a meaningful 0–1 range under cosine distance. Under L2, this produced misleadingly small scores (e.g., `0.06` for a clearly correct match). The fix was to explicitly configure the collection with `metadata={"hnsw:space": "cosine"}` when creating it. This is a good example of why the underlying similarity metric of a vector store should never be assumed — it should be verified.

## 8. Grounding and Hallucination Prevention

The chat model is given a strict system prompt:

> "Answer only using the information in the given context... If the answer cannot be found in the context, clearly say [it isn't available]... Do not use outside knowledge."

This is reinforced by:
- `temperature=0.2` — low temperature biases the model toward the literal content it was given, rather than more "creative" (and more hallucination-prone) completions.
- Retrieved chunks are the *only* document content the model ever sees — it has no access to the rest of the document, so it cannot accidentally draw on parts of the document outside the top-3 retrieved chunks either.

This was verified manually by asking a question with no relevant content in the source document and confirming the model responded that the information wasn't available, rather than guessing.

## 9. Data Flow Summary

```
React (Vite)              FastAPI                  OpenAI API           ChromaDB
    |                         |                          |                   |
    |-- POST /api/upload ---->|                          |                   |
    |                         |-- extract + chunk        |                   |
    |                         |-- embed chunks --------->|                   |
    |                         |<-- embeddings ------------|                   |
    |                         |-- store chunks --------------------------->|
    |<-- upload response -----|                                              |
    |                         |                                              |
    |-- POST /api/ask ------->|                                              |
    |                         |-- embed question -------->|                   |
    |                         |<-- embedding --------------|                   |
    |                         |-- query top-3 ------------------------------->|
    |                         |<-- chunks ------------------------------------|
    |                         |-- chat completion ------->|                   |
    |                         |<-- grounded answer --------|                   |
    |<-- answer + sources ----|                                              |
```

## 10. Challenges Faced & Solutions

| Challenge | Solution |
|---|---|
| `text-embedding-004` was deprecated mid-project | Substituted OpenAI `text-embedding-3-small`, confirmed with supervisor |
| ChromaDB similarity scores looked wrong (very low, e.g. 0.06) | Diagnosed as a distance-metric mismatch (L2 vs cosine); explicitly configured `hnsw:space: cosine` on the collection |
| Drag-and-drop file upload bypassed the file type restriction | The HTML `accept` attribute only filters the native file picker dialog, not `dataTransfer` on drop — added explicit extension validation in the drop handler itself |
| Keeping retrieval accurate without page-level citations | Chunking uses token-based sliding windows without page boundary tracking; citations are chunk-level, not page-level |


## 11. Trade-offs

- **No database (PostgreSQL, etc.)** — deliberately out of scope. This is a single-document, single-session tool; there is no user data, chat history, or multi-document state that would justify relational storage. Adding one would be complexity without a corresponding requirement.
- **No conversation memory** — each question is treated independently (embedded and retrieved fresh). This keeps the RAG pipeline simple and matches how the task brief describes the feature (a single-document Q&A tool, not a multi-turn assistant). The trade-off is that follow-up questions like "what about the second point?" won't have prior-turn context.
- **Re-running chunking/embedding on every upload, discarding the previous document** — simpler than supporting multiple documents, at the cost of not being able to compare across documents. This matches the task's explicit single-document scope.

## 12. Future Architecture Improvements

- OCR support for scanned (image-only) PDFs, since the current pipeline relies entirely on extractable text layers.
- Page-level citation tracking (would require carrying page boundaries through the chunking step).
- Streaming answers token-by-token via Server-Sent Events, instead of waiting for the full completion.
- Optional session-level conversation memory, passed explicitly as prior turns in the prompt rather than stored server-side.
- Multi-document support, which would require namespacing ChromaDB collections per document instead of a single shared collection.