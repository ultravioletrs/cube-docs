---
id: models
title: Models
---

Cube AI exposes language models through a **domain-scoped models registry**.

In Cube AI, a *domain* represents an isolated workspace that groups users,
permissions, configuration, and available models. Each domain has its own
isolated view of which models are available for inference.

This endpoint allows clients to discover which models can be used within
a specific Cube AI domain (workspace).

Models in Cube AI are used by:

- Chat Completions
- Continue (VS Code integration)
- Direct API-based inference

> **Cube AI scope**
>
> Cube AI acts as a **secure model execution layer**.
> It is responsible for model isolation, routing, and inference execution
> inside **Trusted Execution Environments (TEEs)**.
> Cube AI does **not** define model architectures or training pipelines.

---

## What Is a Model in Cube AI?

![Cube AI models registry overview](/img/models-registry.png)

A *model* in Cube AI represents a **deployable inference target** exposed by the
configured backend.

The available models depend on:

- Domain configuration
- Selected backend (**Ollama** or **vLLM**)
- Models that have been pulled, loaded, or registered by the operator

Each domain has an **isolated view** of available models, meaning that models
enabled in one domain are not automatically visible or accessible in another.

---

## Backends

### Ollama

When using Ollama as a backend, models are referenced by their Ollama identifiers
(e.g. `tinyllama:1.1b`, `starcoder2:3b`).

Models must be pulled into Ollama before they appear in Cube AI.

### vLLM

When using vLLM, models correspond to server-side model deployments configured
by the operator.

Model availability depends on the vLLM runtime configuration.

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

- Models are **domain-scoped**, meaning their visibility and usage are limited
  to the domain (workspace) in which they are configured
- Model identifiers are backend-specific (Ollama / vLLM)
- Cube AI does **not** manage model training or fine-tuning
- All inference is executed inside a Trusted Execution Environment (TEE)

---

## Next Steps

- Use models with **Chat Completions**
- Connect models to **Continue for VS Code**
- Explore **Embeddings** for semantic search workflows
