---
id: embeddings
title: Embeddings & RAG
---

Large Language Models (LLMs) are powerful, but they **do not know your private or internal data**.
They are trained on public information and cannot access your documents, databases, or source
code unless you explicitly provide that context.

This is the problem that **Embeddings** and **Retrieval-Augmented Generation (RAG)** address.

> **Cube AI scope**
>
> Cube AI provides **secure embeddings generation and LLM execution**.
> It does **not** provide a built-in vector database or retrieval layer.
> In a RAG setup, storing embeddings and retrieving relevant context is handled
> by the application or integration layer outside of Cube AI.

All requests are authenticated using **Personal Access Tokens (PATs)**.

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

Embeddings allow applications using Cube AI to:

- compare text by semantic similarity
- search documents by meaning instead of keywords
- retrieve relevant context for LLM prompts

In simple terms:

> Embeddings make text **searchable by meaning**, not just by keywords.

---

## What Is RAG?

**Retrieval-Augmented Generation (RAG)** is an architectural pattern where:

1. Data is converted into embeddings
2. Relevant content is retrieved using a vector database
3. Retrieved content is injected into an LLM prompt
4. The LLM generates an answer grounded in that context

---

## Embeddings API Reference

### Endpoint

```text
POST /proxy/{domain_id}/v1/embeddings
```

---

### Example Request

```bash
curl -k https://localhost/proxy/<domain_id>/v1/embeddings \
  -H "Authorization: Bearer <pat>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nomic-embed-text:v1.5",
    "input": "Cube AI embeddings"
  }'
```

---

## Real-World Example: Internal Documentation Search

This example demonstrates a simple, real-life use case for embeddings and RAG
using Cube AI.

### Scenario

You have internal documentation and want to answer the following question:

**How does Cube AI authentication work?**

The documentation must remain private and must not be sent to external LLM
providers.

---

### Step 1: Prepare a Document Chunk

```text
Cube AI uses domain-scoped access tokens for authentication.
Each request must include a Bearer token issued for a specific domain.
```

---

### Step 2: Generate an Embedding for the Document

```bash
curl -k https://localhost/proxy/<domain_id>/v1/embeddings \
  -H "Authorization: Bearer <pat>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nomic-embed-text:v1.5",
    "input": "Cube AI uses domain-scoped access tokens for authentication."
  }'
```

The returned vector is stored in a vector database outside of Cube AI.

---

### Step 3: Generate an Embedding for the User Question

```bash
curl -k https://localhost/proxy/<domain_id>/v1/embeddings \
  -H "Authorization: Bearer <pat>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nomic-embed-text:v1.5",
    "input": "How does Cube AI authentication work?"
  }'
```

---

### Step 4: Retrieve Relevant Context

```text
Cube AI uses domain-scoped access tokens for authentication.
Each request must include a Bearer token issued for a specific domain.
```

---

### Step 5: Generate the Final Answer (RAG)

The retrieved text is injected into a chat completion prompt.
Cube AI then generates an answer grounded in the internal documentation.

---

### Why This Works

- Private documents never leave your Cube AI environment
- Embeddings and inference run inside a Trusted Execution Environment (TEE)
- The LLM answers questions using retrieved, relevant context
- Hallucinations are reduced and answers are verifiable

---

### Notes

- Requests are authenticated using **Personal Access Tokens (PATs)**
- Embeddings are **domain-scoped**
- Input text is processed securely inside a **Trusted Execution Environment (TEE)**
- Use embedding models such as `nomic-embed-text` for best results
