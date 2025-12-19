---
id: translations
title: Translations
---

## Translations

Translate text between languages using supported speech and language models.

> This endpoint is optional and may not be enabled in all Cube AI deployments.

## Endpoint

```
POST /proxy/{domain_id}/v1/audio/translations
```

## Example Request

```bash
curl -k https://localhost/proxy/<domain_id>/v1/audio/translations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@speech.wav" \
  -F "model=whisper-1"
```

## Notes

- API is compatible with OpenAI translation endpoints
- Audio processing runs inside a Trusted Execution Environment (TEE)
- Model availability depends on backend configuration
