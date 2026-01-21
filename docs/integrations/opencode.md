---
id: opencode
title: OpenCode Integration
sidebar_position: 5
---

## OpenCode Integration

This guide explains how to configure **OpenCode** to work with your Cube AI instance.  
OpenCode is an AI-powered code editor that can use the models hosted through Cube AI for code generation, editing, and general LLM assistance.

---

## Prerequisites

Before you begin, ensure you have:

- A running **Cube AI** instance  
- **OpenCode** installed locally  
- A Cube AI user account with a **Personal Access Token (PAT)**  
- A Cube AI domain with at least one coding-capable model pulled  
  (for example: Qwen Coder models)

---

## 1. Create a Personal Access Token (PAT)

OpenCode uses a **Personal Access Token (PAT)** for authentication.

To create a PAT:

1. Log in to the Cube AI UI  
2. Click your profile avatar  
3. Navigate to **Profile → Personal Access Tokens**  
4. Click **Create Token**  
5. Copy and store the token securely  

> PATs are long-lived and are the recommended authentication method for all integrations.

---

## 2. Pull Recommended Coding Models

Before using OpenCode, make sure coding models are available in your Cube AI domain.

Recommended models:

- `qwen2.5-coder:7b-instruct-q4_K_M`
- `qwen2.5-coder:3b`
- `deepseek-coder:6.7b-instruct-q4_K_M`

Pull a model using:

```bash
curl -k -X POST https://<cube-ai-instance>/proxy/<your_domain_id>/api/pull \
  -H "Authorization: Bearer <pat>" \
  -d '{
    "name": "qwen2.5-coder:7b-instruct-q4_K_M"
  }'
```

---

## 3. Verify Available Models

To list all models available in your domain:

```bash
curl -k https://<cube-ai-instance>/proxy/<your_domain_id>/v1/models \
  -H "Authorization: Bearer <pat>"
```

You should see the models you pulled earlier.

---

## 4. Install OpenCode

Follow installation instructions from the official guide:

[OpenCode](https://opencode.ai)

Once installed, OpenCode will create its configuration folder:

```bash
~/.config/OpenCode/
```

---

## 5. Configure OpenCode to Use Cube AI

Edit or create the configuration file:

```json
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
        "apiKey": "<pat>"
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

### Replace

- `<cube-ai-instance>` → usually `localhost`  
- `<your_domain_id>` → the domain ID  
- `<pat>` → your Cube AI **Personal Access Token**  

### Important

Use **HTTPS** (`https://...`) unless Cube AI is explicitly running without TLS.

---

## 6. Verify OpenCode Connection

In the OpenCode editor, run:

```text
opencode /models
```

You should see your Cube AI models listed.

Try a simple prompt to verify everything works.

---

## Troubleshooting

### ❌ Authentication error

- Ensure the **PAT** is valid  
- Verify `"Authorization: Bearer <pat>"` is sent internally  
- Confirm the token belongs to a user with access to the domain  

### ❌ Connection issues

- Ensure Cube AI is running (`make up`)  
- Verify HTTPS/TLS configuration  
- Check firewall rules  

---

## Summary

You have successfully connected OpenCode to your Cube AI instance using
**Personal Access Tokens (PATs)**.

This setup enables secure, private, and domain-isolated coding assistance
powered by Cube AI models.
