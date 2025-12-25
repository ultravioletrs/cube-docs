---
id: embeddings
title: Embeddings & RAG
---

# Embeddings & Retrieval-Augmented Generation (RAG)

Large Language Models (LLMs) are powerful, but they **do not know your private or internal data**.
They are trained on public information and cannot access your documents, databases, or source
code unless you explicitly provide that context.

This is the problem that **Embeddings** and **Retrieval-Augmented Generation (RAG)** solve.

---

## The Problem LLMs Have

Without embeddings and RAG:

- LLMs cannot answer questions about private data
- responses are often generic or inaccurate
- models may hallucinate answers
- updating knowledge requires retraining (slow and expensive)

---

## What Are Embeddings?

An **embedding** is a numerical (vector) representation of text that captures its meaning.

Embeddings allow Cube AI to:

- compare text by semantic similarity
- search documents by meaning instead of keywords
- retrieve relevant context for LLM prompts

In simple terms:

> Embeddings allow Cube AI to understand and search your data.

Cube AI embeddings are generated inside **Trusted Execution Environments (TEEs)**,
ensuring that both input text and resulting vectors remain confidential.

---

## What Is RAG?

**Retrieval-Augmented Generation (RAG)** is a technique where:

1. Your data is converted into embeddings
2. Relevant content is retrieved based on a user query
3. The retrieved content is injected into the LLM prompt
4. The model generates an answer grounded in your data

Instead of asking the model to guess, RAG lets it **answer using facts you provide**.

---

## How RAG Works in Cube AI

<!-- IMAGE: rag-flow-diagram -->
<!-- Diagram: Documents → Embeddings → Vector Store → Retrieved Context → LLM -->

The RAG flow in Cube AI looks like this:

1. Documents are split into chunks
2. Each chunk is converted into an embedding
3. Embeddings are stored in a vector database
4. A user asks a question
5. Cube AI retrieves the most relevant chunks
6. The LLM generates an answer using retrieved context

All processing stays inside your Cube AI deployment.

---

## Why Use RAG with Cube AI?

Using RAG enables:

- chat over internal documentation
- question answering over PDFs and files
- AI assistants for support and operations
- safer and more accurate LLM responses
- no data leakage to external providers

---

## Common Use Cases

### Internal Documentation Assistant
Ask questions about internal docs, wikis, or README files.

### Support & Helpdesk Bots
Answer customer questions using company knowledge bases.

### Codebase Search
Query large repositories using natural language.

### Knowledge-Based AI Assistants
Build enterprise-grade ChatGPT-like systems backed by private data.

---

## Embeddings API Reference

The embeddings endpoint allows you to generate vector representations of text.
These vectors can be used for semantic search, clustering, retrieval-augmented
generation (RAG), and similarity comparisons.

---

### Endpoint

```http
POST /proxy/{domain_id}/v1/embeddings
```

---

### Example Request

```bash
curl -k https://localhost/proxy/<domain_id>/v1/embeddings \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nomic-embed-text:v1.5",
    "input": "Cube AI embeddings"
  }'
```

---

### Response

Returns an OpenAI-compatible `embeddings` response object containing one or more
embedding vectors.

---

### Notes

- Embeddings are **domain-scoped**
- Input text is processed securely inside a TEE
- Use embedding models such as `nomic-embed-text` for best results

---

## Next Steps

- Combine Embeddings with **Chat Completions**
- Explore available **Models**
- Build a complete RAG pipeline using Cube AI
