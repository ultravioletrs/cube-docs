---
id: embeddings
title: Embeddings
---

# Embeddings

The embeddings endpoint allows you to generate vector representations of text.
These vectors can be used for semantic search, clustering, retrieval-augmented
generation (RAG), and similarity comparisons.

Cube AI embeddings are generated inside **Trusted Execution Environments (TEEs)**,
ensuring that input text and resulting vectors remain confidential.

---

## Endpoint

```
POST /proxy/{domain_id}/v1/embeddings
```

---

## Example Request

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

## Response

Returns an OpenAI-compatible `embeddings` response object containing one or more
embedding vectors.

---

## Notes

- Embeddings are **domain-scoped**
- Input text is processed securely inside a TEE
- Use embedding models such as `nomic-embed-text` for best results
