---
id: opencode
title: OpenCode Integration
sidebar_position: 5
---

# OpenCode Integration

This guide explains how to configure **OpenCode** to work with your Cube AI instance.  
OpenCode is an AI-powered code editor that can use the models hosted through Cube AI for code generation, editing, and general LLM assistance.

---

## Prerequisites

Before you begin, ensure you have:

- A running **Cube AI** instance  
- **OpenCode** installed locally  
- A Cube AI user account with an authentication token  
- A Cube AI domain with at least one coding-capable model pulled (e.g., Qwen Coder models)

---

## 1. Get Your Authentication Token

If you do not already have a Cube AI access token, generate one from the UI:

**UI:**  
`Profile → Tokens → Create Token`

Or via API:

```bash
curl -ksSiX POST https://<cube-ai-instance>/users/tokens/issue   -H "Content-Type: application/json"   -d '{
    "username": "<your_email>",
    "password": "<your_password>"
  }'
```

Copy the `access_token` from the response.

---

## 2. Pull Recommended Coding Models

Before using OpenCode, ensure that coding models are available in your Cube AI domain.

The most commonly recommended ones:

- `qwen2.5-coder:7b-instruct-q4_K_M`
- `qwen2.5-coder:3b`
- `deepseek-coder:6.7b-instruct-q4_K_M`

Pull a model using:

```bash
curl -k -X POST https://<cube-ai-instance>/proxy/<your_domain_id>/api/pull   -H "Authorization: Bearer <your_access_token>"   -d '{
    "name": "qwen2.5-coder:7b-instruct-q4_K_M"
  }'
```

---

## 3. Verify Available Models

To list all models available to your domain:

```bash
curl -k https://<cube-ai-instance>/proxy/<your_domain_id>/v1/models   -H "Authorization: Bearer <your_access_token>"
```

You should see the models you pulled earlier.

---

## 4. Install OpenCode

Follow installation instructions from the official guide:

👉 https://opencode.ai

Once installed, OpenCode will create its configuration folder:

```
~/.config/OpenCode/
```

---

## 5. Configure OpenCode to Use Cube AI

Edit (or create) the file:

```
~/.config/OpenCode/config.json
```

Add:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "cube/qwen2.5-coder:7b-instruct-q4_K_M",
  "provider": {
    "cube": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Cube AI",
      "options": {
        "baseURL": "https://<cube-ai-instance>/proxy/<your_domain_id>/v1",
        "apiKey": "<your_access_token>"
      },
      "models": {
        "qwen2.5-coder:7b-instruct-q4_K_M": {
          "name": "Qwen 2.5 Coder 7B - Main",
          "tool_call": false,
          "reasoning": false
        }
      }
    }
  }
}
```

### Replace:
- `<cube-ai-instance>` → usually `localhost`  
- `<your_domain_id>` → the domain you created  
- `<your_access_token>` → the token from Step 1  

### Important:
- Use **HTTPS** (`https://...`) unless Cube AI is explicitly running without TLS.

---

## 6. Verify OpenCode Connection

Open your OpenCode editor.

Run:

```
opencode /models
```

You should see something like:

![OpenCode Models](/img/opencode-models.png)

Select a model (e.g., `cube/qwen2.5-coder:7b-instruct-q4_K_M`).

Try a simple request:

![OpenCode Example](/img/opencode-example.png)

---

## Supported Features

Once configured, OpenCode can use Cube AI for:

### ✅ Code Generation  
Autocompletions, refactors, code rewrites, explanations.

### ✅ Chat  
General LLM interaction, documentation queries, reasoning help.

### ✅ Tools (if model supports it)  
File operations, command execution, multi-step coding workflows.

---

## Troubleshooting

### ❌ Connection refused
- Ensure Cube AI is running (`make up`)
- Check firewall rules
- Verify HTTPS / TLS configuration

### ❌ Authentication error
- Your token may have expired  
- Check for missing `"Authorization: Bearer"` header  
- Ensure the token belongs to the same domain

### ❌ Certificate errors (self-signed certs)
If you are running Cube locally with self-signed certificates:

- Ensure OpenCode has access to your local CA certificate  
- Or temporarily use **HTTP** instead of HTTPS for local development

---

## Summary

You have now successfully connected OpenCode to your Cube AI instance.  
This allows you to use powerful open-source coding models locally with full **privacy**, **TEE security**, and **domain isolation**.
