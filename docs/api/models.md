---
id: models
title: Models
---

This endpoint lists all models available to a specific Cube AI domain.

The returned models depend on:

- The domain configuration
- The selected backend (Ollama or vLLM)
- Which models have been pulled or uploaded

---

## Endpoint

```http
GET /proxy/{domain_id}/v1/models
```

---

## Example Request

```bash
curl -k https://localhost/proxy/<domain_id>/v1/models \
  -H "Authorization: Bearer <access_token>"
```

---

## Example Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "tinyllama:1.1b",
      "object": "model",
      "owned_by": "library"
    },
    {
      "id": "starcoder2:3b",
      "object": "model",
      "owned_by": "library"
    }
  ]
}
```

---

## Notes

- Model IDs are backend-specific (Ollama / vLLM)
- Models are isolated per domain
- All inference runs inside a Trusted Execution Environment (TEE)
